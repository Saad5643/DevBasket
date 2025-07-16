
'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Menu, Package2, Youtube, TextQuote, Rss, Send, ChevronDown, Type, Image as ImageIcon, Loader2 } from 'lucide-react';

const tools = [
  {
    name: 'YouTube Thumbnail Downloader',
    description: 'Grab high-quality thumbnails from any YouTube video.',
    icon: <Youtube className="h-8 w-8" />,
    href: '/youtube-thumbnail-downloader',
  },
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
    name: 'Image Filter',
    description: 'Apply real-time filters to your images and download them.',
    icon: <ImageIcon className="h-8 w-8" />,
    href: '/image-filter',
  },
  {
    name: 'CSS Loader Generator',
    description: 'Create and customize simple CSS loading animations.',
    icon: <Loader2 className="h-8 w-8" />,
    href: '/css-loader-generator',
  },
  {
    name: 'Coming Soon',
    description: 'More handy tools are on the way. Stay tuned!',
    icon: <Rss className="h-8 w-8" />,
    href: '#',
    comingSoon: true,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-muted/80 px-4 py-3 backdrop-blur-lg sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="#" className="flex items-center gap-2">
              <Package2 className="h-6 w-6" />
              <span className="text-lg font-bold">Dev Basket 🧺</span>
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
                    <Package2 className="h-6 w-6" />
                    <span className="font-bold text-foreground">Dev Basket 🧺</span>
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
              <div className="space-y-2">
                <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-extrabold tracking-tighter text-transparent sm:text-5xl xl:text-6xl/none">
                  Your Daily Developer Toolkit.
                </h1>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  From thumbnail grabbers to URL shorteners, find everything you need — fast and free.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-4 pt-4 min-[400px]:flex-row">
                <Button asChild size="lg" className="h-12 transform-gpu px-8 text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Link href="#tools">
                    Explore Tools
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                   <Link href="#suggest">Suggest a Tool</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="tools" className="w-full bg-muted/40 py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Featured Tools</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Growing Collection</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Here are some of the free and useful online tools available in the basket. More are being added all the time.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
              {tools.map((tool) => (
                <Card key={tool.name} className="flex flex-col justify-between transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl">{tool.icon}</div>
                    <div>
                      <CardTitle>{tool.name}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" variant={tool.comingSoon ? "secondary" : "default"} disabled={tool.comingSoon}>
                      <Link href={tool.href}>{tool.comingSoon ? "Coming Soon" : "Open Tool"}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="suggest" className="w-full border-t py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Have an Idea?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                If there's a tool you'd love to see in the basket, feel free to suggest it.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex flex-col gap-2">
                <Textarea placeholder="Describe your tool idea..." />
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" /> Suggest Tool
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">&copy; 2024 Dev Basket. Made with ❤️</p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="https://github.com/firebase/genkit/tree/main/studio" className="text-xs hover:underline underline-offset-4">
            GitHub
          </Link>
        </nav>
      </footer>
    </div>
  );
}
