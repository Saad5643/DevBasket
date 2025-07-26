
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket, Image as ImageIcon, Edit, FileText, Code, Settings, X, Search } from 'lucide-react';

const toolCategories = [
  {
    name: 'Image Converters',
    description: 'Convert images between formats like JPEG, PNG, and WebP.',
    icon: <ImageIcon className="h-6 w-6" />,
    href: '/jpeg-to-png', // Example link
  },
  {
    name: 'PDF Editors',
    description: 'Merge, split, and edit your PDF files with ease.',
    icon: <FileText className="h-6 w-6" />,
    href: '/pdf-to-html', // Example link
  },
  {
    name: 'CSS Generators',
    description: 'Create loaders, gradients, and other CSS snippets.',
    icon: <Settings className="h-6 w-6" />,
    href: '/css-loader-generator', // Example link
  },
  {
    name: 'Content Tools',
    description: 'Generate captions, hashtags, and other text content.',
    icon: <Edit className="h-6 w-6" />,
    href: '/image-caption-generator', // Example link
  },
  {
    name: 'Social Mockups',
    description: 'Create realistic mockups for tweets and chats.',
    icon: <X className="h-6 w-6" />, // Using X for Twitter
    href: '/tweet-generator', // Example link
  },
  {
    name: 'Developer Tools',
    description: 'Handy utilities for developers and designers.',
    icon: <Code className="h-6 w-6" />,
    href: '/html-previewer', // Example link
  },
];


export default function Home() {

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container flex h-20 items-center">
            <Link href="/" className="mr-auto flex items-center gap-2 font-bold text-lg">
               DevBasket.site
            </Link>
           <nav className="hidden items-center justify-center gap-8 text-sm md:flex mx-auto">
              <Link href="#" className="font-semibold text-primary transition-colors hover:text-primary/80">
                Home
              </Link>
               <Link href="#tools" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                Tools
              </Link>
              <Link href="/contact" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                About
              </Link>
            </nav>
          <div className="hidden md:flex items-center justify-end gap-2 ml-auto">
             <Button>Sign Up</Button>
          </div>
           <div className="md:hidden ml-auto">
            <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                      DevBasket.site
                    </Link>
                    <Link href="#" className="hover:text-foreground text-primary font-semibold">
                      Home
                    </Link>
                    <Link href="#tools" className="text-muted-foreground hover:text-foreground">
                      Tools
                    </Link>
                     <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                      About
                    </Link>
                    <Button>Sign Up</Button>
                  </nav>
                </SheetContent>
              </Sheet>
           </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full overflow-hidden bg-background">
          <div className="container flex min-h-[calc(80vh_-_5rem)] flex-col items-center justify-center space-y-6 px-4 text-center md:px-6">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full p-4 animate-fade-in-up">
                  <Rocket className="h-12 w-12 text-foreground" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                Stop wasting time –<br />All your tools, one place
              </h1>
               <Button asChild size="lg" className="mt-4 h-12 transform-gpu rounded-full px-8 text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <Link href="#tools">
                    Explore Tools
                  </Link>
                </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[200px] w-full">
            <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="h-full w-full">
                 <path
                    fill="white"
                    d="M1440 32.2C1280 10.7 1120 0 960 0s-320 10.7-480 32.2S160 74.8 0 74.8V160h1440z"
                  ></path>
            </svg>
           </div>
        </section>
        
        <section id="tools" className="w-full bg-white py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {toolCategories.map((tool, toolIndex) => (
                 <Link key={tool.name} href={tool.href}>
                   <Card className="flex h-full transform-gpu cursor-pointer flex-col justify-start rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: `${toolIndex * 100}ms`}}>
                      <CardHeader className="flex flex-row items-center gap-4 p-0 pb-4">
                         <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                           {tool.icon}
                         </div>
                      </CardHeader>
                      <CardContent className="p-0">
                         <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
                         <CardDescription className="mt-1">{tool.description}</CardDescription>
                      </CardContent>
                    </Card>
                 </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t bg-white px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">&copy; 2024 DevBasket.site. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
