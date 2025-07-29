
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket, Image as ImageIcon, Edit, FileText, Code, Settings, Search, ChevronDown, Captions, Hash, Youtube, MessageSquare, ImageDown, Palette, Loader2, Type, SlidersHorizontal, FileImage, Replace, Tags, FileCode, FileSignature, TextQuote, MessagesSquare, Calculator, PiggyBank, Briefcase, Landmark, Split } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const aiTools = [
  {
    name: 'AI Image Generator',
    description: 'Create stunning visuals from text prompts.',
    icon: <ImageIcon className="h-6 w-6" />,
    href: '/ai-image-generator',
  },
  {
    name: 'Image Caption Generator',
    description: 'Generate catchy captions for your images.',
    icon: <Captions className="h-6 w-6" />,
    href: '/image-caption-generator',
  },
  {
    name: 'Hashtag Generator',
    description: 'Find the best hashtags for your content.',
    icon: <Hash className="h-6 w-6" />,
    href: '/hashtag-generator',
  },
  {
    name: 'YouTube Content Creator',
    description: 'Get titles, descriptions, and tags for videos.',
    icon: <Youtube className="h-6 w-6" />,
    href: '/youtube-content-generator',
  },
  {
    name: 'Tweet Generator',
    description: 'Create realistic mockups for tweets.',
    icon: <MessageSquare className="h-6 w-6" />,
    href: '/tweet-generator',
  },
  {
    name: 'Chat Screenshot Generator',
    description: 'Create realistic chat mockups for different platforms.',
    icon: <MessagesSquare className="h-6 w-6" />,
    href: '/chat-generator',
  },
];

const imageVideoTools = [
   {
    name: 'Thumbnail Downloader',
    description: 'Download YouTube video thumbnails.',
    icon: <ImageDown className="h-6 w-6" />,
    href: '/thumbzilla',
  },
  {
    name: 'Image Filter & Editor',
    description: 'Apply filters and adjustments to your images.',
    icon: <SlidersHorizontal className="h-6 w-6" />,
    href: '/image-filter',
  },
  {
    name: 'Image to PDF Converter',
    description: 'Combine multiple images into a single PDF file.',
    icon: <FileImage className="h-6 w-6" />,
    href: '/image-to-pdf',
  },
  {
    name: 'JPEG to PNG Converter',
    description: 'Convert JPEG images to PNG format.',
    icon: <Replace className="h-6 w-6" />,
    href: '/jpeg-to-png',
  },
  {
    name: 'WebP to PNG Converter',
    description: 'Convert modern WebP images to PNG format.',
    icon: <Replace className="h-6 w-6" />,
    href: '/webp-to-png',
  },
   {
    name: 'PDF to PNG Converter',
    description: 'Convert each page of a PDF into PNG images.',
    icon: <FileImage className="h-6 w-6" />,
    href: '/pdf-to-png',
  },
];

const devDesignTools = [
   {
    name: 'Color Palette Generator',
    description: 'Create harmonious color palettes from a base color.',
    icon: <Palette className="h-6 w-6" />,
    href: '/color-palette-generator',
  },
  {
    name: 'CSS Loader Generator',
    description: 'Generate simple and elegant CSS loaders.',
    icon: <Loader2 className="h-6 w-6" />,
    href: '/css-loader-generator',
  },
  {
    name: 'Font Changer & Preview',
    description: 'Experiment with different fonts and styles in real-time.',
    icon: <Type className="h-6 w-6" />,
    href: '/font-changer',
  },
  {
    name: 'Real-time HTML Previewer',
    description: 'Write HTML and see the live rendered output.',
    icon: <Code className="h-6 w-6" />,
    href: '/html-previewer',
  },
   {
    name: 'Meta Tag Generator',
    description: 'Generate SEO-friendly meta tags for your website.',
    icon: <Tags className="h-6 w-6" />,
    href: '/meta-tag-generator',
  },
];

const financeTools = [
  {
    name: 'Bill Splitter',
    description: 'Quickly split group expenses with ease.',
    icon: <Split className="h-6 w-6" />,
    href: '/bill-splitter',
  },
 {
    name: 'ROI Calculator',
    description: 'Calculate the return on your investments.',
    icon: <Calculator className="h-6 w-6" />,
    href: '/roi-calculator',
  },
  {
    name: 'Smart Budget Planner',
    description: 'Track income, expenses, and savings goals.',
    icon: <PiggyBank className="h-6 w-6" />,
    href: '/budget-planner',
  },
  {
    name: 'Multi-Country Tax Calculator',
    description: 'Estimate your income tax in different countries.',
    icon: <Calculator className="h-6 w-6" />,
    href: '/tax-calculator',
  },
  {
    name: 'Loan & EMI Calculator',
    description: 'Plan your loans and EMIs like a pro.',
    icon: <Landmark className="h-6 w-6" />,
    href: '/loan-calculator',
  },
];

