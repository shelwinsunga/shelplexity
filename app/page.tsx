import { SearchArea } from '@/components/search/SearchArea';
import { Snail } from 'lucide-react';

export const maxDuration = 30;

export default function Page() {

  return (
    <>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col sm:flex-row items-center mb-8 text-center sm:text-left">
          <Snail className="w-12 h-12 mb-4 sm:mb-0 sm:mr-4" />
          <h1 className="text-2xl sm:text-3xl font-semibold">Shelplexity</h1>
        </div>
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <SearchArea />
        </div>
      </div>
    </>
  );
}
