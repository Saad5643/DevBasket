
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Loader2, Sparkles, Star, Save, User, UserCheck } from 'lucide-react';
import { generateImage, GenerateImageInput } from '@/ai/flows/generate-image-flow';
import { auth, db, appId } from '@/lib/firebase';
import { signInAnonymously, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

type Quality = 'standard' | 'hd';
type Orientation = 'square' | 'portrait' | 'landscape';

const imageStyles = [
    { value: 'none', label: 'No Specific Style' },
    { value: 'photorealistic', label: 'Photorealistic' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'anime', label: 'Anime' },
    { value: 'watercolor', label: 'Watercolor' },
    { value: '3d-render', label: '3D Render' },
    { value: 'vector', label: 'Vector' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'pixel-art', label: 'Pixel Art' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'sketch', label: 'Pencil Sketch' },
];

const orientations = [
    { value: 'square', label: 'Square (1:1)' },
    { value: 'portrait', label: 'Portrait (9:16)' },
    { value: 'landscape', label: 'Landscape (16:9)' },
];

interface SavedImage {
  id: string;
  prompt: string;
  imageUrl: string;
}

export default function AiImageGenerator() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<string>('A photorealistic portrait of a husky wearing sunglasses, cinematic lighting');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [quality, setQuality] = useState<Quality>('standard');
  const [style, setStyle] = useState<string>('photorealistic');
  const [orientation, setOrientation] = useState<Orientation>('square');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (!currentUser) {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          toast({ variant: 'destructive', title: 'Authentication Failed', description: 'Could not sign you in anonymously.' });
        });
      }
    });
    return () => unsubscribe();
  }, [toast]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `artifacts/${appId}/users/${user.uid}/generated_images`), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const images: SavedImage[] = [];
      querySnapshot.forEach((doc) => {
          images.push({ id: doc.id, ...doc.data() } as SavedImage);
      });
      setSavedImages(images);
    }, (error) => {
      console.error("Error listening to Firestore:", error);
      toast({ variant: 'destructive', title: 'Firestore Error', description: 'Could not fetch your saved images.' });
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({ variant: 'destructive', title: 'Prompt is empty', description: 'Please enter a prompt to generate an image.' });
      return;
    }
    
    setIsLoading(true);
    setImageUrl(null);

    try {
      const input: GenerateImageInput = { prompt, negativePrompt, quality, style, orientation };
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
  
  const handleSaveToCollection = async () => {
    if (!imageUrl || !user) {
      toast({ variant: 'destructive', title: 'Save Failed', description: 'No image or user session available.' });
      return;
    }
    setIsSaving(true);
    try {
      const imagesCollectionRef = collection(db, `artifacts/${appId}/users/${user.uid}/generated_images`);
      await addDoc(imagesCollectionRef, {
        prompt,
        negativePrompt,
        quality,
        style,
        orientation,
        imageUrl,
        timestamp: serverTimestamp(),
      });
      toast({ title: 'Image Saved!', description: 'Your creation has been saved to your collection.' });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({ variant: 'destructive', title: 'Save Error', description: 'Could not save the image to Firestore.' });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {!isAuthReady ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : user ? (
              <>
                <UserCheck className="h-4 w-4 text-green-500" />
                <span>Signed in</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                <span>Not Signed In</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card className="shadow-lg border-border/60 bg-secondary/30 backdrop-blur-sm">
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
                         <div>
                          <Label htmlFor="negative-prompt-input" className="mb-2 block font-medium">Negative Prompt (What to avoid)</Label>
                          <Textarea
                            id="negative-prompt-input"
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="e.g., blurry, ugly, text, watermark"
                            className="w-full text-base"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <Label htmlFor="orientation-select" className="mb-2 block font-medium">Orientation</Label>
                                <Select value={orientation} onValueChange={(value) => setOrientation(value as Orientation)}>
                                    <SelectTrigger id="orientation-select">
                                        <SelectValue placeholder="Select orientation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orientations.map((o) => (
                                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
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
                        <Button onClick={handleGenerateImage} disabled={isLoading || !isAuthReady} size="lg">
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
                            <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                                <Image
                                    src={imageUrl}
                                    alt="Generated by AI"
                                    width={1024}
                                    height={1024}
                                    className="max-w-full max-h-[768px] object-contain rounded-lg shadow-md"
                                />
                                <div className="flex flex-wrap gap-2">
                                  <Button onClick={handleDownload} variant="outline">
                                      <Download className="mr-2 h-4 w-4" />
                                      Download Image
                                  </Button>
                                  <Button onClick={handleSaveToCollection} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    {isSaving ? 'Saving...' : 'Save to Collection'}
                                  </Button>
                                </div>
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
            </div>
            <div className="lg:col-span-1">
                 <Card className="bg-secondary/30 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Your Collection</CardTitle>
                        <CardDescription>Images you have saved will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100vh-12rem)] overflow-y-auto space-y-4">
                        {savedImages.length > 0 ? (
                            savedImages.map(img => (
                                <Card key={img.id} className="overflow-hidden">
                                  <Image src={img.imageUrl} alt={img.prompt} width={400} height={400} className="w-full h-auto" />
                                  <CardFooter className="p-2 text-xs text-muted-foreground">
                                    <p className="truncate">{img.prompt}</p>
                                  </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                                <p>No saved images yet.</p>
                            </div>
                        )}
                    </CardContent>
                 </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
