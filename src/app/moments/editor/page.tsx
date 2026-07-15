"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import ImageGrid from "@/components/ImageGrid";
import { apiCommonUpload, apiNoteSave, apiPublicDetail } from "@/api/generated";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default function NewMomentPage({ searchParams }: Props) {
  const router = useRouter();
  const { id } = use(searchParams);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    apiPublicDetail({ id }).then((data) => {
      setContent(data.content || "");
      setImages(data.images || []);
    }).catch(() => {});
  }, [id]);

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
    <section className="mx-auto max-w-xl space-y-6">
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
          placeholder="写点什么..."
          className="block w-full bg-transparent text-sm text-(--text) placeholder:text-(--text-muted) focus:outline-none resize-none p-0 border-0 field-sizing-content min-h-18"
        />

        <ImageGrid images={images} removable onRemove={removeImage}>
          {uploading && (
            <div
              className="border border-(--border) flex items-center justify-center animate-pulse aspect-square"
            >
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeDasharray="31.4 31.4" strokeLinecap="round" />
              </svg>
            </div>
          )}
          {images.length + (uploading ? 1 : 0) < 9 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="border border-dashed border-(--border-strong) flex items-center justify-center hover:border-(--accent) hover:text-(--accent) transition-colors disabled:opacity-50 aspect-square"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
        </ImageGrid>

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
    </section>
  );
}
