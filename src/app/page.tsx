import List from "@/components/List/List";

type HomeProps = {
  searchParams: Promise<{
    pageNum?: string | string[];
    pageSize?: string | string[];
  }>;
};

function getQueryNumber(
  value: string | string[] | undefined,
  fallback: number,
) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

export default async function Home({ searchParams }: HomeProps) {
  const query = await searchParams;
  const pageNum = getQueryNumber(query.pageNum, 1);
  const pageSize = getQueryNumber(query.pageSize, 10);

  return <List pageNum={pageNum} pageSize={pageSize} />;
}
