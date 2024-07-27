import { SearchArea } from '@/components/search/SearchArea';

export default function Page() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 relative flex items-center justify-center h-screen">
        <div className="w-full max-w-2xl">
          <SearchArea />
        </div>
      </div>
    </>
  );
}