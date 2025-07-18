
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Loader2, Sparkles, Star } from 'lucide-react';
import { generateImage, GenerateImageInput } from '@/ai/flows/generate-image-flow';

type Quality = 'standard' | 'hd';

const imageStyles = [
    { value: 'none', label: 'No Specific Style' },
    { value: 'photorealistic', label: 'Photorealistic' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'anime', label: 'Anime' },
    { value: 'watercolor', label: 'Watercolor' },
    { value: '3d-render', label: '3D Render' },
    { value: 'pixel-art', label: 'Pixel Art' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'sketch', label: 'Pencil Sketch' },
];

export default function AiImageGenerator() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<string>('A photorealistic portrait of a husky wearing sunglasses, cinematic lighting');
  const [quality, setQuality] = useState<Quality>('standard');
  const [style, setStyle] = useState<string>('photorealistic');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({ variant: 'destructive', title: 'Prompt is empty', description: 'Please enter a prompt to generate an image.' });
      return;
    }
    
    setIsLoading(true);
    setImageUrl(null);

    try {
      const input: GenerateImageInput = { prompt, quality, style };
      const result = await generateImage(input);
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      } else {
        throw new Error('No image was generated.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate an image from the prompt.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Image downloading!' });
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
              <Sparkles className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              AI Image Generator
            </CardTitle>
            <CardDescription>
              Describe any image you can imagine, and let AI bring it to life.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="prompt-input" className="mb-2 block font-medium">Your Prompt</Label>
                  <Textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A cute cat astronaut on the moon"
                    className="w-full text-base"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="style-select" className="mb-2 block font-medium">Style</Label>
                        <Select value={style} onValueChange={setStyle}>
                            <SelectTrigger id="style-select">
                                <SelectValue placeholder="Select image style" />
                            </SelectTrigger>
                            <SelectContent>
                                {imageStyles.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="quality-select" className="mb-2 block font-medium">Quality</Label>
                        <Select value={quality} onValueChange={(value) => setQuality(value as Quality)}>
                            <SelectTrigger id="quality-select">
                                <SelectValue placeholder="Select image quality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="hd">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
                <Button onClick={handleGenerateImage} disabled={isLoading} size="lg">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </Button>
            </div>
            
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-center">Output</h3>
                <Card className="flex items-center justify-center p-4 border-dashed min-h-[400px] bg-muted/50">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p>Creating your masterpiece... this can take a moment.</p>
                    </div>
                )}
                {!isLoading && imageUrl && (
                    <div className="flex flex-col items-center gap-4">
                        <Image
                            src={imageUrl}
                            alt="Generated by AI"
                            width={1024}
                            height={1024}
                            className="max-w-full max-h-[768px] object-contain rounded-lg shadow-md"
                        />
                        <Button onClick={handleDownload} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download Image
                        </Button>
                    </div>
                )}
                {!isLoading && !imageUrl && (
                    <div className="text-center text-muted-foreground">
                        <Star className="h-16 w-16 mx-auto mb-4" />
                        <p>Your generated image will appear here.</p>
                    </div>
                )}
                </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
