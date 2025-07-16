import { ThumbnailDownloader } from '@/components/features/thumbnail-downloader';

export default function Home() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-4 sm:p-6 md:p-8">
      <ThumbnailDownloader />
    </main>
  );
}
