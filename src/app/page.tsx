import { ThumbnailDownloader } from '@/components/features/thumbnail-downloader';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <ThumbnailDownloader />
    </main>
  );
}
