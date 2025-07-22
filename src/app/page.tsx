
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Package2, TextQuote, Send, ChevronDown, Type, ImageIcon as ImageIconLucide, Loader2, MessageSquare, MessagesSquare, Captions, Sparkles, ImageDown, Wand2, Film, FileSignature, FileInput, Pencil, FileImage, Code, Copy, Mail, Instagram, Youtube, Replace, Images, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const toolCategories = [
  {
    category: 'AI Tools',
    tools: [
      {
        name: 'AI Image Caption Generator',
        description: 'Generate AI-powered captions for your images in various styles.',
        icon: <Captions className="h-8 w-8" />,
        href: '/image-caption-generator',
      },
      {
        name: 'AI Image Generator',
        description: 'Create unique images from text prompts using generative AI.',
        icon: <Sparkles className="h-8 w-8" />,
        href: '/ai-image-generator',
      },
      {
        name: 'AI Video Generator',
        description: 'Create short video clips from text prompts using generative AI.',
        icon: <Film className="h-8 w-8" />,
        href: '/video-generator',
      },
    ]
  },
  {
    category: 'Image & Video',
    tools: [
      {
        name: 'YouTube Thumbnail Downloader',
        description: 'Grab all available thumbnail resolutions from a YouTube video.',
        icon: <ImageDown className="h-8 w-8" />,
        href: '/youtube-thumbnail-downloader',
      },
      {
        name: 'Image Filter',
        description: 'Apply real-time filters to your images and download them.',
        icon: <ImageIconLucide className="h-8 w-8" />,
        href: '/image-filter',
      },
      {
        name: 'JPEG to PNG Converter',
        description: 'Convert, resize, and compress JPEG images to PNG format.',
        icon: <Replace className="h-8 w-8" />,
        href: '/jpeg-to-png',
      },
      {
        name: 'WebP to PNG Converter',
        description: 'Convert modern WebP images to the widely supported PNG format.',
        icon: <Replace className="h-8 w-8" />,
        href: '/webp-to-png',
      },
    ]
  },
  {
    category: 'Text & Design',
    tools: [
       {
        name: 'Word Counter',
        description: 'Count words, characters, and sentences in your text.',
        icon: <TextQuote className="h-8 w-8" />,
        href: '/word-counter',
      },
      {
        name: 'Font Changer',
        description: 'Preview and experiment with different web fonts and styles.',
        icon: <Type className="h-8 w-8" />,
        href: '/font-changer',
      },
      {
        name: 'CSS Loader Generator',
        description: 'Create and customize simple CSS loading animations.',
        icon: <Loader2 className="h-8 w-8" />,
        href: '/css-loader-generator',
      },
      {
        name: 'Color Palette Generator',
        description: 'Create and customize color palettes from a base color.',
        icon: <Palette className="h-8 w-8" />,
        href: '/color-palette-generator',
      },
    ]
  },
  {
    category: 'PDF Tools',
    tools: [
      {
        name: 'Image to PDF Converter',
        description: 'Combine multiple images into a single, downloadable PDF file.',
        icon: <Images className="h-8 w-8" />,
        href: '/image-to-pdf',
      },
      {
        name: 'PDF to PNG Converter',
        description: 'Convert each page of a PDF file into separate PNG images.',
        icon: <FileImage className="h-8 w-8" />,
        href: '/pdf-to-png',
      },
      {
        name: 'PDF to HTML Converter',
        description: 'Convert PDF files into structured HTML documents.',
        icon: <Code className="h-8 w-8" />,
        href: '/pdf-to-html',
      },
      {
        name: 'PDF to Word Converter',
        description: 'Convert PDF files to editable Word documents with optional OCR.',
        icon: <FileSignature className="h-8 w-8" />,
        href: '/pdf-to-word',
      },
    ],
  },
  {
    category: 'Social Media',
    tools: [
      {
        name: 'Tweet Generator',
        description: 'Create and download realistic mockups of tweets.',
        icon: <MessageSquare className="h-8 w-8" />,
        href: '/tweet-generator',
      },
      {
        name: 'Chat Screenshot Generator',
        description: 'Craft and download realistic fake chat conversations.',
        icon: <MessagesSquare className="h-8 w-8" />,
        href: '/chat-generator',
      }
    ]
  }
];


