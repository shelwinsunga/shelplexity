import { SearchArea } from '@/components/search/SearchArea';
import { ModeToggle } from '@/components/theming/mode-toggle';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <SearchArea />
        </div>
        <div className="flex justify-end">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}