
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Code, ImageIcon, FileText, Calculator, Hash, Youtube, ImageDown, FileImage } from 'lucide-react';

const tools = [
  { href: '/ai-image-generator', title: 'AI Image Generator', description: 'Bring your ideas to life with AI-powered image creation.', icon: <ImageIcon /> },
  { href: '/youtube-content-generator', title: 'YouTube Content Generator', description: 'Generate titles, descriptions, and tags for videos.', icon: <Youtube /> },
  { href: '/image-caption-generator', title: 'Image Caption Generator', description: 'Create engaging captions for your images.', icon: <ImageIcon /> },
  { href: '/hashtag-generator', title: 'Hashtag Generator', description: 'Find the best hashtags for your social media posts.', icon: <Hash /> },
  { href: '/tax-calculator', title: 'Tax Calculator', description: 'Estimate income tax for various countries.', icon: <Calculator /> },
  { href: '/thumbzilla', title: 'YouTube Thumbnail Downloader', description: 'Download high-quality YouTube thumbnails.', icon: <ImageDown /> },
  { href: '/bill-splitter', title: 'Bill Splitter', description: 'Easily split bills with friends.', icon: <Calculator /> },
  { href: '/budget-planner', title: 'Budget Planner', description: 'Plan your budget and track expenses.', icon: <Calculator /> },
  { href: '/chat-generator', title: 'Chat Generator', description: 'Create mock chat screenshots.', icon: <Code /> },
  { href: '/color-palette-generator', title: 'Color Palette Generator', description: 'Generate harmonious color palettes.', icon: <Code /> },
  { href: '/css-loader-generator', title: 'CSS Loader Generator', description: 'Create custom CSS loaders.', icon: <Code /> },
  { href: '/font-changer', title: 'Font Changer', description: 'Preview and test different fonts.', icon: <Code /> },
  { href: '/html-previewer', title: 'HTML Previewer', description: 'Write and preview HTML code in real-time.', icon: <Code /> },
  { href: '/image-filter', title: 'Image Filter', description: 'Apply filters to your images.', icon: <ImageIcon /> },
  { href: '/image-to-pdf', title: 'Image to PDF Converter', description: 'Convert images to a single PDF file.', icon: <FileText /> },
  { href: '/invoice-generator', title: 'Invoice Generator', description: 'Create and download professional invoices.', icon: <FileText /> },
  { href: '/jpeg-to-png', title: 'JPEG to PNG Converter', description: 'Convert JPEG images to PNG format.', icon: <FileImage /> },
  { href: '/loan-calculator', title: 'Loan Calculator', description: 'Calculate loan payments and amortization.', icon: <Calculator /> },
  { href: '/meta-tag-generator', title: 'Meta Tag Generator', description: 'Generate meta tags for your website.', icon: <Code /> },
  { href: '/pdf-to-html', title: 'PDF to HTML Converter', description: 'Convert PDF files to HTML.', icon: <FileText /> },
  { href: '/pdf-to-png', title: 'PDF to PNG Converter', description: 'Convert PDF pages to PNG images.', icon: <FileText /> },
  { href: '/pdf-to-word', title: 'PDF to Word Converter', description: 'Convert PDF files to Word documents.', icon: <FileText /> },
  { href: '/roi-calculator', title: 'ROI Calculator', description: 'Calculate Return on Investment.', icon: <Calculator /> },
  { href: '/tweet-generator', title: 'Tweet Generator', description: 'Create realistic tweet mockups.', icon: <Code /> },
  { href: '/webp-to-png', title: 'WebP to PNG Converter', description: 'Convert WebP images to PNG format.', icon: <FileImage /> },
  { href: '/word-counter', title: 'Word Counter', description: 'Count words and characters in your text.', icon: <Code /> },
];

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900 p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-zinc-800 dark:text-white mb-4">
          DevBasket
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Your one-stop collection of free developer and creator tools.
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href} passHref>
            <Card className="group flex flex-col h-full hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex-grow">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <CardTitle>{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                    </div>
                    <div className="p-2 bg-muted rounded-md text-muted-foreground">
                        {tool.icon}
                    </div>
                </div>
              </CardHeader>
              <div className="p-6 pt-0 text-primary font-semibold flex items-center justify-end">
                <span>Go to tool</span>
                <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
       <footer className="text-center mt-12 text-zinc-500 dark:text-zinc-600">
            <p>Made with ❤️ by DevBasket</p>
             <div className="flex justify-center gap-4 mt-2">
                <Link href="/contact" className="hover:text-primary">Contact</Link>
                <Link href="/pricing" className="hover:text-primary">Pricing</Link>
            </div>
        </footer>
    </main>
  );
}
