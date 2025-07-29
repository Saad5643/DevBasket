'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, AlertCircle, RefreshCw, Youtube, ImageDown } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function Thumbzilla() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const extractVideoId = (inputUrl: string) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = inputUrl.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const handleShowThumbnail = () => {
    setError('');
    setThumbnailUrl('');
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
      const maxResUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
      
      // We use an image element to check if it exists before displaying it
      const img = document.createElement('img');
      img.src = maxResUrl;
      img.onload = () => {
        setThumbnailUrl(maxResUrl);
      };
      img.onerror = () => {
        // Fallback to standard definition if max-res is not available
        setThumbnailUrl(`https://img.youtube.com/vi/${id}/sddefault.jpg`);
      };

    } else {
      setError('Invalid YouTube URL. Please enter a valid video URL.');
      setVideoId('');
    }
  };

  const handleDownload = useCallback(() => {
    if (!thumbnailUrl) return;
    saveAs(thumbnailUrl, 'thumbnail.jpg');
  }, [thumbnailUrl]);
  
  const handleReset = () => {
    setUrl('');
    setVideoId('');
    setError('');
    setThumbnailUrl('');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900 p-4">
      <Card className="w-full max-w-lg shadow-2xl rounded-2xl bg-white dark:bg-zinc-800/50 backdrop-blur-sm">
        <CardHeader className="text-center">
           <div className="mx-auto bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 p-3 rounded-full inline-block mb-4">
              <ImageDown className="h-8 w-8" />
            </div>
          <CardTitle className="text-3xl font-extrabold text-zinc-800 dark:text-white">
            Thumbzilla
          </CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">
            Enter a YouTube URL to grab the thumbnail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
             <div className="relative flex-grow">
               <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="pl-10 h-11 text-base dark:bg-zinc-700 dark:border-zinc-600"
                onKeyDown={(e) => e.key === 'Enter' && handleShowThumbnail()}
              />
            </div>
            <Button onClick={handleShowThumbnail} className="h-11 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base">
              Show Thumbnail
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {thumbnailUrl && (
            <div className="mt-6 space-y-4 animate-in fade-in-50 duration-500">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
                 <Image
                    src={thumbnailUrl}
                    alt="YouTube video thumbnail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
              </div>
              <Button onClick={handleDownload} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold">
                <Download className="mr-2 h-5 w-5" />
                Download Thumbnail
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
