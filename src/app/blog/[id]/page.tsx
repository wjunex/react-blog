import { getBlogDetails } from "@/api";

type Props = {
  params: {
    id: string;
  };
};

export default async function BlogDetail({ params }: Props) {
  const { id } = await params;
  const data = await getBlogDetails({
    id,
  });

  console.log(data);

  return <div>{data.content}</div>;
}
