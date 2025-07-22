
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { colord, extend } from 'colord';
import harmonies from 'colord/plugins/harmonies';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Palette, Copy, Download, FileJson, FileImage, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateHarmonies, HarmonyType, harmonyTypes } from '@/lib/color-utils';

extend([harmonies]);

type ToastInfo = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export default function ColorPaletteGenerator() {
  const { toast } = useToast();
  const [baseColor, setBaseColor] = useState('#A020F0');
  const [harmonies, setHarmonies] = useState<Record<HarmonyType, string[]>>({
    analogous: [],
    complementary: [],
    'split-complementary': [],
    triadic: [],
  });
  const paletteRef = useRef<HTMLDivElement>(null);
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);

  useEffect(() => {
    if (toastInfo) {
      toast(toastInfo);
      setToastInfo(null);
    }
  }, [toastInfo, toast]);

  useEffect(() => {
    if (colord(baseColor).isValid()) {
      setHarmonies(generateHarmonies(baseColor));
    }
  }, [baseColor]);
  
  const handleColorChange = (color: string) => {
    if (colord(color).isValid()) {
      setBaseColor(color);
    }
  };

  const handleRegenerate = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setBaseColor(randomColor);
    setToastInfo({ title: 'New palette generated!', description: `Base color set to ${randomColor}.` });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastInfo({ title: 'Copied to clipboard!', description: `${text} has been copied.` });
  };

  const downloadJson = (paletteType: HarmonyType) => {
    const palette = harmonies[paletteType];
    const jsonString = JSON.stringify({
      name: `${paletteType.charAt(0).toUpperCase() + paletteType.slice(1)} Palette`,
      baseColor,
      colors: palette,
    }, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paletteType}-palette.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const downloadPng = useCallback((paletteType: HarmonyType) => {
     const element = document.getElementById(`${paletteType}-palette`);
    if (!element) return;
    
    toPng(element, { cacheBust: true, pixelRatio: 2, style: { padding: '1rem', background: 'hsl(var(--card))'} })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${paletteType}-palette.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch(() => {
        setToastInfo({ variant: "destructive", title: "Oops!", description: "Something went wrong generating the image."});
      });
  }, [baseColor]);

  const HSLSliders = () => {
    const hsl = colord(baseColor).toHsl();
    
    const handleSliderChange = (type: 'h' | 's' | 'l', value: number) => {
      const newHsl = { ...hsl, [type]: value };
      setBaseColor(colord(newHsl).toHex());
    };

    return (
      <div className="space-y-4">
        <div>
          <Label>Hue ({hsl.h})</Label>
          <Slider value={[hsl.h]} onValueChange={([v]) => handleSliderChange('h', v)} max={360} step={1} />
        </div>
        <div>
          <Label>Saturation ({hsl.s}%)</Label>
          <Slider value={[hsl.s]} onValueChange={([v]) => handleSliderChange('s', v)} max={100} step={1} />
        </div>
        <div>
          <Label>Lightness ({hsl.l}%)</Label>
          <Slider value={[hsl.l]} onValueChange={([v]) => handleSliderChange('l', v)} max={100} step={1} />
        </div>
      </div>
    );
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
              <Palette className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Color Palette Generator
            </CardTitle>
            <CardDescription>
              Pick a color and generate beautiful, harmonious color palettes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Controls */}
              <div className="lg:col-span-2 space-y-6">
                 <Button onClick={handleRegenerate} size="lg" className="w-full">
                  <Shuffle className="mr-2 h-5 w-5" />
                  Regenerate Random Palette
                </Button>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">Color Picker</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative h-24 w-full rounded-md border border-border" style={{ backgroundColor: baseColor }} />
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={baseColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                       <Input
                        value={baseColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="font-mono uppercase"
                      />
                    </div>
                    <HSLSliders />
                  </CardContent>
                </Card>
              </div>

              {/* Palettes */}
              <div className="lg:col-span-3">
                <h3 className="text-xl font-semibold mb-4 text-center">Generated Palettes</h3>
                 <Tabs defaultValue="analogous" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                       {harmonyTypes.map(type => (
                          <TabsTrigger key={type} value={type} className="capitalize">{type.replace('-', ' ')}</TabsTrigger>
                       ))}
                    </TabsList>
                   {Object.entries(harmonies).map(([type, colors]) => (
                      <TabsContent key={type} value={type}>
                        <Card className="p-4">
                          <div id={`${type}-palette`} className="flex flex-col md:flex-row h-80 md:h-60 w-full rounded-lg overflow-hidden shadow-inner bg-card">
                            {colors.map((color, index) => (
                              <div
                                key={`${color}-${index}`}
                                className="w-full h-full flex items-end justify-center p-2 text-white font-mono text-sm cursor-pointer relative group"
                                style={{ backgroundColor: color }}
                                onClick={() => copyToClipboard(color)}
                              >
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 px-2 py-1 rounded-md">{color}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-4 justify-end">
                            <Button variant="outline" size="sm" onClick={() => downloadPng(type as HarmonyType)}>
                               <FileImage className="mr-2 h-4 w-4" /> PNG
                            </Button>
                             <Button variant="outline" size="sm" onClick={() => downloadJson(type as HarmonyType)}>
                               <FileJson className="mr-2 h-4 w-4" /> JSON
                            </Button>
                          </div>
                        </Card>
                      </TabsContent>
                   ))}
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
