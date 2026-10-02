"use client";

import React, { useEffect, useRef } from "react";

export default function PetalsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Falling hearts & petals configuration
    const itemsCount = 20;
    const items: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      swayOffset: number;
      opacity: number;
      color: string;
      isHeart: boolean;
    }[] = [];

    // Soft, elegant romantic rose-ruby palette: clearly visible without being overly dark
    const colors = [
      "#c76271", // Gentle wine rose
      "#efa0ad", // Soft ruby
      "#cb5a6c", // Romantic rose
      "#d96c7e", // Warm blush rose
      "#e37d8f", // Delicate rose pink
    ];

    for (let i = 0; i < itemsCount; i++) {
      items.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 10 + Math.random() * 10,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: 0.6 + Math.random() * 1.1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.6,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.45 + Math.random() * 0.22,
        color: colors[Math.floor(Math.random() * colors.length)],
        isHeart: Math.random() > 0.15, // 85% cute hearts, 15% soft petals
      });
    }

    // Draw charming heart shape
    const drawHeart = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      const s = size * 0.55;
      // Top center cleft
      ctx.moveTo(0, -s * 0.4);
      // Left lobe curve
      ctx.bezierCurveTo(-s * 0.85, -s * 1.25, -s * 1.6, -s * 0.2, 0, s * 1.25);
      // Right lobe curve
      ctx.bezierCurveTo(s * 1.6, -s * 0.2, s * 0.85, -s * 1.25, 0, -s * 0.4);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    // Draw delicate rose petal shape
    const drawPetal = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(size / 2, -size / 2, size, 0, 0, size * 1.3);
      ctx.bezierCurveTo(-size, 0, -size / 2, -size / 2, 0, 0);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.y += item.speedY;
        item.x += item.speedX + Math.sin(item.y * 0.007 + item.swayOffset) * 0.7;
        item.rotation += item.rotationSpeed;

        if (item.y > height + 25) {
          item.y = -25;
          item.x = Math.random() * width;
        }
        if (item.x > width + 25) item.x = -25;
        if (item.x < -25) item.x = width + 25;

        if (item.isHeart) {
          drawHeart(item.x, item.y, item.size, item.rotation, item.color, item.opacity);
        } else {
          drawPetal(item.x, item.y, item.size, item.rotation, item.color, item.opacity);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 opacity-80"
    />
  );
}
