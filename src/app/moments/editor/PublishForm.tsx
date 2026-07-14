"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Button from "@/components/Button";
import { apiCommonUpload, apiNoteSave } from "@/api/generated";

interface Props {
  initialContent?: string;
  id?: string;
  initialImages?: string[];
}

const GRID_SIZE = 80;

export default function PublishForm({ initialContent = "", id, initialImages = [] }: Props) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [images, setImages] = useState<string[]>(initialImages);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const url = await apiCommonUpload(formData as any, { path: "my/moment" });
        const displayUrl = ((url as any) || "").replace(
          "https://zost.oss-cn-chengdu.aliyuncs.com",
          "https://file.zost.cn",
        );
        setImages((prev) => [...prev, displayUrl]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed && images.length === 0) return;
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await apiNoteSave({
        id: id || undefined,
        content: trimmed,
        type: 2,
        isPublish: true,
        images: images.length > 0 ? images : undefined,
      });
      router.push("/moments");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "发布失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-(--border) pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-(--text)">
          {id ? "编辑动态" : "发布动态"}
        </h1>
        <Button onClick={handleSave} disabled={saving || (!content.trim() && images.length === 0)} size="sm">
          {saving ? "发布中..." : id ? "保存" : "发布"}
        </Button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        placeholder="写点什么..."
        className="block w-full bg-transparent text-sm text-(--text) placeholder:text-(--text-muted) focus:outline-none resize-none p-0 border-0"
      />

      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div
            key={i}
            className="relative group rounded-lg overflow-hidden"
            style={{ width: GRID_SIZE, height: GRID_SIZE }}
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(i)}
              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-dashed border-(--border-strong) flex items-center justify-center hover:border-(--accent) hover:text-(--accent) transition-colors disabled:opacity-50"
          style={{ width: GRID_SIZE, height: GRID_SIZE }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
