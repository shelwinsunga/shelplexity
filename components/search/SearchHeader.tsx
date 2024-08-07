import { Separator } from "@/components/ui/separator";

export default function SearchHeader({ query }: { query: string | null }) {
  const isLongQuery = query && query.length > 50; 

  return (
    <>
      {isLongQuery ? (
        <>
          <p className="text-xl font-medium mb-6 pb-2 ">
            {query?.slice(0, 150)}...
          </p>
          <Separator className="mb-6" />
        </>
      ) : (
        <h1 className="text-3xl font-semibold mb-6">{query}</h1>
      )}
    </>
  );
}
