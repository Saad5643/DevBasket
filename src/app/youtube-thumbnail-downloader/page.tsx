
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, AlertCircle, RefreshCw, X, Youtube, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const thumbnailSizes = [
  { name: 'Max-Res Default', key: 'maxresdefault' },
  { name: 'SD Default', key: 'sddefault' },
  { name: 'High Quality', key: 'hqdefault' },
  { name: 'Medium Quality', key: 'mqdefault' },
  { name: 'Default', key: 'default' },
];

export default function YoutubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const extractVideoId = (inputUrl: string) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = inputUrl.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const handleShowThumbnail = () => {
    setError('');
    setLoading(true);
    const id = extractVideoId(url);
    if (id) {
      // Simulate network delay for loading state
      setTimeout(() => {
        setVideoId(id);
        setLoading(false);
      }, 500);
    } else {
      setError('Invalid YouTube URL. Please enter a valid video URL.');
      setVideoId('');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setVideoId('');
    setError('');
  };

  const handleDownload = async (thumbnailUrl: string, videoId: string, quality: string) => {
    try {
      const response = await fetch(thumbnailUrl);
      if (!response.ok) {
        // This will be caught by the image's onError handler, but we can also handle it here.
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `dev_basket_thumb_${videoId}_${quality}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download image. It may not exist for this video quality.');
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
            <Button asChild variant="outline" size="sm">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tools
                </Link>
            </Button>
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg border-border/60">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <Youtube className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              YouTube Thumbnail Downloader
            </CardTitle>
            <CardDescription>
              Paste a YouTube video link below to grab all the available thumbnail resolutions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-grow"
                onKeyDown={(e) => e.key === 'Enter' && handleShowThumbnail()}
              />
              <Button onClick={handleShowThumbnail} disabled={loading || !url}>
                {loading ? <RefreshCw className="animate-spin mr-2 h-4 w-4" /> : null}
                Get Thumbnails
              </Button>
              {(videoId || url) && (
                <Button variant="outline" onClick={handleReset}>
                  <X className="mr-2 h-4 w-4" /> Reset
                </Button>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {videoId && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 transition-all duration-500 ease-in-out animate-in fade-in">
                {thumbnailSizes.map((size) => {
                  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${size.key}.jpg`;
                  return (
                    <div key={size.key} className="group relative overflow-hidden rounded-xl border border-border/40 shadow-sm transform transition-transform hover:-translate-y-1">
                      <Image
                        src={thumbnailUrl}
                        alt={`${size.name} thumbnail`}
                        width={480}
                        height={360}
                        className="object-cover w-full h-auto bg-muted/50"
                        unoptimized
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const errorDiv = parent.querySelector('.thumbnail-error');
                            if (errorDiv) {
                              errorDiv.classList.remove('hidden');
                            }
                            const downloadButton = parent.querySelector('button');
                            if(downloadButton) (downloadButton as HTMLButtonElement).disabled = true;
                          }
                        }}
                      />
                      <div className="thumbnail-error hidden flex items-center justify-center h-[200px] bg-muted text-muted-foreground p-4 text-center">
                          Thumbnail for {size.name} not available.
                      </div>

                      <div className="absolute inset-x-0 bottom-0 bg-background/70 backdrop-blur p-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-foreground font-semibold text-sm">{size.name}</h3>
                            </div>
                            <Button onClick={() => handleDownload(thumbnailUrl, videoId, size.key)} size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
