
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, TextQuote, Send, ChevronDown, Type, ImageIcon as ImageIconLucide, Loader2, MessageSquare, MessagesSquare, Captions, Sparkles, ImageDown, Wand2, FileSignature, FileInput, Pencil, FileImage, Code, Copy, Mail, Instagram, Youtube, Replace, Images, Palette, Hash, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';


const toolCategories = [
  {
    category: 'AI Tools',
    tools: [
      {
        name: 'YouTube SEO Optimizer',
        description: 'Generate optimized titles, descriptions, and tags for your videos.',
        icon: <Youtube className="h-8 w-8" />,
        href: '/youtube-content-generator',
      },
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
        name: 'Hashtag Generator',
        description: 'Generate trending and niche hashtags for your content.',
        icon: <Hash className="h-8 w-8" />,
        href: '/hashtag-generator',
      },
    ]
  },
  {
    category: 'Image & Video',
    tools: [
      {
        name: 'Thumbzilla',
        description: 'Grab all available thumbnail resolutions from a YouTube video.',
        icon: <ImageDown className="h-8 w-8" />,
        href: '/thumbzilla',
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
      {
        name: 'HTML Previewer',
        description: 'Write HTML code and see a real-time, sandboxed preview.',
        icon: <Code className="h-8 w-8" />,
        href: '/html-previewer',
      },
       {
        name: 'Meta Tag Generator',
        description: 'Generate SEO and social media meta tags for your website.',
        icon: <Code className="h-8 w-8" />,
        href: '/meta-tag-generator',
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
        description: 'Convert each page of a PDF into separate PNG images.',
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
  const { theme } = useTheme();

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background animated-gradient">
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
            <Link href="/" className="mr-auto flex items-center gap-2 font-bold text-lg">
               DevBasket.site
            </Link>
           <nav className="hidden items-center justify-center gap-6 text-sm md:flex flex-1">
              <Link href="#tools" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                Tools
              </Link>
               <Link href="/pricing" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                Pricing
              </Link>
              <Link href="/contact" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                Contact
              </Link>
            </nav>
          <div className="flex items-center justify-end gap-2">
             <Button variant="outline">Sign Up</Button>
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
                    DevBasket.site
                  </Link>
                  <Link href="#tools" className="text-muted-foreground hover:text-foreground">
                    Tools
                  </Link>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full overflow-hidden">
          <div className="container flex min-h-[calc(80vh)] flex-col items-center justify-center space-y-4 px-4 text-center md:px-6">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 p-4 animate-fade-in-up">
                  <Rocket className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                Stop wasting time –<br />All your tools, one place
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  From thumbnail grabbers to AI-powered generators, find everything you need — fast, free, and open-source.
              </p>
               <Button asChild size="lg" className="mt-4 h-12 transform-gpu px-8 text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <Link href="#tools">
                    Explore Tools
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
          </div>
          <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-background to-transparent" />
        </section>
        
        <section id="tools" className="w-full bg-background py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Growing Collection</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Here are some of the free and useful online tools available in the basket. More are being added all the time.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 space-y-12">
              {toolCategories.map((category, i) => (
                <div key={category.category}>
                  <h3 className="mb-6 text-2xl font-bold tracking-tight">{category.category}</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {category.tools.map((tool, toolIndex) => (
                       <Link key={tool.name} href={tool.href}>
                         <Card className="flex h-full transform-gpu cursor-pointer flex-col justify-between rounded-2xl border-2 border-transparent bg-background/50 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up" style={{animationDelay: `${toolIndex * 50}ms`}}>
                            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                 {tool.icon}
                               </div>
                               <div>
                                 <CardTitle>{tool.name}</CardTitle>
                               </div>
                            </CardHeader>
                            <CardContent>
                               <CardDescription>{tool.description}</CardDescription>
                            </CardContent>
                          </Card>
                       </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">&copy; 2024 DevBasket.site. All Rights Reserved.</p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link href="https://www.instagram.com/devbasket/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
           <Link href="https://www.youtube.com/channel/UCAVnhkNMkMPH7p78yz9LABA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <Youtube className="h-5 w-5" />
            <span className="sr-only">YouTube</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
