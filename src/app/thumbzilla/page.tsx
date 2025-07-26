
'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, AlertCircle, RefreshCw, X, Youtube, ArrowLeft, ImageDown } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

const thumbnailSizes = [
  { name: 'Max-Res Default', key: 'maxresdefault', resolution: '1280x720' },
  { name: 'Standard Definition', key: 'sddefault', resolution: '640x480' },
  { name: 'High Quality', key: 'hqdefault', resolution: '480x360' },
  { name: 'Medium Quality', key: 'mqdefault', resolution: '320x180' },
  { name: 'Default', key: 'default', resolution: '120x90' },
];

type ToastInfo = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export default function Thumbzilla() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);

  useEffect(() => {
    if (toastInfo) {
      toast({
        title: toastInfo.title,
        description: toastInfo.description,
        variant: toastInfo.variant,
      });
      setToastInfo(null);
    }
  }, [toastInfo, toast]);

  const extractVideoId = (inputUrl: string) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = inputUrl.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const handleShowThumbnails = () => {
    setError('');
    const id = extractVideoId(url);
    if (id) {
      setLoading(true);
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

  const handleDownload = useCallback(async (thumbnailUrl: string, quality: string) => {
    setToastInfo({
      title: 'Downloading...',
      description: `Preparing the ${quality} thumbnail.`,
    });
    try {
      const response = await fetch(thumbnailUrl);
      if (!response.ok) throw new Error('Network response was not ok.');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `thumbnail_${videoId}_${quality}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setToastInfo({
        title: 'Download Complete!',
        description: 'The thumbnail has been saved to your device.',
      });
    } catch (err) {
      setToastInfo({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'This thumbnail quality may not exist for this video.',
      });
    }
  }, [videoId]);

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

        <Card className="max-w-5xl mx-auto shadow-lg border-border/60 bg-secondary/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <ImageDown className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              YouTube Thumbnail Downloader
            </CardTitle>
            <CardDescription>
              Paste a YouTube video link to grab all available thumbnail resolutions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-grow">
                 <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleShowThumbnails()}
                />
              </div>
              <Button onClick={handleShowThumbnails} disabled={loading || !url} className="w-full sm:w-auto">
                {loading ? <RefreshCw className="animate-spin mr-2 h-4 w-4" /> : null}
                Show Thumbnail
              </Button>
              {(videoId || error) && (
                <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 animate-in fade-in-50 duration-500">
                {thumbnailSizes.map((size) => {
                  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${size.key}.jpg`;
                  return (
                    <Card key={size.key} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                       <CardHeader className="p-0 relative">
                        <Image
                          src={thumbnailUrl}
                          alt={`${size.name} thumbnail`}
                          width={480}
                          height={360}
                          className="object-cover w-full h-auto bg-muted aspect-video"
                          unoptimized
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.src = "https://placehold.co/480x360.png";
                            const parentCard = target.closest('.group');
                            const downloadButton = parentCard?.querySelector('button');
                            if (downloadButton) {
                                downloadButton.disabled = true;
                                downloadButton.classList.add('opacity-50', 'cursor-not-allowed');
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                         <div className="absolute bottom-3 left-4">
                            <h3 className="text-white font-bold text-lg">{size.name}</h3>
                            <p className="text-white/80 text-sm">{size.resolution}</p>
                        </div>
                       </CardHeader>
                       <CardContent className="p-4">
                         <Button onClick={() => handleDownload(thumbnailUrl, size.key)} className="w-full">
                           <Download className="mr-2 h-4 w-4" />
                           Download
                         </Button>
                       </CardContent>
                    </Card>
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
