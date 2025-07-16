'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Type, AlignLeft, AlignCenter, AlignRight, Copy, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const googleFonts = [
  'Inter', 'Roboto', 'Poppins', 'Montserrat', 'Lato', 'Oswald', 'Playfair Display',
  'Nunito', 'Open Sans', 'Source Code Pro', 'Merriweather', 'Raleway', 'Ubuntu'
];

const fontWeights = [
  { label: 'Thin', value: 100 },
  { label: 'Extra Light', value: 200 },
  { label: 'Light', value: 300 },
  { label: 'Normal', value: 400 },
  { label: 'Medium', value: 500 },
  { label: 'Semi Bold', value: 600 },
  { label: 'Bold', value: 700 },
  { label: 'Extra Bold', value: 800 },
  { label: 'Black', value: 900 },
];

export default function FontChanger() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(32);
  const [fontWeight, setFontWeight] = useState(400);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const { toast } = useToast();

  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = `https://fonts.googleapis.com/css2?family=${googleFonts.join('&family=').replace(/ /g, '+')}&display=swap`;
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }, []);

  const previewStyle = {
    fontFamily: `'${fontFamily}', sans-serif`,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    lineHeight: lineHeight,
    textAlign: textAlign,
  };

  const handleCopyCss = () => {
    const css = `font-family: '${fontFamily}', sans-serif;\nfont-size: ${fontSize}px;\nfont-weight: ${fontWeight};\nline-height: ${lineHeight};\ntext-align: ${textAlign};`;
    navigator.clipboard.writeText(css);
    toast({
        title: "CSS Copied!",
        description: "The font styles have been copied to your clipboard.",
    });
  };
  
  const handleReset = () => {
    setText('The quick brown fox jumps over the lazy dog.');
    setFontFamily('Inter');
    setFontSize(32);
    setFontWeight(400);
    setLineHeight(1.5);
    setTextAlign('left');
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

        <Card className="max-w-6xl mx-auto shadow-lg border-border/60">
            <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
                    <Type className="h-8 w-8" />
                </div>
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Font Changer & Preview
                </CardTitle>
                <CardDescription>
                    Experiment with different fonts and styles in real-time.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-semibold mb-4">Controls</h3>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="font-family">Font Family</Label>
                                <Select value={fontFamily} onValueChange={setFontFamily}>
                                    <SelectTrigger id="font-family">
                                        <SelectValue placeholder="Select a font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {googleFonts.map(font => (
                                            <SelectItem key={font} value={font} style={{fontFamily: font}}>{font}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                <Label htmlFor="font-weight">Font Weight</Label>
                                <Select value={String(fontWeight)} onValueChange={(val) => setFontWeight(Number(val))}>
                                    <SelectTrigger id="font-weight">
                                        <SelectValue placeholder="Select weight" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fontWeights.map(weight => (
                                            <SelectItem key={weight.value} value={String(weight.value)}>{weight.label} ({weight.value})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="font-size" className="flex justify-between"><span>Font Size</span> <span>{fontSize}px</span></Label>
                                <Slider id="font-size" min={12} max={128} step={1} value={[fontSize]} onValueChange={(val) => setFontSize(val[0])} />
                            </div>
                             <div>
                                <Label htmlFor="line-height" className="flex justify-between"><span>Line Height</span> <span>{lineHeight.toFixed(1)}</span></Label>
                                <Slider id="line-height" min={0.8} max={3} step={0.1} value={[lineHeight]} onValueChange={(val) => setLineHeight(val[0])} />
                            </div>
                             <div>
                                <Label className="flex justify-between"><span>Text Align</span></Label>
                                <ToggleGroup type="single" value={textAlign} onValueChange={(val: 'left' | 'center' | 'right') => val && setTextAlign(val)} className="w-full">
                                    <ToggleGroupItem value="left" aria-label="Align left" className="w-full"><AlignLeft /></ToggleGroupItem>
                                    <ToggleGroupItem value="center" aria-label="Align center" className="w-full"><AlignCenter /></ToggleGroupItem>
                                    <ToggleGroupItem value="right" aria-label="Align right" className="w-full"><AlignRight /></ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                        </div>
                         <div className="flex flex-wrap gap-2 mt-8">
                            <Button onClick={handleCopyCss} className="flex-1"><Copy className="mr-2 h-4 w-4" /> Copy CSS</Button>
                            <Button onClick={handleReset} variant="outline" className="flex-1"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                         <h3 className="text-xl font-semibold mb-4">Preview</h3>
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type something to preview fonts..."
                            className="w-full text-base mb-4"
                        />
                        <Card className="h-96 flex items-center justify-center p-6 border-dashed" style={{...previewStyle, overflow: 'auto'}}>
                            <p>{text}</p>
                        </Card>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
