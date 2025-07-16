"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Download, AlertCircle, Film, Clipboard, Link as LinkIcon, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

type Thumbnail = {
    quality: string;
    url: string;
    width: number;
    height: number;
};

export function ThumbnailDownloader() {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [videoId, setVideoId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const getYoutubeVideoId = (url: string): string | null => {
        if (!url) return null;
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#\&\?]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const handleFetchThumbnails = () => {
        setError('');
        setVideoId(null);

        const id = getYoutubeVideoId(youtubeUrl);
        if (id) {
            setIsLoading(true);
            setVideoId(id);
            // Simulate a network request for a better user experience
            setTimeout(() => setIsLoading(false), 500);
        } else {
            setError('Invalid YouTube URL. Please check the link and try again.');
        }
    };

    const handleDownload = async (url: string, quality: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = `${videoId}_${quality}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(objectUrl);
        } catch (err) {
            console.error('Download failed', err);
            toast({
                variant: "destructive",
                title: "Download Failed",
                description: "Could not download the thumbnail. It may not be available.",
            });
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setYoutubeUrl(text);
        } catch (err) {
            console.error('Failed to paste from clipboard', err);
            toast({
                variant: "destructive",
                title: "Paste Failed",
                description: "Could not read from clipboard. Please paste manually.",
            })
        }
    };

    const thumbnails: Thumbnail[] = useMemo(() => {
        if (!videoId) return [];
        return [
            { quality: 'maxresdefault', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, width: 1280, height: 720 },
            { quality: 'sddefault', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`, width: 640, height: 480 },
            { quality: 'hqdefault', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, width: 480, height: 360 },
            { quality: 'mqdefault', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, width: 320, height: 180 },
            { quality: 'default', url: `https://img.youtube.com/vi/${videoId}/default.jpg`, width: 120, height: 90 },
        ];
    }, [videoId]);

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl bg-card/80 backdrop-blur-sm border-border/20">
            <CardHeader className="text-center p-8">
                <div className="flex justify-center items-center gap-4">
                    <LinkIcon className="h-10 w-10 text-primary" />
                    <CardTitle className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Thumbzilla
                    </CardTitle>
                </div>
                <CardDescription className="text-lg text-muted-foreground pt-2">
                    Instantly grab high-quality YouTube thumbnails.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-4">
                <div className="space-y-6">
                    <div className="relative">
                        <Input
                            type="url"
                            placeholder="Paste YouTube link here..."
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFetchThumbnails()}
                            className="h-14 text-lg pl-12 pr-44"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                             <Button onClick={handlePaste} variant="ghost" size="icon" className="h-10 w-10">
                                <Clipboard className="h-5 w-5" />
                                <span className="sr-only">Paste</span>
                            </Button>
                            <Button onClick={handleFetchThumbnails} disabled={isLoading || !youtubeUrl} className="h-10">
                                {isLoading ? 'Fetching...' : 'Show Thumbnail'}
                            </Button>
                        </div>
                    </div>
                    {error && (
                        <Alert variant="destructive" className="animate-fade-in">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Oops! An Error Occurred</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>

            {videoId && !isLoading && (
                <CardFooter className="p-8 pt-4">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {thumbnails.map((thumb) => (
                           <ThumbnailCard key={thumb.quality} thumbnail={thumb} onDownload={handleDownload} />
                        ))}
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}


function ThumbnailCard({ thumbnail, onDownload }: { thumbnail: Thumbnail; onDownload: (url: string, quality: string) => void; }) {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const handleDownloadClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onDownload(thumbnail.url, thumbnail.quality);
    };

    if (imageError) {
        return null; // Don't render card if thumbnail quality doesn't exist
    }

    return (
         <div className="group relative overflow-hidden rounded-xl border bg-card shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="relative aspect-video w-full bg-muted">
                {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="h-12 w-12 text-muted-foreground animate-pulse" />
                    </div>
                )}
                <Image
                    src={thumbnail.url}
                    alt={`${thumbnail.quality} thumbnail`}
                    fill
                    className={`object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    data-ai-hint="youtube thumbnail"
                    unoptimized
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => {
                        setIsImageLoading(false);
                        setImageError(true);
                    }}
                />
            </div>
            <div className="p-4 bg-background/50">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold capitalize">{thumbnail.quality.replace('default', ' Default')}</p>
                        <p className="text-sm text-muted-foreground">{thumbnail.width} x {thumbnail.height}</p>
                    </div>
                    <Button onClick={handleDownloadClick} size="sm" variant="secondary">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>
        </div>
    )
}
