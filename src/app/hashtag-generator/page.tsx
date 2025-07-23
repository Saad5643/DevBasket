
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Hash, Sparkles, Copy, Loader2, Tags } from 'lucide-react';
import { generateHashtags } from '@/ai/flows/generate-hashtags-flow';
import type { GenerateHashtagsInput } from '@/ai/flows/generate-hashtags-flow';
import { cn } from '@/lib/utils';

type HashtagStyle = 'trending' | 'niche' | 'random-mix';

export default function HashtagGenerator() {
  const { toast } = useToast();
  const [topic, setTopic] = useState('Digital Marketing');
  const [style, setStyle] = useState<HashtagStyle>('trending');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ variant: 'destructive', title: 'Topic is empty', description: 'Please enter a topic to generate hashtags.' });
      return;
    }
    
    setIsLoading(true);
    setHashtags([]);

    try {
      const input: GenerateHashtagsInput = { topic, style };
      const result = await generateHashtags(input);
      setHashtags(result.hashtags);
    } catch (error) {
      console.error('Error generating hashtags:', error);
      toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate hashtags from the topic.' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: message });
  };
  
  const copyAll = () => {
    if (hashtags.length === 0) return;
    const allTags = hashtags.join(' ');
    copyToClipboard(allTags, 'All hashtags copied to clipboard!');
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
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent-blue/20 text-primary p-3 rounded-xl inline-block mb-4">
              <Hash className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-blue">
              AI Hashtag Generator
            </CardTitle>
            <CardDescription>
              Enter a topic and get a list of relevant hashtags for your social media.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                <div>
                  <Label htmlFor="topic-input" className="mb-2 block font-medium">Your Topic or Keyword</Label>
                  <Input
                    id="topic-input"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Fitness Motivation"
                    className="w-full text-base"
                  />
                </div>

                <div>
                    <Label className="mb-2 block font-medium">Hashtag Style</Label>
                    <ToggleGroup 
                      type="single" 
                      value={style} 
                      onValueChange={(value: HashtagStyle) => { if(value) setStyle(value)}} 
                      className="w-full grid grid-cols-3"
                    >
                        <ToggleGroupItem value="trending" aria-label="Trending" className="w-full">Trending</ToggleGroupItem>
                        <ToggleGroupItem value="niche" aria-label="Niche" className="w-full">Niche</ToggleGroupItem>
                        <ToggleGroupItem value="random-mix" aria-label="Random Mix" className="w-full">Random Mix</ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="w-full bg-gradient-to-r from-primary to-accent-blue text-white">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Generating...' : 'Generate Hashtags'}
                </Button>
            </div>
            
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Generated Hashtags</h3>
                    {hashtags.length > 0 && (
                        <Button variant="outline" onClick={copyAll}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy All
                        </Button>
                    )}
                </div>
                <Card className="flex flex-wrap items-center justify-center gap-2 p-4 border-dashed min-h-64 bg-muted/50">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-4">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p>Finding the best hashtags for you...</p>
                    </div>
                )}
                {!isLoading && hashtags.length > 0 && hashtags.map((tag, index) => (
                   <button 
                    key={`${tag}-${index}`}
                    onClick={() => copyToClipboard(tag, `Copied ${tag} to clipboard!`)}
                    className="group relative animate-fade-in-up"
                    style={{animationDelay: `${index * 30}ms`, animationFillMode: 'both'}}
                    >
                     <span className="px-3 py-1.5 bg-background border rounded-full text-sm font-medium hover:bg-accent hover:border-primary hover:text-primary transition-all cursor-pointer shadow-sm">
                       {tag}
                     </span>
                   </button>
                ))}
                {!isLoading && hashtags.length === 0 && (
                    <div className="text-center text-muted-foreground">
                        <Tags className="h-16 w-16 mx-auto mb-4" />
                        <p>Your generated hashtags will appear here.</p>
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
