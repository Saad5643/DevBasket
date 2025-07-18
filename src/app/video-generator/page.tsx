
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Video, Wand2, Download, Play, Loader2, Sparkles, Film, AspectRatio, Camera } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const aspectRatios = {
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
  '1:1': 'aspect-square',
};

type AspectRatioKey = keyof typeof aspectRatios;

export default function VideoGeneratorPage() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('A majestic lion surveying its kingdom from a high rock at sunrise, cinematic, epic');
    const [style, setStyle] = useState('cinematic');
    const [duration, setDuration] = useState(5);
    const [aspectRatio, setAspectRatio] = useState<AspectRatioKey>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!prompt.trim()) {
            toast({ variant: 'destructive', title: 'Prompt is empty' });
            return;
        }
        setIsLoading(true);
        setVideoUrl(null);
        // Simulate AI generation
        setTimeout(() => {
            // In a real app, this would be the URL of the generated video
            setVideoUrl('https://placehold.co/1280x720.mp4/000000/ffffff?text=Video+Preview');
            setIsLoading(false);
            toast({ title: 'Video Generated!', description: 'Your AI video is ready for preview.'});
        }, 4000);
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

                <Card className="max-w-7xl mx-auto shadow-lg border-border/60">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
                            <Video className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            AI Video Generator
                        </CardTitle>
                        <CardDescription>
                            Create cinematic video clips from text prompts, powered by generative AI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Controls Panel */}
                            <div className="lg:col-span-1 space-y-6">
                               <Card>
                                  <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2"><Sparkles className="text-primary"/> Prompt</CardTitle>
                                    <CardDescription>Describe the scene you want to create.</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <Textarea
                                      value={prompt}
                                      onChange={(e) => setPrompt(e.target.value)}
                                      placeholder="e.g., An astronaut riding a horse on Mars"
                                      rows={5}
                                    />
                                  </CardContent>
                               </Card>
                               <Card>
                                 <CardHeader>
                                  <CardTitle className="text-xl flex items-center gap-2"><Camera className="text-accent"/> Creative Controls</CardTitle>
                                 </CardHeader>
                                 <CardContent className="space-y-4">
                                    <div>
                                      <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                                      <Select value={aspectRatio} onValueChange={(v) => setAspectRatio(v as AspectRatioKey)}>
                                        <SelectTrigger id="aspect-ratio"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                                          <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                                          <SelectItem value="1:1">Square (1:1)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="style">Style</Label>
                                      <Select value={style} onValueChange={setStyle}>
                                        <SelectTrigger id="style"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="cinematic">Cinematic</SelectItem>
                                          <SelectItem value="anime">Anime</SelectItem>
                                          <SelectItem value="photorealistic">Photorealistic</SelectItem>
                                          <SelectItem value="watercolor">Watercolor</SelectItem>
                                          <SelectItem value="claymation">Claymation</SelectItem>
                                          <SelectItem value="low-poly">Low Poly</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                     <div>
                                      <Label htmlFor="duration" className="flex justify-between">
                                        <span>Duration</span>
                                        <span>{duration}s</span>
                                      </Label>
                                      <Slider id="duration" min={3} max={15} step={1} value={[duration]} onValueChange={(v) => setDuration(v[0])} />
                                    </div>
                                 </CardContent>
                               </Card>
                                <Button onClick={handleGenerate} size="lg" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 animate-spin"/> : <Wand2 className="mr-2"/>}
                                    {isLoading ? 'Generating Your Scene...' : 'Generate Video'}
                                </Button>
                            </div>

                            {/* Preview Panel */}
                            <div className="lg:col-span-2">
                                 <h3 className="text-xl font-semibold mb-4 text-center">Preview</h3>
                                 <Card className={cn(
                                    "w-full bg-gray-900 flex items-center justify-center shadow-inner mx-auto transition-all duration-300 ease-in-out",
                                    aspectRatios[aspectRatio],
                                    aspectRatio === '9:16' ? 'max-w-sm' : 'max-w-3xl'
                                 )}>
                                     {isLoading && (
                                        <div className="text-center text-white p-4">
                                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4"/>
                                            <p className="font-semibold">AI is dreaming up your video...</p>
                                            <p className="text-sm text-white/70">This can take a moment.</p>
                                        </div>
                                     )}
                                     {!isLoading && videoUrl && (
                                        <video
                                            key={videoUrl}
                                            src={videoUrl}
                                            controls
                                            autoPlay
                                            loop
                                            muted
                                            className="w-full h-full object-cover rounded-lg"
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                     )}
                                     {!isLoading && !videoUrl && (
                                          <div className="text-center text-muted-foreground p-4">
                                            <Film className="h-16 w-16 mx-auto mb-4" />
                                            <p>Your generated video will appear here.</p>
                                        </div>
                                     )}
                                 </Card>
                                 <div className="flex justify-center mt-4">
                                     <Button variant="outline" disabled={!videoUrl || isLoading}>
                                         <Download className="mr-2"/> Download MP4
                                     </Button>
                                 </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
