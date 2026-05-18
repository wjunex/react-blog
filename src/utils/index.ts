/**
 * 
 * @param markdown 
 * @returns 取出第一个大标题后剩余的文本
 */

export function removeFirstH1(markdown?: string | null) {
  if (!markdown) {
    return "";
  }

  return markdown.replace(/^\s*#\s+.+\n?/, "");
}
