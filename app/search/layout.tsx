export const maxDuration = 60;

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]">
      <div className="flex flex-col items-start justify-start min-h-screen">
        {children}
      </div>
    </div>
  );
}
