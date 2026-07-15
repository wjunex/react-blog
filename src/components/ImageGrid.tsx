"use client";

import { useState, type ReactNode } from "react";
import Lightbox from "./Lightbox";

interface Props {
  images: string[];
  size?: number;
  removable?: boolean;
  onRemove?: (index: number) => void;
  preview?: boolean;
  children?: ReactNode;
}

const GRID_GAP = 2;
const OSS_PARAM = "?x-oss-process=image/resize,m_lfit,w_240,h_240";

export default function ImageGrid({ images, size = 120, removable, onRemove, preview, children }: Props) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const total = (images?.length ?? 0) + (children ? 1 : 0);
  if (total === 0) return null;

  return (
    <>
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: GRID_GAP,
          maxWidth: size * 3 + GRID_GAP * 2,
        }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative group aspect-square">
            <img
              src={src + OSS_PARAM}
              alt=""
              className={`object-cover w-full h-full ${preview ? "cursor-pointer" : ""}`}
              onClick={preview ? () => setLightboxSrc(src) : undefined}
            />
            {removable && (
              <button
                onClick={() => onRemove?.(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        {children}
      </div>
      {preview && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </>
  );
}
