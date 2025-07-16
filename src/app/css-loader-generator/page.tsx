
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Copy, Loader2 as LoaderIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const SpinnerLoader = ({ color, size }: { color: string; size: number }) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    border: `4px solid ${color}33`, // 20% opacity
    borderTopColor: color,
    borderRadius: '50%',
  };

  return <div style={style} className="animate-spin"></div>;
};

export default function CssLoaderGenerator() {
  const { toast } = useToast();
  const [color, setColor] = useState('#A020F0');
  const [size, setSize] = useState(48);

  const cssCode = `
.spinner {
  width: ${size}px;
  height: ${size}px;
  border: 4px solid ${color}33;
  border-top-color: ${color};
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
  `.trim();

  const htmlCode = `<div class="spinner"></div>`;

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: `${type} Copied!`,
      description: `The ${type.toLowerCase()} code has been copied to your clipboard.`,
    });
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

        <Card className="max-w-4xl mx-auto shadow-lg border-border/60">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <LoaderIcon className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              CSS Loader Generator
            </CardTitle>
            <CardDescription>
              Customize and generate CSS for simple, elegant loaders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                <h3 className="text-xl font-semibold">Preview</h3>
                <Card className="w-full h-64 flex items-center justify-center bg-muted/50 border-dashed">
                  <SpinnerLoader color={color} size={size} />
                </Card>
                <div className="w-full space-y-6">
                   <div>
                      <Label htmlFor="color-picker" className="mb-2 flex items-center justify-between">
                        <span>Color</span>
                        <span className="font-mono text-sm uppercase">{color}</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input id="color-picker" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="p-1 h-10 w-14 cursor-pointer" />
                        <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="#A020F0" className="flex-1" />
                      </div>
                  </div>
                   <div>
                      <Label htmlFor="size-slider" className="mb-2 flex justify-between"><span>Size</span> <span>{size}px</span></Label>
                      <Slider id="size-slider" min={12} max={128} step={1} value={[size]} onValueChange={(val) => setSize(val[0])} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Code</h3>
                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                  </TabsList>
                  <TabsContent value="html">
                    <Card className="relative bg-muted/50 font-mono text-sm">
                      <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopy(htmlCode, 'HTML')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="p-4 overflow-x-auto"><code>{htmlCode}</code></pre>
                    </Card>
                  </TabsContent>
                  <TabsContent value="css">
                     <Card className="relative bg-muted/50 font-mono text-sm">
                       <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopy(cssCode, 'CSS')}>
                         <Copy className="h-4 w-4" />
                       </Button>
                      <pre className="p-4 overflow-x-auto"><code>{cssCode}</code></pre>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
