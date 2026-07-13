"use client";

import { useState } from "react";
import MilkdownEditor from "@/components/MilkdownEditor";

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
  const [readonly, setReadonly] = useState(false);
  const [title, setTitle] = useState("集成Ovral，解决前端手抄API的痛点");
  const [slug, setSlug] = useState("orval-guide");

  return (
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
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="article-slug"
            className="bg-transparent outline-none text-(--text-muted) placeholder:text-(--text-muted) font-mono text-xs min-w-[120px]"
          />
          <span>{content.length} 字</span>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={readonly}
              onChange={(e) => setReadonly(e.target.checked)}
              className="accent-(--accent)"
            />
            只读
          </label>
        </div>
      </header>

      {/* 编辑器 — 内容区域，与 MDXContent 位置对齐 */}
      <MilkdownEditor
        key="test"
        defaultValue={defaultContent}
        onChange={setContent}
        readonly={readonly}
        placeholder="开始写作..."
      />
    </article>
  );
}
