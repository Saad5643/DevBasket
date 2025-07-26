
'use client';

import { useState, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Captions, Upload, RefreshCw, Copy, Loader2, Image as ImageIcon } from 'lucide-react';
import { generateCaptions, GenerateCaptionsInput } from '@/ai/flows/generate-captions-flow';

const captionStyles = [
  "Funny", "Emotional", "Romantic", "Professional", "Aesthetic", 
  "Trendy", "Poetic", "Inspirational", "Sarcastic", "Minimalist"
];

export default function ImageCaptionGenerator() {
  const { toast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [captionStyle, setCaptionStyle] = useState<string>(captionStyles[0]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please upload an image smaller than 10MB.',
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        setCaptions([]); // Clear previous captions
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateCaptions = async () => {
    if (!imageSrc) {
      toast({ variant: 'destructive', title: 'No image selected', description: 'Please upload an image first.' });
      return;
    }
    
    setIsLoading(true);
    setCaptions([]);

    try {
      const input: GenerateCaptionsInput = {
        image: imageSrc,
        style: captionStyle,
      };
      const result = await generateCaptions(input);
      setCaptions(result.captions);
    } catch (error) {
      console.error('Error generating captions:', error);
      toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate captions for the image.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!', description: 'The caption has been copied.' });
  };
  
  const handleReset = () => {
    setImageSrc(null);
    setImageFile(null);
    setCaptions([]);
    setCaptionStyle(captionStyles[0]);
    setIsLoading(false);
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

        <Card className="max-w-7xl mx-auto shadow-lg border-border/60 bg-secondary/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <Captions className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              AI Image Caption Generator
            </CardTitle>
            <CardDescription>
              Upload an image and let AI craft the perfect caption for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls and Image Preview */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="p-4">
                   <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                   <Label 
                      htmlFor="image-upload" 
                      className="flex flex-col items-center justify-center w-full min-h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                    >
                        {imageSrc ? (
                            <Image src={imageSrc} alt="Uploaded preview" width={400} height={400} className="max-h-96 w-auto object-contain rounded-lg p-2" />
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 10MB)</p>
                            </div>
                        )}
                    </Label>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Select a Style</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <Select value={captionStyle} onValueChange={setCaptionStyle} disabled={!imageSrc}>
                        <SelectTrigger id="caption-style">
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                        <SelectContent>
                          {captionStyles.map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </CardContent>
                </Card>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleGenerateCaptions} disabled={!imageSrc || isLoading} className="flex-1">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Captions className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Generating...' : 'Generate Captions'}
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
              </div>

              {/* Generated Captions */}
              <div className="lg:col-span-1">
                <h3 className="text-xl font-semibold mb-4 text-center">Generated Captions</h3>
                <div className="h-[550px] overflow-y-auto space-y-4 pr-2">
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                      <p>Generating witty and wonderful captions...</p>
                    </div>
                  )}
                  {!isLoading && captions.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-muted/50 rounded-lg p-8">
                       <ImageIcon className="h-16 w-16 mb-4" />
                       <p className="font-semibold">Your AI-generated captions will appear here.</p>
                       <p className="text-sm">Upload an image and select a style to get started!</p>
                     </div>
                  )}
                  {!isLoading && captions.length > 0 && captions.map((caption, index) => (
                    <Card key={index} className="relative group animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                      <CardContent className="p-4">
                        <p className="text-base text-foreground pr-8">{caption}</p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleCopyToClipboard(caption)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
