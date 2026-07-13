"use client";

import { useEffect, useState } from "react";
import MilkdownEditor from "@/components/MilkdownEditor";
import { formatDate } from "@/utils";
import { apiCategoryDelete, apiCategoryList, apiCategorySave, apiTagDelete, apiTagList, apiTagSave } from "@/api/generated";
import type { Category, Tag } from "@/api/generated/models";

const defaultContent = `> 当一个人又写接口又写前端的时候，最大的痛苦莫过于接口改动后还要修改前端项目并重新部署。

以前在项目少、接口不多的时候还没有感觉。现在项目多了之后，改动一个接口就要去使用这个接口的前端项目挨个改。尤其是加了TS之后，还要手动维护类型标注，头更痛了。

我司使用的是YAPI，研究一下发现太重了，并且配置复杂。我找到了一个更轻量、配置更少的解决方案： Ovral。

我的JAVA项目一开始就配置有[swagger](https://swagger.io/)，能自动根据你接口上的注解生成api文档。而Ovral又正好能根据这个文档，在你的前端项目直接生成接口方法和TS的类型标注，不管是Vue项目还是React都能用。

## 基础配置

直接安装依赖：

\`\`\`
npm install orval -D
\`\`\`

在前端项目的根目录下新建orval.config.ts：

\`\`\`ts
import { defineConfig } from 'orval';

export default defineConfig({
  projectName: {  // 这个名字可以随便改，推荐叫后端项目名
    input: 'https://xxxxxxx/v3/api-docs', // Java项目生成的接口文档
    output: {
      mode: 'single', // 不拆分文件，所有接口放在一个ts文件里
      target: 'src/api/generated/index.ts', // 生成的接口放在这个文件
      schemas: 'src/api/generated/models', //生成的ts类型放在这里
      indexFiles: true,
      clean: true // 每次拉取接口时是否清空上次生成的
    },
  },
  // 如果要从多个后端项目中拉取api，从这继续往下配置
});
\`\`\`

最后在package.json中配置运行命令：

\`\`\`json
{
  "scripts": {
    "api": "orval"
  }
}
\`\`\`

直接运行以下命令：

\`\`\`shell
npm run api
\`\`\`

理论上来说这时候就生成成功了，直接可以从src/api/generated/index.ts文件中import你需要的接口就行了。

## 进阶配置

很多前端项目应该都会自己封装一个拦截器来控制每个接口携带Token、统一处理接口报错等。

上面的基础配置默认使用自己的fetch来调用接口。如果你使axios，或者自己封装了拦截器，那么这时候我们就需要一个mutator了。

它相当于一个工具函数。配置之后，调用生成的接口就会将你传给接口的参数传给这个工具函数，然后你直接在这个工具函数中用这些参数给你的拦截器。这样每个接口都会经过拦截器了，对原有代码的功能和配置毫无影响。

我们直接新建一个mutator.ts：

\`\`\`ts
import { request } from './fetcher'; // 引用你自己的拦截器

export const customInstance = <T>(config: {
  url: string;
  method: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
}): Promise<T> => {
  let url: string = config.url;

  // 如果是GET/DELETE请求，将参数拼在请求地址后面
  if (config.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(config.params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += \`?\${qs}\`;
  }

  // 将接收到的参数给你的拦截器
  return request<T>(url, {
    method: config.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    body: config.data,
    headers: config.headers,
  });
};
\`\`\`

最后在orval.config.ts添加上这个mutator：

\`\`\`ts
import { defineConfig } from 'orval';

export default defineConfig({
  projectName: {
    input: 'https://xxxxxxx/v3/api-docs',
    output: {
      mode: 'single',
      target: 'src/api/generated/index.ts',
      schemas: 'src/api/generated/models',
      indexFiles: true,
      clean: true,
      override: {
        mutator: {
          path: 'src/api/mutator.ts',  // 刚才创建的文件
          name: 'customInstance', // mutator中方法的名称，根据这个生成代码，要和mutator文件中的方法保持一致
        },
      },
    },
  },
});
\`\`\`

重新运行\`npm run api\`后我们来看下生成的结果：

\`\`\`ts
// src/api/generated/index.ts

import { customInstance } from '../mutator';

export const getList = () => {
  return customInstance({
    url: \`/api/list\`,
    method: 'POST'
  });
}
\`\`\`

结构很简单，如果接口是有参数的，它还会帮你自动进行标注，这样引用接口的时候还能提示需要哪些参数，必传但是没传的参数也可以被TS检查出来。

使用的时候直接在业务代码中引用生成的代码就行了：

\`\`\`ts
import { getList } from "src/api/generated/index.ts"

getList().then((res) => {
  // xxx
})
\`\`\`

## 总结

配置上非常简单，花一点时间就能配置好，带来的体验和提升的效率却相当巨大。

当然，前提是你的后端项目要有swagger或者类似的导出接口的功能。配置上也不难，配置之后还能方便的导入到Postman、ApiFox之类的api管理工具中。

Swagger不是唯一的解法，Orval也不是最终的答案。本文只是分析一种前端导入后端API的思路，具体的大家可以根据自身的项目来调整。

如果你有不同的想法，欢迎在评论区交流。
`;

