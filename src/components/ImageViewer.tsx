"use client";

import { useState } from "react";
import Lightbox from "./Lightbox";

interface Props {
  children: React.ReactNode;
}

export default function ImageViewer({ children }: Props) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const src = (target as HTMLImageElement).src.replace(/\?.*$/, "");
      setLightboxSrc(src);
    }
  };

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}
