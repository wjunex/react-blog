import { getBlogDetails } from "@/api";
import MDXContent from "@/components/MDXContent";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function BlogDetail({ params }: Props) {
  const { id } = await params;
  const data = await getBlogDetails({
    id,
  });
  const date = formatDate(data.createdTime);

  return (
    <article>
      <header className="mb-8 border-b border-[#d8dee4] pb-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[#656d76]">
          {date ? <time dateTime={data.createdTime}>{date}</time> : null}
          {data.categoryName ? (
            <span className="rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2 py-0.5 text-[#57606a]">
              {data.categoryName}
            </span>
          ) : null}
          {data.textCount ? <span>{data.textCount} 字</span> : null}
          {data.views ? <span>{data.views} 阅读</span> : null}
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#1f2328] sm:text-4xl">
          {data.title}
        </h1>
        {data.summary ? (
          <p className="mt-4 text-base leading-7 text-[#57606a]">
            {data.summary}
          </p>
        ) : null}
      </header>
      <MDXContent source={data.content} />
    </article>
  );
}
