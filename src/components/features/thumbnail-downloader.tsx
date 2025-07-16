"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Download, AlertCircle, Film } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ThumbnailDownloader() {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [videoId, setVideoId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const getYoutubeVideoId = (url: string): string | null => {
        if (!url) return null;
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#\&\?]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const handleShowThumbnail = () => {
        setError('');
        setVideoId(null);
        setIsLoading(true);

        const id = getYoutubeVideoId(youtubeUrl);
        if (id) {
            setVideoId(id);
            setIsImageLoading(true);
        } else {
            setError('Invalid YouTube URL. Please check the link and try again.');
        }
        setIsLoading(false);
    };

    const handleDownload = async () => {
        if (!videoId) return;
        const imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error('Image request failed');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${videoId}_thumbnail.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download image:', err);
            setError('Failed to download the thumbnail. The highest resolution might not be available for this video.');
        }
    };

    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

    return (
        <Card className="w-full max-w-lg mx-auto shadow-xl rounded-2xl">
            <CardHeader className="text-center p-8">
                <CardTitle className="text-4xl font-extrabold tracking-tight">Thumbzilla</CardTitle>
                <CardDescription className="text-lg text-muted-foreground pt-1">
                    Instantly grab high-quality YouTube thumbnails.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-4">
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            type="url"
                            placeholder="Paste YouTube link here..."
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleShowThumbnail()}
                            className="flex-grow text-base"
                        />
                        <Button onClick={handleShowThumbnail} disabled={isLoading || !youtubeUrl}>
                            {isLoading ? 'Fetching...' : 'Show Thumbnail'}
                        </Button>
                    </div>
                    {error && (
                        <Alert variant="destructive" className="animate-fade-in">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Oops!</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {videoId && (
                        <div className="mt-4 animate-fade-in">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted border shadow-inner">
                                {isImageLoading && (
                                     <div className="absolute inset-0 flex items-center justify-center">
                                        <Film className="h-12 w-12 text-muted-foreground animate-pulse" />
                                     </div>
                                )}
                                <Image
                                    key={videoId}
                                    src={thumbnailUrl}
                                    alt="YouTube video thumbnail"
                                    fill
                                    className={`object-cover transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                                    data-ai-hint="youtube thumbnail"
                                    unoptimized
                                    onLoad={() => setIsImageLoading(false)}
                                    onError={() => {
                                        setError('Could not load max resolution thumbnail. This can happen for older or private videos. Please try another video link.');
                                        setVideoId(null);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
            {videoId && !isImageLoading && !error && (
                 <CardFooter className="px-8 pb-8 pt-4 flex justify-center">
                    <Button onClick={handleDownload} className="w-full sm:w-auto text-lg py-6">
                        <Download className="mr-2 h-5 w-5" />
                        Download Thumbnail
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