export default function Home() {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState('/light.png');
  const suggestionEmail = "devbasketofficial@gmail.com";

  useEffect(() => {
    // Set the logo based on the current theme.
    // We use a state and useEffect to prevent hydration mismatches.
    setLogoSrc(theme === 'dark' ? '/dark.png' : '/light.png');
  }, [theme]);
  
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(suggestionEmail);
    toast({
      title: "Email Copied!",
      description: "The email address has been copied to your clipboard.",
    });
  };
  
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 px-4 py-2 backdrop-blur-lg sm:px-6 dark:bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="#" className="flex items-center gap-2 font-semibold">
               <Image src={logoSrc} alt="Devbasket Logo" width={120} height={30} key={logoSrc} />
            </Link>
            <nav className="hidden items-center gap-6 text-sm md:flex">
              <Link href="#tools" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                Tools
              </Link>
              <Link href="#suggest" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                Suggest a Tool
              </Link>
            </nav>
          </div>
          <div className="flex items-center justify-end gap-4">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                    <Image src={logoSrc} alt="Devbasket Logo" width={120} height={30} key={logoSrc + 'mobile'} />
                    <span className="sr-only">Devbasket</span>
                  </Link>
                  <Link href="#tools" className="text-muted-foreground hover:text-foreground">
                    Tools
                  </Link>
                  <Link href="#suggest" className="text-muted-foreground hover:text-foreground">
                    Suggest a Tool
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full border-b">
          <div className="container flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 animate-fade-in-up">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  <span className="inline-block bg-gradient-to-r from-primary to-accent-blue bg-clip-text text-transparent animate-gradient">
                    Your Daily Developer Toolkit.
                  </span>
                </h1>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  From thumbnail grabbers to URL shorteners, find everything you need — fast and free.
                </p>
              </div>
              <div className="flex animate-fade-in-up flex-col justify-center gap-4 pt-4 min-[400px]:flex-row">
                <Button asChild size="lg" className="h-12 transform-gpu px-8 text-base transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-primary via-primary to-purple-600 hover:shadow-2xl hover:shadow-primary/40 active:scale-95">
                  <Link href="#tools">
                    Explore Tools
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base active:scale-95">
                   <Link href="#suggest">Suggest a Tool</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="tools" className="w-full bg-muted/40 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex animate-fade-in-up flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Featured Tools</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Growing Collection</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Here are some of the free and useful online tools available in the basket. More are being added all the time.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 space-y-12">
              {toolCategories.map((category) => (
                <div key={category.category} className="animate-fade-in-up">
                  <h3 className="text-2xl font-bold tracking-tight mb-6">{category.category}</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
                    {category.tools.map((tool) => (
                      <Card key={tool.name} className="flex h-full flex-col justify-between transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                        <CardHeader className="flex flex-row items-start gap-4 pb-4">
                           <div className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl">{tool.icon}</div>
                           <div>
                             <CardTitle>{tool.name}</CardTitle>
                             <CardDescription className="mt-1">{tool.description}</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="mt-auto pt-0">
                          <Button asChild className="w-full active:scale-95">
                            <Link href={tool.href}>Open Tool</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="suggest" className="w-full border-t py-12 md:py-24 lg:py-32">
          <div className="container grid animate-fade-in-up items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Have an Idea?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                If there's a tool you'd love to see in the basket, feel free to contact us directly via email.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input readOnly value={suggestionEmail} className="pr-12 pl-10" />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleCopyEmail}>
                   <Copy className="h-4 w-4" />
                   <span className="sr-only">Copy email address</span>
                </Button>
              </div>
              <Button asChild className="w-full">
                <Link href="https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcSMVxWhBNkJMzgCmGFTLFztnmxKDBsmctMRPxQRQNmJntKNlLjRwbRrKwSdrFcQjDbtfKWxG" target="_blank" rel="noopener noreferrer">
                  <Send className="mr-2 h-4 w-4" /> Send Email via Gmail
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">&copy; 2024 Devbasket. Made with ❤️</p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link href="https://www.instagram.com/devbasket/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
           <Link href="https://www.youtube.com/channel/UCAVnhkNMkMPH7p78yz9LABA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <Youtube className="h-5 w-5" />
            <span className="sr-only">YouTube</span>
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
