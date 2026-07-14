"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import MilkdownEditor from "@/components/MilkdownEditor";
import Badge from "@/components/Badge";
import ConfirmDialog from "@/components/ConfirmDialog";
import ToggleSwitch from "@/components/ToggleSwitch";
import { formatDate, getFirstImage, getPlainText, getSummary, sortTagsByName } from "@/utils";
import { pinyinSlug } from "pinyin-slug";
import type { NoteVO } from "@/api/generated/models";
import { apiCategoryDelete, apiCategoryList, apiCategorySave, apiNoteSave, apiTagDelete, apiTagList, apiTagSave } from "@/api/generated";
import type { Category, Tag } from "@/api/generated/models";

interface Props {
  initialArticle?: NoteVO | null;
  initialType?: number;
}

function EditorPageInner({ initialArticle, initialType }: Props) {
  const articleType = initialType ?? 1;
  const [content, setContent] = useState(initialArticle?.content || "");
  const [title, setTitle] = useState(initialArticle?.title || "");
  const [noteId, setNoteId] = useState<string | undefined>(initialArticle?.id);
  const [slug, setSlug] = useState(initialArticle?.slug || "");

  // 分类 & 标签 — 从 API 获取
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState<string>(initialArticle?.categoryId || "");
  const [tagIds, setTagIds] = useState<string[]>(initialArticle?.tags?.map((t) => t.id!).filter(Boolean) || []);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [savingTag, setSavingTag] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [catModal, setCatModal] = useState<{
    open: boolean;
    id?: string;
    name: string;
    description: string;
    type: "tech" | "life";
    isSeries: boolean;
  }>({ open: false, name: "", description: "", type: "tech", isSeries: false });
  const [savingCat, setSavingCat] = useState(false);
  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(null);

  const openNewCat = () =>
    setCatModal({ open: true, name: "", description: "", type: "tech", isSeries: false });
  const openEditCat = (c: Category) =>
    setCatModal({ open: true, id: c.id, name: c.name || "", description: c.description || "", type: (c.type || "tech") as "tech" | "life", isSeries: c.isSeries ?? false });

  const saveCategory = async () => {
    const { id, name, description, type, isSeries } = catModal;
    const trimmed = name.trim();
    if (!trimmed || savingCat) return;
    setSavingCat(true);
    try {
      await apiCategorySave({ id, name: trimmed, description, type, isSeries });
      const cats = await apiCategoryList() || [];
      setCategoryList(cats);
      const match = id
        ? cats.find((c) => c.id === id)
        : cats.find((c) => c.name === trimmed);
      if (match?.id) setCategoryId(match.id);
      setCatModal((p) => ({ ...p, open: false }));
    } catch { /* ignore */ }
    setSavingCat(false);
  };

  const deleteCategory = async (id: string) => {
    try { await apiCategoryDelete({ id }); } catch { /* ignore */ }
    setCategoryList((prev) => prev.filter((c) => c.id !== id));
    if (categoryId === id) setCategoryId("");
    setConfirmDeleteCatId(null);
  };
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState("");

  const saveTagName = async () => {
    const id = editingTagId;
    const name = editingTagName.trim();
    if (!id || !name) { setEditingTagId(null); return; }
    const original = tagList.find((t) => t.id === id)?.name;
    if (name === original) { setEditingTagId(null); return; }
    try {
      await apiTagSave({ id, name });
      setTagList((prev) => sortTagsByName(prev.map((t) => (t.id === id ? { ...t, name } : t))));
    } catch { /* ignore */ }
    setEditingTagId(null);
  };

  // 保存
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveForm, setSaveForm] = useState({ title: "", slug: "", isPublish: false });

  const openSaveModal = () => {
    const autoTitle = title || getPlainText(content).split(" ").slice(0, 8).join(" ") || "无标题";
    setSaveForm({
      title: autoTitle,
      slug: slug || pinyinSlug(autoTitle),
      isPublish: false,
    });
    setShowSaveModal(true);
  };

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<{ title: string; content: string } | null>(
    initialArticle ? { title: initialArticle.title || "", content: initialArticle.content || "" } : null,
  );
  const saveTitle = title.trim() || getPlainText(content).split(" ").slice(0, 8).join(" ") || "无标题";
  const isDirty = lastSaved && (saveTitle !== lastSaved.title || content !== lastSaved.content);

  const quickSave = async () => {
    if (!content.trim() || saving) return;
    const saveSlug = slug || pinyinSlug(saveTitle);
    setSaving(true);
    try {
      const result = await apiNoteSave({
        id: noteId,
        title: saveTitle,
        slug: saveSlug,
        content,
        categoryId: categoryId || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        summary: getSummary(content),
        textCount: getPlainText(content).length,
        image: getFirstImage(content) || undefined,
        isPublish: false,
        type: articleType,
      });
      if (result?.id) setNoteId(result.id);
      if (!slug) { setSlug(saveSlug); }
      if (!title.trim()) { setTitle(saveTitle); }
      setLastSaved({ title: saveTitle, content });
    } finally {
      setSaving(false);
    }
  };

  const doSave = async () => {
    const trimmedTitle = saveForm.title.trim();
    if (!trimmedTitle || !content.trim() || saving) return;
    setSaving(true);
    try {
      const result = await apiNoteSave({
        id: noteId,
        title: trimmedTitle,
        slug: saveForm.slug.trim(),
        content,
        categoryId: categoryId || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        summary: getSummary(content),
        textCount: getPlainText(content).length,
        image: getFirstImage(content) || undefined,
        isPublish: saveForm.isPublish,
        type: articleType,
      });
      if (result?.id) setNoteId(result.id);
      setLastSaved({ title: saveForm.title.trim(), content });
      setShowSaveModal(false);
    } finally {
      setSaving(false);
    }
  };

  const deleteTag = async (id: string) => {
    try {
      await apiTagDelete({ id });
    } catch { /* ignore */ }
    setTagList((prev) => prev.filter((t) => t.id !== id));
    setTagIds((prev) => prev.filter((tid) => tid !== id));
    setConfirmDeleteId(null);
  };

  const handleDeleteClick = (id: string) => {
    const tag = tagList.find((t) => t.id === id);
    if (tag?.noteCount && Number(tag.noteCount) > 0) return;
    setConfirmDeleteId(id);
  };

  const createTag = async () => {
    const name = newTagName.trim();
    if (!name || savingTag) return;
    setSavingTag(true);
    try {
      const tag = await apiTagSave({ name });
      setTagList((prev) => sortTagsByName([...prev, tag]));
      if (tag.id) setTagIds((prev) => [...prev, tag.id!]);
      setNewTagName("");
    } finally {
      setSavingTag(false);
    }
  };

  const selectedCategoryName =
    categoryList.find((c) => c.id === categoryId)?.name || initialArticle?.categoryName || "";

  useEffect(() => {
    Promise.all([apiCategoryList(), apiTagList()]).then(([cats, tags]) => {
      setCategoryList(cats || []);
      setTagList(sortTagsByName(tags || []));
    });
  }, []);

  useEffect(() => {
    if (!showCatDropdown) return;
    const close = () => setShowCatDropdown(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showCatDropdown]);

  const toggleTag = (id: string) => {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  return (
    <>
      <style>{`@media (max-width: 640px){body{background:var(--surface)!important;background-attachment:scroll!important;}}`}</style>
      <article>
      {/* 文章头部 — 与博客详情页 header 一致 */}
      <header className="border-b border-(--border) pb-6 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
          className="w-full text-2xl font-semibold tracking-tight bg-transparent text-(--text) outline-none placeholder:text-(--text-muted)"
        />
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-(--text-muted)">
          <div className="relative">
            <span
              className={`group/cat relative rounded-full border px-2 py-0.5 text-xs cursor-pointer select-none transition-colors ${
                selectedCategoryName
                  ? "border-(--border-strong) bg-(--surface-muted) hover:border-(--accent) hover:text-(--accent)"
                  : "border-(--border-strong) bg-(--surface-muted)"
              }`}
            >
              <span
                onClick={(e) => { e.stopPropagation(); setShowCatDropdown(!showCatDropdown); }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  const cat = categoryList.find((c) => c.id === categoryId);
                  if (cat) openEditCat(cat);
                }}
              >
                {selectedCategoryName || "未分类"}
              </span>
              {selectedCategoryName && !categoryList.find((c) => c.id === categoryId)?.noteCount && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteCatId(categoryId);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-(--text-muted) text-(--surface) text-[9px] flex items-center justify-center leading-none opacity-0 group-hover/cat:opacity-100 transition-opacity hover:bg-(--syntax-red)"
                >
                  &times;
                </span>
              )}
            </span>
            {showCatDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-(--surface) border border-(--border) rounded-lg shadow-(--shadow) z-10 min-w-[100px] overflow-hidden">
                <div
                  className="cat-dropdown max-h-48 overflow-y-auto py-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div
                    onClick={(e) => { e.stopPropagation(); setCategoryId(""); setShowCatDropdown(false); }}
                    className="px-3 py-1.5 text-xs text-(--text-muted) cursor-pointer hover:bg-(--surface-muted)"
                  >
                    未分类
                  </div>
                  {categoryList.map((c) => {
                    const hasNotes = c.noteCount && Number(c.noteCount) > 0;
                    return (
                      <div
                        key={c.id}
                        className="flex items-center justify-between px-3 py-1.5 hover:bg-(--surface-muted) group/cat"
                      >
                        <span
                          onClick={(e) => { e.stopPropagation(); setCategoryId(c.id!); setShowCatDropdown(false); }}
                          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setShowCatDropdown(false); openEditCat(c); }}
                          className="text-xs text-(--text) cursor-pointer flex-1"
                        >
                          {c.name}
                        </span>
                        <span className="flex items-center gap-0.5 opacity-0 group-hover/cat:opacity-100 transition-opacity">
                          {!hasNotes && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowCatDropdown(false); setConfirmDeleteCatId(c.id!); }}
                              className="w-3.5 h-3.5 rounded-full bg-(--text-muted) text-(--surface) text-[9px] flex items-center justify-center leading-none hover:bg-(--syntax-red) cursor-pointer"
                            >
                              &times;
                            </button>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-(--border) px-3 py-1.5">
                  <div
                    onClick={(e) => { e.stopPropagation(); setShowCatDropdown(false); openNewCat(); }}
                    className="text-xs text-(--accent) cursor-pointer hover:opacity-80"
                  >
                    + 新增分类
                  </div>
                </div>
              </div>
            )}
          </div>
          <time>{formatDate(new Date().toISOString())}</time>
          <span>{content.length} 字</span>
          {lastSaved && (
            <span className="text-xs">
              {saving ? "保存中..." : isDirty ? "未保存" : "已保存"}
            </span>
          )}
        </div>
      </header>

      {/* 编辑器 — 内容区域，与 MDXContent 位置对齐 */}
      <MilkdownEditor
        key={noteId || "new"}
        defaultValue={content}
        onChange={setContent}
        onSave={quickSave}
        placeholder="请输入..."
      />

      {/* 标签选择器 */}
      <div className="mt-10">
        <div className="flex flex-wrap items-center gap-2">
          {tagList.map((tag) => {
            const selected = tagIds.includes(tag.id!);
            const hasNotes = tag.noteCount && Number(tag.noteCount) > 0;
            return (
              <span
                key={tag.id}
                className={`group relative rounded-full border px-2 py-0.5 text-xs select-none transition-colors ${
                  selected
                    ? "border-(--accent) text-(--accent)"
                    : "border-(--border) text-(--text-muted) hover:border-(--accent) hover:text-(--accent)"
                }`}
              >
                {editingTagId === tag.id ? (
                  <input
                    type="text"
                    value={editingTagName}
                    onChange={(e) => setEditingTagName(e.target.value)}
                    onBlur={saveTagName}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveTagName();
                      if (e.key === "Escape") { setEditingTagId(null); }
                    }}
                    className="bg-transparent outline-none text-(--text) text-center"
                    autoFocus
                    size={editingTagName.length || 3}
                  />
                ) : (
                  <span
                    onClick={() => toggleTag(tag.id!)}
                    onDoubleClick={() => { setEditingTagId(tag.id!); setEditingTagName(tag.name || ""); }}
                    className="cursor-pointer"
                  >
                    #{tag.name}
                  </span>
                )}
                {!hasNotes && !editingTagId && (
                  <span
                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(tag.id!); }}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-(--text-muted) text-(--surface) text-[9px] flex items-center justify-center leading-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-(--syntax-red)"
                  >
                    &times;
                  </span>
                )}
              </span>
            );
          })}
          <input
            type="text"
            size={newTagName.length || 5}
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") createTag(); }}
            onBlur={createTag}
            placeholder="+ 新标签"
            disabled={savingTag}
            className="rounded-full border border-dashed border-(--border) px-2 py-0.5 text-xs bg-transparent text-(--text-muted) outline-none placeholder:text-(--text-muted) text-center"
          />
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="mt-6">
        <Button onClick={openSaveModal} size="md" disabled={!content.trim()}>
          {noteId ? "保存" : "保存文章"}
        </Button>
      </div>

      {/* 保存文章弹窗 */}
      {showSaveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowSaveModal(false)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-(--surface) border border-(--border) rounded-xl p-6 shadow-lg max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-(--text) mb-5">
              {noteId ? "编辑文章" : "保存文章"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-(--text-soft) mb-1.5">标题</label>
                <input
                  type="text"
                  value={saveForm.title}
                  onChange={(e) => setSaveForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm text-(--text) outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-colors"
                  maxLength={200}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-(--text-soft) mb-1.5">Slug</label>
                <input
                  type="text"
                  value={saveForm.slug}
                  onChange={(e) => setSaveForm((p) => ({ ...p, slug: e.target.value }))}
                  className="w-full rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm text-(--text) outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-colors font-mono"
                  placeholder="自动生成，可手动修改"
                  required
                />
              </div>
              <ToggleSwitch
                checked={saveForm.isPublish}
                onChange={(v) => setSaveForm((p) => ({ ...p, isPublish: v }))}
                label="公开发布"
              />
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-(--border)">
              <Button variant="ghost" size="sm" onClick={() => setShowSaveModal(false)}>
                取消
              </Button>
              <Button
                onClick={doSave}
                disabled={!saveForm.title.trim() || !saveForm.slug.trim() || !content.trim() || saving}
                size="sm"
              >
                {saving ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 新增/编辑分类弹窗 */}
      {catModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setCatModal((p) => ({ ...p, open: false }))}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-(--surface) border border-(--border) rounded-xl p-6 shadow-lg max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-(--text) mb-5">
              {catModal.id ? "编辑分类" : "新增分类"}
            </h3>

            <div className="space-y-3">
              {/* 名称 */}
              <div>
                <label className="block text-xs font-medium text-(--text-soft) mb-1.5">名称</label>
                <input
                  type="text"
                  value={catModal.name}
                  onChange={(e) => setCatModal((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm text-(--text) outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-colors"
                  placeholder="分类名称"
                  maxLength={50}
                  autoFocus
                />
              </div>

              {/* 描述 */}
              <div>
                <label className="block text-xs font-medium text-(--text-soft) mb-1.5">描述</label>
                <input
                  type="text"
                  value={catModal.description}
                  onChange={(e) => setCatModal((p) => ({ ...p, description: e.target.value }))}
                  className="w-full rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm text-(--text) outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-colors"
                  placeholder="可选"
                  maxLength={200}
                />
              </div>

              {/* 类型 + 系列 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-(--text-soft)">类型</span>
                  <div className="flex rounded-lg border border-(--border) overflow-hidden">
                    {(["tech", "life"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCatModal((p) => ({ ...p, type: t }))}
                        className={`px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                          catModal.type === t
                            ? "bg-(--accent) text-white"
                            : "bg-(--surface) text-(--text-soft) hover:bg-(--surface-muted)"
                        }`}
                      >
                        {t === "tech" ? "技术" : "生活"}
                      </button>
                    ))}
                  </div>
                </div>

                <ToggleSwitch
                  checked={catModal.isSeries}
                  onChange={(v) => setCatModal((p) => ({ ...p, isSeries: v }))}
                  label="系列文章"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-(--border)">
              <Button variant="ghost" size="sm" onClick={() => setCatModal((p) => ({ ...p, open: false }))}>
                取消
              </Button>
              <Button
                onClick={saveCategory}
                disabled={!catModal.name.trim() || savingCat}
                size="sm"
              >
                {savingCat ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDeleteCatId}
        onClose={() => setConfirmDeleteCatId(null)}
        onConfirm={() => deleteCategory(confirmDeleteCatId!)}
        confirmLabel="删除"
      >
        确定删除分类 <span className="font-semibold">#{categoryList.find((c) => c.id === confirmDeleteCatId)?.name}</span> ？
      </ConfirmDialog>

      <ConfirmDialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => deleteTag(confirmDeleteId!)}
        confirmLabel="删除"
      >
        确定删除标签 <span className="font-semibold">#{tagList.find((t) => t.id === confirmDeleteId)?.name}</span> ？
      </ConfirmDialog>
    </article>
    </>
  );
}

export default EditorPageInner;
