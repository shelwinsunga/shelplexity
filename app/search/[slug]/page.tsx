
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';

export default function Home() {

  return (
    <div className="flex flex-col items-start justify-start h-screen">
      <SearchResultsDisplay />
    </div>
  );
}