export default function EditorPage() {
  const [content, setContent] = useState(defaultContent);
  const [title, setTitle] = useState("集成Ovral，解决前端手抄API的痛点");

  // 分类 & 标签 — 从 API 获取
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [tagIds, setTagIds] = useState<string[]>([]);
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
      setTagList((prev) =>
        prev.map((t) => (t.id === id ? { ...t, name } : t)).sort((a, b) => {
          const na = a.name || "", nb = b.name || "";
          const aLatin = /^[a-zA-Z]/.test(na);
          const bLatin = /^[a-zA-Z]/.test(nb);
          if (aLatin && !bLatin) return -1;
          if (!aLatin && bLatin) return 1;
          return na.localeCompare(nb);
        }),
      );
    } catch { /* ignore */ }
    setEditingTagId(null);
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
      setTagList((prev) =>
        [...prev, tag].sort((a, b) => {
          const na = a.name || "", nb = b.name || "";
          const aLatin = /^[a-zA-Z]/.test(na);
          const bLatin = /^[a-zA-Z]/.test(nb);
          if (aLatin && !bLatin) return -1;
          if (!aLatin && bLatin) return 1;
          return na.localeCompare(nb);
        }),
      );
      if (tag.id) setTagIds((prev) => [...prev, tag.id!]);
      setNewTagName("");
    } finally {
      setSavingTag(false);
    }
  };

  const selectedCategoryName =
    categoryList.find((c) => c.id === categoryId)?.name || "";

  useEffect(() => {
    Promise.all([apiCategoryList(), apiTagList()]).then(([cats, tags]) => {
      setCategoryList(cats || []);
      setTagList((tags || []).sort((a, b) => {
        const na = a.name || "", nb = b.name || "";
        const aLatin = /^[a-zA-Z]/.test(na);
        const bLatin = /^[a-zA-Z]/.test(nb);
        if (aLatin && !bLatin) return -1;
        if (!aLatin && bLatin) return 1;
        return na.localeCompare(nb);
      }));
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
        </div>
      </header>

      {/* 编辑器 — 内容区域，与 MDXContent 位置对齐 */}
      <MilkdownEditor
        key="test"
        defaultValue={defaultContent}
        onChange={setContent}
        placeholder="开始写作..."
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

                <label className="flex items-center gap-2 text-xs text-(--text) cursor-pointer select-none">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={catModal.isSeries}
                    onClick={() => setCatModal((p) => ({ ...p, isSeries: !p.isSeries }))}
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      catModal.isSeries ? "bg-(--accent)" : "bg-(--border-strong)"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        catModal.isSeries ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                  系列文章
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-(--border)">
              <button
                onClick={() => setCatModal((p) => ({ ...p, open: false }))}
                className="px-4 py-2 text-xs rounded-lg text-(--text-soft) hover:bg-(--surface-muted) transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveCategory}
                disabled={!catModal.name.trim() || savingCat}
                className="px-4 py-2 text-xs rounded-lg bg-(--accent) text-white font-medium hover:opacity-85 transition-opacity disabled:opacity-50"
              >
                {savingCat ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除分类确认弹窗 */}
      {confirmDeleteCatId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setConfirmDeleteCatId(null)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-(--surface) border border-(--border) rounded-xl p-6 shadow-lg max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-(--text)">
              确定删除分类 <span className="font-semibold">#{categoryList.find((c) => c.id === confirmDeleteCatId)?.name}</span> ？
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setConfirmDeleteCatId(null)}
                className="px-3 py-1.5 text-xs rounded-lg border border-(--border) text-(--text-soft) hover:bg-(--surface-muted) transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => deleteCategory(confirmDeleteCatId)}
                className="px-3 py-1.5 text-xs rounded-lg bg-(--syntax-red) text-white hover:opacity-85 transition-opacity"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除标签确认弹窗 */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-(--surface) border border-(--border) rounded-xl p-6 shadow-lg max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-(--text)">
              确定删除标签 <span className="font-semibold">#{tagList.find((t) => t.id === confirmDeleteId)?.name}</span> ？
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1.5 text-xs rounded-lg border border-(--border) text-(--text-soft) hover:bg-(--surface-muted) transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => deleteTag(confirmDeleteId)}
                className="px-3 py-1.5 text-xs rounded-lg bg-(--syntax-red) text-white hover:opacity-85 transition-opacity"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
    </>
  );
}
