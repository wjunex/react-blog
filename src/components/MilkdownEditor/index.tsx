"use client";

import "@milkdown/crepe/theme/common/style.css";
import "./editor.css";

import { Crepe } from "@milkdown/crepe";
import { useEffect, useRef } from "react";
import { blogCodeTheme } from "./cm-theme";

const THEME_LINK_ID = "milkdown-frame-theme";

interface MilkdownEditorProps {
  defaultValue?: string;
  onChange?: (markdown: string) => void;
  onSave?: () => void;
  onUpload?: (file: File) => Promise<string>;
  readonly?: boolean;
  placeholder?: string;
  padding?: string;
}

function setPadding(padding: string) {
  document.querySelectorAll(".ProseMirror").forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.padding = padding;
    }
  });
}

function getTheme(): string {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.dataset.theme;
  return attr === "dark" ? "dark" : "light";
}

function loadThemeCSS(theme: string) {
  if (typeof document === "undefined") return;
  const href = `/milkdown/frame${theme === "dark" ? "-dark" : ""}.css`;
  const old = document.getElementById(THEME_LINK_ID);
  const link = document.createElement("link");
  link.id = `${THEME_LINK_ID}-${theme}`;
  link.rel = "stylesheet";
  link.href = href;
  link.onload = () => {
    old?.remove();
    link.id = THEME_LINK_ID;
  };
  document.head.appendChild(link);
}

export default function MilkdownEditor({
  defaultValue = "",
  onChange,
  onSave,
  onUpload,
  readonly = false,
  placeholder = "开始写作...",
  padding = "0",
}: MilkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);
  const mountedRef = useRef(true);
  const defaultValueRef = useRef(defaultValue);
  const onSaveRef = useRef(onSave);
  const onUploadRef = useRef(onUpload);
  defaultValueRef.current = defaultValue;
  onSaveRef.current = onSave;
  onUploadRef.current = onUpload;

  useEffect(() => {
    let cancelled = false;
    mountedRef.current = true;
    const init = async () => {
      if (!containerRef.current) return;
      const crepe = new Crepe({
        root: containerRef.current,
        defaultValue: defaultValueRef.current,
        features: {},
        featureConfigs: {
          [Crepe.Feature.Placeholder]: {
            text: placeholder,
            mode: "block",
          },
          [Crepe.Feature.CodeMirror]: {
            theme: blogCodeTheme,
          },
          ...(onUploadRef.current
            ? {
                [Crepe.Feature.ImageBlock]: {
                  onUpload: async (file: File) => {
                    const url = await onUploadRef.current!(file);
                    return url;
                  },
                },
              }
            : {}),
        },
      });
      await crepe.create();
      if (cancelled || !mountedRef.current) {
        crepe.destroy();
        return;
      }
      crepeRef.current = crepe;
      crepe.setReadonly(readonly);
      loadThemeCSS(getTheme());
      setPadding(padding);
      crepe.on((listener: any) => {
        listener.updated(() => {
          const content = crepe.getMarkdown();
          onChange?.(content);
        });

        const handleKeydown = (e: KeyboardEvent) => {
          if ((e.key === "s" || e.key === "S") && e.ctrlKey) {
            e.preventDefault();
            onSaveRef.current?.();
          }
        };
        listener.focus(() => window.addEventListener("keydown", handleKeydown));
        listener.blur(() => {
          window.removeEventListener("keydown", handleKeydown);
          onSaveRef.current?.();
        });
      });
    };
    init();
    return () => {
      cancelled = true;
      mountedRef.current = false;
      crepeRef.current?.destroy();
      crepeRef.current = null;
    };
  }, []);

  // sync readonly
  useEffect(() => {
    crepeRef.current?.setReadonly(readonly);
  }, [readonly]);

  // sync padding
  useEffect(() => {
    setPadding(padding);
  }, [padding]);

  // watch theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      loadThemeCSS(getTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="milkdown-editor-wrapper flex flex-col min-h-[60vh]" />
  );
}
