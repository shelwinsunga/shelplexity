import { SearchArea } from '@/components/search/SearchArea';
import { Snail } from 'lucide-react';

export default function Page() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 relative flex flex-col items-center justify-center h-screen">
        <div className="flex items-center mb-8">
          <Snail className="w-12 h-12 mr-4" />
          <h1 className="text-3xl font-semibold">Shelplexity</h1>
        </div>
        <div className="w-full max-w-2xl">
          <SearchArea />
        </div>
      </div>
    </>
  );
}
