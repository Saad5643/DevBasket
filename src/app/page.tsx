
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket, Image as ImageIcon, Edit, FileText, Code, Settings, Search, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const tools = [
  {
    name: 'AI Image Generator',
    description: 'Create stunning visuals from text prompts.',
    icon: <ImageIcon className="h-6 w-6" />,
    href: '/ai-image-generator',
  },
  {
    name: 'Image Caption Generator',
    description: 'Generate catchy captions for your images.',
    icon: <Edit className="h-6 w-6" />,
    href: '/image-caption-generator',
  },
  {
    name: 'Hashtag Generator',
    description: 'Find the best hashtags for your content.',
    icon: <Settings className="h-6 w-6" />,
    href: '/hashtag-generator',
  },
  {
    name: 'YouTube Content Creator',
    description: 'Get titles, descriptions, and tags for videos.',
    icon: <FileText className="h-6 w-6" />,
    href: '/youtube-content-generator',
  },
  {
    name: 'Tweet Generator',
    description: 'Create realistic mockups for tweets.',
    icon: <Code className="h-6 w-6" />,
    href: '/tweet-generator',
  },
  {
    name: 'Thumbnail Downloader',
    description: 'Download YouTube video thumbnails.',
    icon: <ImageIcon className="h-6 w-6" />,
    href: '/thumbzilla',
  },
];


export default function Home() {

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background backdrop-blur-sm">
        <div className="container flex h-14 items-center">
            <Link href="/" className="mr-auto flex items-center gap-2 font-bold text-lg">
               DevBasket.site
            </Link>
           <nav className="hidden items-center justify-center gap-6 text-sm md:flex mx-auto">
              <Link href="/tools" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                Tools
              </Link>
              <Link href="/pricing" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                Pricing
              </Link>
              <Link href="/contact" className="font-medium text-muted-foreground transition-colors hover:text-foreground">
                Contact
              </Link>
            </nav>
          <div className="hidden md:flex items-center justify-end gap-2 ml-auto">
             <Button variant="outline" size="sm">Sign Up</Button>
             <ThemeToggle />
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
                     <Link href="/tools" className="text-muted-foreground hover:text-foreground">
                      Tools
                    </Link>
                     <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                      Pricing
                    </Link>
                     <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                      Contact
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 p-4 animate-fade-in-up">
                  <Rocket className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                Stop wasting time—<br />All your tools, one place
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                From thumbnail grabbers to AI-powered generators, find everything you need — fast, free, and open-source.
              </p>
               <Button asChild size="lg" className="mt-4 h-12 transform-gpu rounded-md px-8 text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <Link href="#tools">
                    Explore Tools
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
          </div>
        </section>
        
        <section id="tools" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">A Tool for Every Need</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                    Browse our collection of powerful and easy-to-use developer utilities.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool, toolIndex) => (
                 <Link key={tool.name} href={tool.href}>
                   <Card className="flex h-full transform-gpu cursor-pointer flex-col justify-start rounded-2xl border bg-secondary/30 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 animate-fade-in-up" style={{animationDelay: `${toolIndex * 100}ms`}}>
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
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">&copy; 2024 DevBasket.site. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
