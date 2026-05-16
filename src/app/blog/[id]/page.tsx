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
      <MDXContent source={data.content} />
    </div>
  );
}
