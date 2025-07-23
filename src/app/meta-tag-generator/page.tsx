
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Code, Copy, RefreshCw, Facebook, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const defaultValues = {
  title: 'DevBasket - Free Developer Tools',
  description: 'Access a suite of free and powerful online tools for developers, from generators to converters, all in one basket.',
  url: 'https://devbasket.site',
  imageUrl: 'https://placehold.co/1200x630.png',
  twitterHandle: '@DevBasketTools',
};

export default function MetaTagGenerator() {
  const { toast } = useToast();
  const [title, setTitle] = useState(defaultValues.title);
  const [description, setDescription] = useState(defaultValues.description);
  const [url, setUrl] = useState(defaultValues.url);
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl);
  const [twitterHandle, setTwitterHandle] = useState(defaultValues.twitterHandle);
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);


  const generatedTags = useMemo(() => {
    const tags = [
      `<!-- Primary Meta Tags -->`,
      `<title>${title}</title>`,
      `<meta name="title" content="${title}">`,
      `<meta name="description" content="${description}">`,
      ``,
      `<!-- Open Graph / Facebook -->`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:url" content="${url}">`,
      `<meta property="og:title" content="${title}">`,
      `<meta property="og:description" content="${description}">`,
      imageUrl ? `<meta property="og:image" content="${imageUrl}">` : '',
      ``,
      `<!-- Twitter -->`,
      `<meta property="twitter:card" content="summary_large_image">`,
      `<meta property="twitter:url" content="${url}">`,
      `<meta property="twitter:title" content="${title}">`,
      `<meta property="twitter:description" content="${description}">`,
      imageUrl ? `<meta property="twitter:image" content="${imageUrl}">` : '',
      twitterHandle ? `<meta name="twitter:creator" content="${twitterHandle}">` : ''
    ];
    return tags.filter(tag => tag !== '').join('\n');
  }, [title, description, url, imageUrl, twitterHandle]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedTags);
    toast({ title: 'Meta tags copied to clipboard!' });
  };
  
  const handleReset = () => {
    setTitle(defaultValues.title);
    setDescription(defaultValues.description);
    setUrl(defaultValues.url);
    setImageUrl(defaultValues.imageUrl);
    setTwitterHandle(defaultValues.twitterHandle);
    toast({ title: 'Fields have been reset to default values.' });
  };
  
  const getDomain = (fullUrl: string) => {
    try {
      return new URL(fullUrl).hostname.replace('www.', '');
    } catch (e) {
      return fullUrl;
    }
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
              <Code className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Meta Tag Generator
            </CardTitle>
            <CardDescription>
              Generate SEO-friendly and social media-ready meta tags for your website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Your Website Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., DevBasket - Free Tools" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short description of your website." />
                    </div>
                    <div>
                      <Label htmlFor="url">URL</Label>
                      <Input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
                    </div>
                     <div>
                      <Label htmlFor="imageUrl">Image URL (for social previews)</Label>
                      <Input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.png" />
                    </div>
                     <div>
                      <Label htmlFor="twitterHandle">Twitter Handle</Label>
                      <Input id="twitterHandle" value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} placeholder="@yourhandle" />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex flex-wrap gap-2">
                    <Button onClick={handleReset} variant="outline" className="flex-1"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                 </div>
              </div>

              {/* Previews and Output */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Twitter className="text-blue-500"/>Twitter Preview</h3>
                  <Card className="bg-[#15202B] text-white p-4 rounded-xl border border-border/20 w-full max-w-lg mx-auto">
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                      {isClient && imageUrl && <Image src={imageUrl} alt="Twitter preview" width={500} height={261} className="w-full h-auto object-cover" data-ai-hint="website banner" />}
                      <div className="p-3">
                        <p className="text-gray-400 text-sm">{getDomain(url)}</p>
                        <p className="font-bold text-base truncate">{title}</p>
                        <p className="text-gray-400 text-sm overflow-hidden text-ellipsis line-clamp-2">{description}</p>
                      </div>
                    </div>
                  </Card>
                </div>
                 <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Facebook className="text-blue-600"/>Facebook Preview</h3>
                  <Card className="bg-[#F0F2F5] dark:bg-[#18191A] p-4 rounded-lg border border-border/20 w-full max-w-lg mx-auto">
                     <div className="bg-white dark:bg-[#242526] rounded-lg overflow-hidden">
                       {isClient && imageUrl && <Image src={imageUrl} alt="Facebook preview" width={500} height={261} className="w-full h-auto object-cover" data-ai-hint="social media post" />}
                       <div className="p-3 bg-gray-50 dark:bg-gray-700/20">
                         <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{getDomain(url)}</p>
                         <p className="font-semibold text-base truncate text-gray-800 dark:text-gray-200">{title}</p>
                         <p className="text-sm text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis line-clamp-1">{description}</p>
                       </div>
                     </div>
                  </Card>
                </div>

                <Separator />

                <div>
                   <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold">Generated Tags</h3>
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                            <Copy className="mr-2 h-4 w-4" /> Copy Tags
                        </Button>
                    </div>
                    <Textarea
                        readOnly
                        value={generatedTags}
                        className="w-full h-64 font-mono text-xs"
                    />
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
