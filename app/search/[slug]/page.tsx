import SearchPage from '@/app/search/page';
import { getThreadData } from '@/actions/threadActions';
import SourceGallery from '@/components/search/SourceGallery';

export default async function Page(searchParams: { params: any }) {
  const indexedPath = `/search/${searchParams.params.slug}`;
  const threadData = await getThreadData(indexedPath);

  return (
    <SourceGallery SourceResults={threadData} />
  );
}