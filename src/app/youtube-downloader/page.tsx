
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, AlertCircle, RefreshCw, X, ArrowLeft, Loader2, Youtube, Video, Music, Settings2, Clock, Eye, ThumbsUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const videoResolutions = [
  { res: '144p', format: 'MP4', size: '5.2 MB' },
  { res: '240p', format: 'MP4', size: '9.8 MB' },
  { res: '360p', format: 'MP4', size: '15.4 MB' },
  { res: '480p', format: 'MP4', size: '25.1 MB' },
  { res: '720p', format: 'MP4', size: '48.9 MB' },
  { res: '1080p', format: 'MP4', size: '92.3 MB' },
  { res: '2K', format: 'WebM', size: '180.5 MB' },
  { res: '4K', format: 'WebM', size: '350.1 MB' },
];

const audioBitrates = [
  { bitrate: '64 kbps', format: 'MP3', size: '2.3 MB' },
  { bitrate: '128 kbps', format: 'MP3', size: '4.6 MB' },
  { bitrate: '192 kbps', format: 'MP3', size: '6.9 MB' },
  { bitrate: '256 kbps', format: 'MP3', size: '9.2 MB' },
  { bitrate: '320 kbps', format: 'MP3', size: '11.5 MB' },
];

export default function YoutubeDownloaderPage() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchVideo = () => {
    setError('');
    setLoading(true);
    setVideoInfo(null);
    
    // This is a mock fetch. In a real app, this would be an API call.
    setTimeout(() => {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId && url.includes('youtube.com')) {
        setVideoInfo({
          id: videoId,
          title: 'Building a UI for a YouTube Downloader in Next.js',
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          duration: '10:32',
          channel: 'Dev Basket',
          publishDate: 'Oct 26, 2024',
          views: '1.2M',
          likes: '98K',
        });
        setLoading(false);
      } else {
        setError('Invalid YouTube URL. Please provide a valid video URL.');
        setLoading(false);
      }
    }, 1500);
  };
  
  const handleDownload = () => {
    toast({
      title: "Prototype Feature",
      description: "Download functionality is not implemented in this UI prototype.",
    })
  }

  const handleReset = () => {
    setUrl('');
    setVideoInfo(null);
    setError('');
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
              <Download className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              YouTube Downloader
            </CardTitle>
            <CardDescription>
              Paste a YouTube video link to get video and audio download options. (UI Prototype)
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
                onKeyDown={(e) => e.key === 'Enter' && handleFetchVideo()}
                disabled={loading}
              />
              <Button onClick={handleFetchVideo} disabled={loading || !url}>
                {loading ? <Loader2 className="animate-spin" /> : 'Fetch Video'}
              </Button>
              {(videoInfo || url) && (
                <Button variant="outline" onClick={handleReset} disabled={loading}>
                  <X /> Reset
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

            {videoInfo && (
              <Card className="mt-6 animate-in fade-in-50">
                <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Image
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      width={480}
                      height={360}
                      className="rounded-lg w-full shadow-md"
                      unoptimized
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col justify-center">
                    <h3 className="text-lg font-bold leading-tight">{videoInfo.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">by {videoInfo.channel}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-3">
                        <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /><span>{videoInfo.duration}</span></div>
                        <div className="flex items-center gap-1.5"><Eye className="h-4 w-4" /><span>{videoInfo.views}</span></div>
                        <div className="flex items-center gap-1.5"><ThumbsUp className="h-4 w-4" /><span>{videoInfo.likes}</span></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-0">
                  <Tabs defaultValue="video" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-t-none rounded-b-none h-12">
                      <TabsTrigger value="video" className="h-full"><Video className="mr-2 h-5 w-5"/>Video</TabsTrigger>
                      <TabsTrigger value="audio" className="h-full"><Music className="mr-2 h-5 w-5"/>Audio</TabsTrigger>
                    </TabsList>
                    <TabsContent value="video" className="p-4 md:p-6">
                      <div className="space-y-3">
                        {videoResolutions.map((v) => (
                           <div key={v.res} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Video className="h-5 w-5 text-primary"/>
                                <div>
                                    <p className="font-semibold">{v.res}</p>
                                    <p className="text-xs text-muted-foreground">{v.format}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium w-20 text-right">{v.size}</span>
                                <Button size="sm" onClick={handleDownload}>
                                    <Download className="mr-2 h-4 w-4"/>
                                    Download
                                </Button>
                              </div>
                           </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="audio" className="p-4 md:p-6">
                        <div className="space-y-3">
                        {audioBitrates.map((a) => (
                           <div key={a.bitrate} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Music className="h-5 w-5 text-accent"/>
                                <div>
                                    <p className="font-semibold">{a.bitrate}</p>
                                    <p className="text-xs text-muted-foreground">{a.format}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium w-20 text-right">{a.size}</span>
                                <Button size="sm" onClick={handleDownload} variant="secondary">
                                    <Download className="mr-2 h-4 w-4"/>
                                    Download
                                </Button>
                              </div>
                           </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardFooter>
              </Card>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