const businessTools = [
  {
    name: 'Invoice Generator',
    description: 'Create and download professional invoices.',
    icon: <Briefcase className="h-6 w-6" />,
    href: '/invoice-generator',
  }
];

const pdfDocumentTools = [
  {
    name: 'PDF to HTML Converter',
    description: 'Extract text from a PDF into an HTML document.',
    icon: <FileCode className="h-6 w-6" />,
    href: '/pdf-to-html',
  },
  {
    name: 'PDF to Word Converter',
    description: 'Convert your PDF files into editable DOCX documents.',
    icon: <FileSignature className="h-6 w-6" />,
    href: '/pdf-to-word',
  },
  {
    name: 'Word & Character Counter',
    description: 'Analyze your text for word count, characters, and more.',
    icon: <TextQuote className="h-6 w-6" />,
    href: '/word-counter',
  },
];


export default function Home() {

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-black/30 backdrop-blur-sm bg-gradient-to-b from-black/50 to-black/30">
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
          <div className="container flex min-h-[calc(100vh_-_3.5rem)] flex-col items-center justify-center space-y-6 px-4 text-center md:px-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 p-4 animate-fade-in-up">
                  <Rocket className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl animate-fade-in-up" style={{animationDelay: '0.1s', textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'}}>
                Your All-in-One Developer Toolkit
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl animate-fade-in-up" style={{animationDelay: '0.2s', textShadow: '0 0 15px rgba(255, 255, 255, 0.3)'}}>
                From thumbnail grabbers to AI-powered generators, find everything you need — fast, free, and open-source.
              </p>
               <Button asChild size="lg" className="mt-4 h-12 transform-gpu rounded-md px-8 text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 animate-fade-in-up border border-white/30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white" style={{animationDelay: '0.3s'}}>
                  <Link href="#tools">
                    Explore Tools
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
          </div>
        </section>
        
        <section id="tools" className="w-full py-12 md:py-24 lg:py-32 bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
          <div className="container px-4 md:px-6 space-y-16">
            
            <div>
              <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">AI & Content</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                      Powerful AI tools to generate content, captions, hashtags, and more.
                  </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {aiTools.map((tool, toolIndex) => (
                   <Link key={tool.name} href={tool.href}>
                     <Card className="flex h-full transform-gpu cursor-pointer flex-col justify-start rounded-2xl border bg-secondary/30 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 animate-fade-in-up backdrop-blur-sm" style={{animationDelay: `${toolIndex * 100}ms`}}>
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
            
            <div>
              <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Image & Video Tools</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                      A suite of tools for converting, editing, and downloading media.
                  </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {imageVideoTools.map((tool, toolIndex) => (
                   <Link key={tool.name} href={tool.href}>
                     <Card className="flex h-full transform-gpu cursor-pointer flex-col justify-start rounded-2xl border bg-secondary/30 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 animate-fade-in-up backdrop-blur-sm" style={{animationDelay: `${toolIndex * 100}ms`}}>
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

            <div>
              <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Developer & Design</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                      Utilities for developers and designers to streamline their workflow.
                  </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {devDesignTools.map((tool, toolIndex) => (
                   <Link key={tool.name} href={tool.href}>
                     <Card className="flex h-full transform-gpu cursor-pointer flex-col justify-start rounded-2xl border bg-secondary/30 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 animate-fade-in-up backdrop-blur-sm" style={{animationDelay: `${toolIndex * 100}ms`}}>
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

             <div>
              <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Finance Tools</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                      Tools for financial calculations and analysis.
                  </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {financeTools.map((tool, toolIndex) => (
                   <Link key={tool.name} href={tool.href}>
                     <Card className="flex h-full transform-gpu cursor-pointer flex-col justify-start rounded-2xl border bg-secondary/30 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 animate-fade-in-up backdrop-blur-sm" style={{animationDelay: `${toolIndex * 100}ms`}}>
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

            <div>
              <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Business & Productivity</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                      Streamline your business operations with these handy tools.
                  </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {businessTools.map((tool, toolIndex) => (
                   <Link key={tool.name} href={tool.href}>
                     <Card className="flex h-full transform-gpu cursor-pointer flex-col justify-start rounded-2xl border bg-secondary/30 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 animate-fade-in-up backdrop-blur-sm" style={{animationDelay: `${toolIndex * 100}ms`}}>
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

            <div>
              <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">PDF & Document Tools</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                      Handy tools for converting and analyzing your documents.
                  </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pdfDocumentTools.map((tool, toolIndex) => (
                   <Link key={tool.name} href={tool.href}>
                     <Card className="flex h-full transform-gpu cursor-pointer flex-col justify-start rounded-2xl border bg-secondary/30 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 animate-fade-in-up backdrop-blur-sm" style={{animationDelay: `${toolIndex * 100}ms`}}>
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

          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">&copy; 2024 DevBasket.site. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
