
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Wand2, Copy, Sparkles, Youtube } from 'lucide-react';
import { generateYoutubeContent, GenerateYoutubeContentInput, GenerateYoutubeContentOutput } from '@/ai/flows/generate-youtube-content-flow';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type Tone = 'professional' | 'casual' | 'viral';

const initialContent: GenerateYoutubeContentOutput = {
  title: '🚀 Build a Portfolio Website in 2025 | Next.js & Tailwind CSS Tutorial',
  description: 'Want to build a stunning portfolio website in 2025? In this video, I’ll walk you through every step using Next.js and Tailwind CSS — perfect for developers, designers, and freelancers.\n\n✅ Fully responsive layout\n✅ Fast & SEO-friendly setup\n✅ Best practices for portfolio projects\n\nSubscribe for more web dev tips & tutorials!',
  hashtags: ['#PortfolioWebsite', '#NextJS', '#TailwindCSS', '#WebDevelopment', '#2025Coding', '#WebDev', '#ResponsiveDesign', '#FrontendDevelopment'],
  keywords: ['portfolio website tutorial 2025', 'next.js portfolio setup', 'tailwind css beginner project', 'modern portfolio site build'],
};

export default function YoutubeSeoOptimizer() {
  const { toast } = useToast();
  const [topic, setTopic] = useState('How to Build a Portfolio Website in 2025');
  const [videoDesc, setVideoDesc] = useState('A step-by-step tutorial to create a modern developer portfolio using Next.js and Tailwind CSS.');
  const [audience, setAudience] = useState('Beginner developers, coders, web designers');
  const [tone, setTone] = useState<Tone>('casual');
  const [content, setContent] = useState<GenerateYoutubeContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ variant: 'destructive', title: 'Topic is empty', description: 'Please enter a topic to generate content.' });
      return;
    }
    
    setIsLoading(true);
    setContent(null);

    try {
      const input: GenerateYoutubeContentInput = { 
        topic, 
        tone, 
        videoDescription: videoDesc, 
        targetAudience: audience 
      };
      const result = await generateYoutubeContent(input);
      setContent(result);
    } catch (error) {
      console.error('Error generating content:', error);
      toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate content from the topic.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `Copied ${field} to clipboard!` });
  };
  
  const displayContent = content || initialContent;

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
              <Youtube className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              YouTube SEO Optimizer
            </CardTitle>
            <CardDescription>
              Generate optimized titles, descriptions, and tags for your YouTube videos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel: Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">1. Describe Your Video</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="topic-input">Video Topic or Title</Label>
                      <Input
                        id="topic-input"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., A tutorial on building a Next.js app"
                      />
                    </div>
                     <div>
                      <Label htmlFor="video-desc-input">Short Description of Video Content</Label>
                      <Textarea
                        id="video-desc-input"
                        value={videoDesc}
                        onChange={(e) => setVideoDesc(e.target.value)}
                        placeholder="e.g., A step-by-step guide to..."
                        rows={3}
                      />
                    </div>
                     <div>
                      <Label htmlFor="audience-input">Target Audience (Optional)</Label>
                      <Input
                        id="audience-input"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder="e.g., Beginner developers, fitness enthusiasts"
                      />
                    </div>
                     <div>
                      <Label>Content Tone</Label>
                       <ToggleGroup 
                          type="single" 
                          value={tone} 
                          onValueChange={(value: Tone) => { if(value) setTone(value)}} 
                          className="w-full grid grid-cols-3"
                        >
                            <ToggleGroupItem value="professional" aria-label="Professional" className="w-full">Professional</ToggleGroupItem>
                            <ToggleGroupItem value="casual" aria-label="Casual" className="w-full">Casual</ToggleGroupItem>
                            <ToggleGroupItem value="viral" aria-label="Viral" className="w-full">Viral</ToggleGroupItem>
                        </ToggleGroup>
                     </div>
                  </CardContent>
                </Card>
                 <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Generating...' : 'Generate Content'}
                </Button>
                
                 {/* Generated Content Fields */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Generated Content</h3>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-base">Title</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(displayContent.title, 'Title')}><Copy className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                           <p className="text-muted-foreground">{isLoading ? 'Generating...' : displayContent.title}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-base">Description</CardTitle>
                           <Button variant="ghost" size="icon" onClick={() => copyToClipboard(displayContent.description, 'Description')}><Copy className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                           <p className="text-muted-foreground whitespace-pre-line">{isLoading ? 'Generating...' : displayContent.description}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-base">Hashtags</CardTitle>
                           <Button variant="ghost" size="icon" onClick={() => copyToClipboard(displayContent.hashtags.join(' '), 'Hashtags')}><Copy className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {isLoading ? <p className="text-muted-foreground">Generating...</p> : 
                                displayContent.hashtags.map((tag, i) => (
                                    <span key={`ht-${i}`} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">{tag}</span>
                                ))
                            }
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-base">Keywords / LSI Terms</CardTitle>
                           <Button variant="ghost" size="icon" onClick={() => copyToClipboard(displayContent.keywords.join(', '), 'Keywords')}><Copy className="h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {isLoading ? <p className="text-muted-foreground">Generating...</p> : 
                                displayContent.keywords.map((kw, i) => (
                                    <span key={`kw-${i}`} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">{kw}</span>
                                ))
                            }
                        </CardContent>
                    </Card>
                 </div>
              </div>

              {/* Right Panel: Preview */}
              <div className="space-y-4">
                 <h3 className="text-xl font-semibold text-center">Live Preview</h3>
                 <Card className="w-full max-w-lg mx-auto overflow-hidden">
                    <div className="bg-muted aspect-video flex items-center justify-center">
                        <Youtube className="h-16 w-16 text-muted-foreground"/>
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-lg leading-tight">
                          {isLoading ? 'Generating title...' : displayContent.title}
                        </h4>
                        <div className="text-sm text-muted-foreground mt-2">
                            <span>Dev Tuber</span>
                             <span className="mx-1">•</span>
                            <span>1.2M views</span>
                            <span className="mx-1">•</span>
                            <span>1 day ago</span>
                        </div>
                    </div>
                 </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
