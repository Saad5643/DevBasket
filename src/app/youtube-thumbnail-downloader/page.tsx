'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, AlertCircle, RefreshCw, X } from 'lucide-react';

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
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
    } else {
      setError('Invalid YouTube URL. Please enter a valid video URL.');
      setVideoId('');
    }
  };

  const handleReset = () => {
    setUrl('');
    setVideoId('');
    setError('');
  };

  const handleDownload = async (thumbnailUrl: string, videoId: string, quality: string) => {
    try {
      setLoading(true);
      const response = await fetch(thumbnailUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `thumbzilla_${videoId}_${quality}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download image. It may not exist for this video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              YouTube Thumbnail Downloader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube video URL here..."
                className="flex-grow"
              />
              <Button onClick={handleShowThumbnail} disabled={loading || !url}>
                {loading ? <RefreshCw className="animate-spin mr-2" /> : null}
                Show Thumbnail
              </Button>
              {(videoId || url) && (
                <Button variant="outline" onClick={handleReset}>
                  <X className="mr-2" /> Reset
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 transition-all duration-500 ease-in-out">
                {thumbnailSizes.map((size) => {
                  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${size.key}.jpg`;
                  return (
                    <div key={size.key} className="group relative overflow-hidden rounded-lg shadow-md transform transition-transform hover:scale-105">
                      <Image
                        src={thumbnailUrl}
                        alt={`${size.name} thumbnail`}
                        width={480}
                        height={360}
                        className="object-cover w-full h-auto"
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'flex items-center justify-center h-full bg-muted text-muted-foreground p-4 text-center';
                            errorDiv.innerText = `Thumbnail for ${size.name} not available.`;
                            parent.appendChild(errorDiv);
                            const downloadButton = parent.querySelector('button');
                            if(downloadButton) downloadButton.style.display = 'none';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white font-bold text-lg text-center mb-2">{size.name}</h3>
                        <Button onClick={() => handleDownload(thumbnailUrl, videoId, size.key)} size="sm" disabled={loading}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
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
