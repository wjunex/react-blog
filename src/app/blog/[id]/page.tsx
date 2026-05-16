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

  return (
    <article>
      <MDXContent source={data.content} />
    </article>
  );
}
