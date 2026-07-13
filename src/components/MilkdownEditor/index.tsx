"use client";

import "@milkdown/crepe/theme/common/style.css";
import "./editor.css";

import { Crepe } from "@milkdown/crepe";
import { useCallback, useEffect, useRef } from "react";
import { blogCodeTheme } from "./cm-theme";

const THEME_LINK_ID = "milkdown-frame-theme";

interface MilkdownEditorProps {
  defaultValue?: string;
  onChange?: (markdown: string) => void;
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
  readonly = false,
  placeholder = "开始写作...",
  padding = "0",
}: MilkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);
  const defaultValueRef = useRef(defaultValue);
  defaultValueRef.current = defaultValue;

  const initEditor = useCallback(async () => {
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
      },
    });

    await crepe.create();
    crepeRef.current = crepe;
    crepe.setReadonly(readonly);
    loadThemeCSS(getTheme());
    setPadding(padding);

    crepe.on((listener: any) => {
      listener.updated(() => {
        const content = crepe.getMarkdown();
        onChange?.(content);
      });
    });
  }, []);

  useEffect(() => {
    initEditor();
    return () => {
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
