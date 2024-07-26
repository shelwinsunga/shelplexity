import { SearchInput } from '@/components/search/SearchInput';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <SearchInput />
        </div>
      </div>
    </div>
  );
}