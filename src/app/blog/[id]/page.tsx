import { getBlogDetails } from "@/api";
import MDXContent from "@/components/MDXContent";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BlogDetail({ params }: Props) {
  const { id } = await params;
  const data = await getBlogDetails({
    id,
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{data.title}</h1>
      <MDXContent source={data.content} />
    </div>
  );
}
