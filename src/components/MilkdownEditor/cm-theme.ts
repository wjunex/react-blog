import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView } from "@codemirror/view";

// 与博客 globals.css 中 .mdx-content .hljs-* 配色保持一致，使用 CSS 变量
const blogHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "var(--syntax-purple)" },
  { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
    color: "var(--syntax-red)" },
  { tag: [tags.function(tags.variableName), tags.labelName],
    color: "var(--syntax-blue)" },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
    color: "var(--syntax-orange)" },
  { tag: [tags.definition(tags.name), tags.separator],
    color: "var(--text)" },
  { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace],
    color: "var(--syntax-orange)" },
  { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, tags.special(tags.string)],
    color: "var(--syntax-blue)" },
  { tag: [tags.meta, tags.comment],
    color: "var(--syntax-subtle)" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  { tag: tags.link, color: "var(--syntax-subtle)", textDecoration: "underline" },
  { tag: tags.heading, fontWeight: "bold", color: "var(--syntax-red)" },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
    color: "var(--syntax-orange)" },
  { tag: [tags.processingInstruction, tags.string, tags.inserted],
    color: "var(--syntax-green)" },
  { tag: tags.invalid, color: "var(--syntax-red)" },
]);

const blogEditorTheme = EditorView.theme({
  "&": {
    color: "var(--text)",
    backgroundColor: "var(--code-bg)",
  },
  ".cm-content": {
    caretColor: "var(--accent)",
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--accent)" },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
    { backgroundColor: "color-mix(in srgb, var(--accent) 20%, transparent)" },
  ".cm-gutters": {
    backgroundColor: "var(--code-bg)",
    color: "var(--text-muted)",
    border: "none",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--surface-muted)",
  },
  ".cm-activeLine": {
    backgroundColor: "color-mix(in srgb, var(--accent) 8%, transparent)",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--text-muted)",
  },
}, { dark: false });

export const blogCodeTheme = [blogEditorTheme, syntaxHighlighting(blogHighlightStyle)];
