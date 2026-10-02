"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface EnvelopeModalProps {
  onStart?: () => void;
  onOpened: () => void;
}

const VERTEX_SHADER_SRC = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uScale;
uniform vec2 uOffset;

void main() {
  vec2 uv = (vUv - uOffset) / uScale;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec3 col = texture2D(uTex, vec2(uv.x * 0.5, uv.y)).rgb;
  float a = texture2D(uTex, vec2(uv.x * 0.5 + 0.5, uv.y)).r;
  gl_FragColor = vec4(col, a);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function EnvelopeModalV2({ onStart, onOpened }: EnvelopeModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const isSkippedRef = useRef(false);
  const animationFrameIdRef = useRef<number>(0);

  const triggerFadeOut = () => {
    if (isSkippedRef.current) return;
    isSkippedRef.current = true;

    cancelAnimationFrame(animationFrameIdRef.current);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          setIsRemoved(true);
          onOpened();
        },
      });
    } else {
      setIsRemoved(true);
      onOpened();
    }
  };

  const handleOpen = () => {
    if (isPlaying) {
      // Tap again to fast skip
      triggerFadeOut();
      return;
    }

    setIsPlaying(true);
    onStart?.();

    // 1. Fade out the text prompt smoothly
    if (captionRef.current) {
      gsap.to(captionRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.35,
        ease: "power2.out",
      });
    }

    // 2. Fade out poster placeholder immediately so canvas video alpha is clean
    if (posterRef.current) {
      gsap.to(posterRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    // 3. Fade out dark backdrop as the 2 doors swing open to reveal the actual wedding invitation
    if (backdropRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 1.2,
        delay: 0.6,
        ease: "power2.inOut",
      });
    }

    // 4. Play the gatefold opening video
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.warn("Video playback error, skipping to site:", err);
        triggerFadeOut();
      });
    }
  };

  // WebGL Video Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: true,
      alpha: true,
      antialias: false,
    });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Quad geometry (two triangles)
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosLoc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // Video Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

    const uScaleLoc = gl.getUniformLocation(program, "uScale");
    const uOffsetLoc = gl.getUniformLocation(program, "uOffset");

    const aspect = 608 / 1080; // Single frame aspect ratio

    const render = () => {
      if (isSkippedRef.current) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      // Upload video texture when ready
      if (video.readyState >= 2 && video.videoWidth > 0) {
        try {
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            video
          );
        } catch {
          // Ignore occasional safari frame upload glitch
        }
      }

      // Calculate scale & offset (contain aspect ratio)
      const cW = canvas.clientWidth || 1;
      const cH = canvas.clientHeight || 1;
      const screenAspect = cW / cH;

      let scaleX = 1;
      let scaleY = 1;
      let offsetX = 0;
      let offsetY = 0;

      if (screenAspect < aspect) {
        // Taller screen (mobile portrait)
        scaleX = 1;
        scaleY = (cW / aspect) / cH;
        offsetX = 0;
        offsetY = (1 - scaleY) / 2;
      } else {
        // Wider screen (desktop / tablet)
        scaleY = 1;
        scaleX = (cH * aspect) / cW;
        offsetX = (1 - scaleX) / 2;
        offsetY = 0;
      }

      gl.uniform2f(uScaleLoc, scaleX, scaleY);
      gl.uniform2f(uOffsetLoc, offsetX, offsetY);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    // Render initial frame once video metadata / first frame is ready
    const handleLoadedData = () => {
      render();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleLoadedData);

    // When video doors fully open (around 2.7s) or video ends
    const handleTimeUpdate = () => {
      if (video.currentTime >= 2.7 || video.ended) {
        triggerFadeOut();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", triggerFadeOut);

    // Initial render attempt
    render();

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", triggerFadeOut);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  if (isRemoved) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleOpen}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
    >
      {/* Dark Ambient Backdrop (Fades out when doors swing open to reveal site) */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[#dbc8c1]/95 backdrop-blur-xl pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#dfbaba]/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f7d6a5]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Hidden native video source (Alpha-packed H.264 MP4: left RGB, right Alpha mask) */}
      <video
        ref={videoRef}
        src="/assets/video.mp4"
        playsInline
        muted
        preload="auto"
        className="hidden"
      />

      {/* ============================================================== */}
      {/* 1. POSTER PLACEHOLDER (Hiển thị tức thì 0s trước khi video tải) */}
      {/* ============================================================== */}
      <div
        ref={posterRef}
        className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
      >
        <div className="relative w-full h-full max-w-[calc(100vh*608/1080)] max-h-[calc(100vw*1080/608)] aspect-[608/1080] flex items-center justify-center">
          <img
            src="/assets/avorio_rosa-poster.jpg"
            alt="Bìa thiệp cưới"
            className="w-full h-full object-contain pointer-events-none select-none"
            loading="eager"
            decoding="sync"
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. WEBGL CANVAS (Hiển thị video mở 2 cánh & nơ với Alpha thật) */}
      {/* ============================================================== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-20 pointer-events-none"
      />

      {/* ============================================================== */}
      {/* 2. PROMPT: CHẠM ĐỂ MỞ THIỆP (Bottom)                           */}
      {/* ============================================================== */}
      <div
        ref={captionRef}
        className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
      >
        {/* Khung căn chỉnh khớp 100% với tỉ lệ khung hình bìa thiệp video (608 / 1080) */}
        <div className="relative w-full h-full max-w-[calc(100vh*608/1080)] max-h-[calc(100vw*1080/608)] aspect-[608/1080] flex flex-col justify-end items-center pointer-events-none pb-[6%] sm:pb-[7%]">
          <div className="flex flex-col items-center">
            <p className="text-sm sm:text-base font-medium text-[#fcf5eb] tracking-[0.25em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] animate-pulse whitespace-nowrap">
              Chạm để mở thiệp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
