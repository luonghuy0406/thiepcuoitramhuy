"use client";

import React, { useState, useEffect } from "react";
import EnvelopeModalV1 from "./EnvelopeModalV1";
import EnvelopeModalV2 from "./EnvelopeModalV2";

interface EnvelopeModalProps {
  onStart?: () => void;
  onOpened: () => void;
  version?: "v1" | "v2";
}

export default function EnvelopeModal({
  onStart,
  onOpened,
  version: propVersion,
}: EnvelopeModalProps) {
  // Default is version 2 as requested ("Mặc định nếu không có param sẽ là version hiện tại")
  const [activeVersion, setActiveVersion] = useState<"v1" | "v2">(
    propVersion || "v2"
  );

  useEffect(() => {
    if (propVersion) {
      setActiveVersion(propVersion);
      return;
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paramVal = (
        params.get("v") ||
        params.get("version") ||
        params.get("welcome") ||
        ""
      ).toLowerCase();

      if (paramVal === "1" || paramVal === "v1") {
        setActiveVersion("v1");
      } else {
        setActiveVersion("v2");
      }
    }
  }, [propVersion]);

  if (activeVersion === "v1") {
    return <EnvelopeModalV1 onStart={onStart} onOpened={onOpened} />;
  }

  return <EnvelopeModalV2 onStart={onStart} onOpened={onOpened} />;
}
