import List from "@/components/List/List";

type MomentsProps = {
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

export default async function Moments({ searchParams }: MomentsProps) {
  const query = await searchParams;
  const pageNum = getQueryNumber(query.pageNum, 1);
  const pageSize = getQueryNumber(query.pageSize, 10);

  return (
    <section className="space-y-6">
      <div className="border-b border-[var(--border)] pb-6">
        <p className="text-sm font-medium text-[var(--accent)]">Moments</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)]">
          动态
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          一些零碎的、即时的想法和记录。
        </p>
      </div>
      <List
        pageNum={pageNum}
        pageSize={pageSize}
        type={2}
        basePath="/moments"
      />
    </section>
  );
}
