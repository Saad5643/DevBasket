'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, TextQuote, CaseUpper, CaseLower, Trash2, Copy, Download } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const words = text.match(/\b\w+\b/g) || [];
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const paragraphs = text.split(/\n+/).filter(p => p.trim() !== '');
    const readingTime = Math.ceil(words.length / 200); // 200 WPM

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      readingTime: readingTime < 1 ? 'Less than a minute' : `${readingTime} min read`,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setText('');
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dev_basket_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

        <Card className="max-w-6xl mx-auto shadow-lg border-border/60 bg-secondary/30 backdrop-blur-sm">
            <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
                    <TextQuote className="h-8 w-8" />
                </div>
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Word & Character Counter
                </CardTitle>
                <CardDescription>
                    Paste your text below for a real-time analysis.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Start typing or paste your text here..."
                            className="w-full h-96 text-base"
                        />
                        <div className="flex flex-wrap gap-2 mt-4">
                            <Button onClick={() => setText(text.toUpperCase())} variant="outline" size="sm"><CaseUpper className="mr-2 h-4 w-4" /> UPPERCASE</Button>
                            <Button onClick={() => setText(text.toLowerCase())} variant="outline" size="sm"><CaseLower className="mr-2 h-4 w-4" /> lowercase</Button>
                            <Button onClick={handleCopy} variant="outline" size="sm"><Copy className="mr-2 h-4 w-4" /> Copy Text</Button>
                            <Button onClick={handleDownload} variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Download (.txt)</Button>
                            <Button onClick={handleClear} variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <h3 className="text-xl font-semibold mb-4 text-center">Statistics</h3>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <Card className="p-4">
                                <CardTitle className="text-2xl font-bold">{stats.words}</CardTitle>
                                <CardDescription>Words</CardDescription>
                            </Card>
                             <Card className="p-4">
                                <CardTitle className="text-2xl font-bold">{stats.sentences}</CardTitle>
                                <CardDescription>Sentences</CardDescription>
                            </Card>
                             <Card className="p-4">
                                <CardTitle className="text-2xl font-bold">{stats.paragraphs}</CardTitle>
                                <CardDescription>Paragraphs</CardDescription>
                            </Card>
                            <Card className="p-4 col-span-2">
                                <CardTitle className="text-2xl font-bold">{stats.readingTime}</CardTitle>
                                <CardDescription>Reading Time</CardDescription>
                            </Card>
                            <Card className="p-4 col-span-2">
                                <CardTitle className="text-2xl font-bold">{stats.characters}</CardTitle>
                                <CardDescription>Characters (with spaces)</CardDescription>
                            </Card>
                             <Card className="p-4 col-span-2">
                                <CardTitle className="text-2xl font-bold">{stats.charactersNoSpaces}</CardTitle>
                                <CardDescription>Characters (no spaces)</CardDescription>
                            </Card>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
