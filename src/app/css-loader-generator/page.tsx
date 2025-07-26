
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Copy, Loader2 as LoaderIcon, MoreVertical, Disc, ChevronLeft, ChevronRight, BarChart3, Waves, Square } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const loaderTypes = {
  spinner: {
    name: 'Spinner',
    icon: <LoaderIcon />,
    component: ({ color, size }: { color: string; size: number }) => (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `4px solid ${color}33`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    ),
    getCss: (color: string, size: number) => `
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
}`.trim(),
    getHtml: () => `<div class="spinner"></div>`,
  },
  dots: {
    name: 'Bouncing Dots',
    icon: <MoreVertical className="rotate-90" />,
    component: ({ color, size }: { color: string; size: number }) => (
      <div className="flex" style={{ gap: `${size / 8}px` }}>
        <div style={{ backgroundColor: color, width: size / 4, height: size / 4, borderRadius: '50%', animation: 'dot-bounce 1.4s infinite ease-in-out both' }} />
        <div style={{ backgroundColor: color, width: size / 4, height: size / 4, borderRadius: '50%', animation: 'dot-bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }} />
        <div style={{ backgroundColor: color, width: size / 4, height: size / 4, borderRadius: '50%', animation: 'dot-bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }} />
      </div>
    ),
    getCss: (color: string, size: number) => `
.bouncing-dots {
  display: flex;
  gap: ${size/8}px;
}
.dot {
  width: ${size / 4}px;
  height: ${size / 4}px;
  border-radius: 50%;
  background-color: ${color};
  animation: dot-bounce 1.4s infinite ease-in-out both;
}
.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
}
@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}`.trim(),
    getHtml: () => `
<div class="bouncing-dots">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</div>`.trim(),
  },
  pulse: {
    name: 'Pulsing Circle',
    icon: <Disc />,
    component: ({ color, size }: { color: string; size: number }) => (
       <div style={{ backgroundColor: color, width: size, height: size, borderRadius: '50%', animation: 'pulse 2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955)' }} />
    ),
    getCss: (color: string, size: number) => `
.pulsing-circle {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background-color: ${color};
  animation: pulse 2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}`.trim(),
    getHtml: () => `<div class="pulsing-circle"></div>`,
  },
   bars: {
    name: 'Sliding Bars',
    icon: <BarChart3 />,
    component: ({ color, size }: { color: string; size: number }) => (
      <div className="flex items-end justify-center" style={{gap: `${size/8}px`, height: `${size}px`, width: `${size}px`}}>
        <div style={{ backgroundColor: color, width: size / 5, height: size, animation: 'slide-up-down 1.2s infinite ease-in-out' }} />
        <div style={{ backgroundColor: color, width: size / 5, height: size, animation: 'slide-up-down 1.2s infinite ease-in-out', animationDelay: '0.2s' }} />
        <div style={{ backgroundColor: color, width: size / 5, height: size, animation: 'slide-up-down 1.2s infinite ease-in-out', animationDelay: '0.4s' }} />
      </div>
    ),
    getCss: (color: string, size: number) => `
.sliding-bars {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: ${size/8}px;
  width: ${size}px;
  height: ${size}px;
}
.bar {
  width: ${size/5}px;
  height: ${size}px;
  background-color: ${color};
  animation: slide-up-down 1.2s infinite ease-in-out;
}
.bar:nth-child(2) {
  animation-delay: 0.2s;
}
.bar:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes slide-up-down {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }  
  20% {
    transform: scaleY(1.0);
  }
}`.trim(),
    getHtml: () => `
<div class="sliding-bars">
  <div class="bar"></div>
  <div class="bar"></div>
  <div class="bar"></div>
</div>`.trim(),
  },
  wave: {
    name: 'Wave',
    icon: <Waves />,
    component: ({ color, size }: { color: string; size: number }) => (
       <div style={{ width: size, height: size, border: `3px solid ${color}`, borderRadius: '50%', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: size*2, height: size*2, backgroundColor: `${color}4D`, borderRadius: '40%', animation: 'wave-anim 3s infinite linear' }} />
       </div>
    ),
    getCss: (color: string, size: number) => `
.wave-loader {
  width: ${size}px;
  height: ${size}px;
  border: 3px solid ${color};
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}
.wave-loader::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${size * 2}px;
  height: ${size * 2}px;
  background-color: ${color}4D;
  border-radius: 40%;
  animation: wave-anim 3s infinite linear;
}
@keyframes wave-anim {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}`.trim(),
    getHtml: () => `<div class="wave-loader"></div>`,
  },
  fade: {
    name: 'Fading Dots',
    icon: <MoreVertical className="rotate-90" />,
    component: ({ color, size }: { color: string; size: number }) => (
      <div className="flex" style={{ gap: `${size / 8}px` }}>
        <div style={{ backgroundColor: color, width: size / 4, height: size / 4, borderRadius: '50%', animation: 'fade-in-out 1.2s infinite ease-in-out both' }} />
        <div style={{ backgroundColor: color, width: size / 4, height: size / 4, borderRadius: '50%', animation: 'fade-in-out 1.2s infinite ease-in-out both', animationDelay: '0.3s' }} />
        <div style={{ backgroundColor: color, width: size / 4, height: size / 4, borderRadius: '50%', animation: 'fade-in-out 1.2s infinite ease-in-out both', animationDelay: '0.6s' }} />
      </div>
    ),
    getCss: (color: string, size: number) => `
.fading-dots {
  display: flex;
  gap: ${size/8}px;
}
.fade-dot {
  width: ${size / 4}px;
  height: ${size / 4}px;
  border-radius: 50%;
  background-color: ${color};
  animation: fade-in-out 1.2s infinite ease-in-out both;
}
.fade-dot:nth-child(2) {
  animation-delay: 0.3s;
}
.fade-dot:nth-child(3) {
  animation-delay: 0.6s;
}
@keyframes fade-in-out {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}`.trim(),
    getHtml: () => `
<div class="fading-dots">
  <div class="fade-dot"></div>
  <div class="fade-dot"></div>
  <div class="fade-dot"></div>
</div>`.trim(),
  },
  orbit: {
    name: 'Orbit',
    icon: <Disc />,
    component: ({ color, size }: { color: string; size: number }) => (
      <div style={{ width: size, height: size, border: `2px solid ${color}33`, borderRadius: '50%', position: 'relative', animation: 'spin 2s linear infinite' }}>
        <div style={{ position: 'absolute', top: `-${size/10}px`, left: '50%', transform: 'translateX(-50%)', width: `${size/5}px`, height: `${size/5}px`, backgroundColor: color, borderRadius: '50%' }} />
      </div>
    ),
    getCss: (color: string, size: number) => `
.orbit-loader {
  width: ${size}px;
  height: ${size}px;
  border: 2px solid ${color}33;
  border-radius: 50%;
  position: relative;
  animation: spin 2s linear infinite;
}
.orbit-loader::before {
  content: '';
  position: absolute;
  top: -${size/10}px;
  left: 50%;
  transform: translateX(-50%);
  width: ${size/5}px;
  height: ${size/5}px;
  background-color: ${color};
  border-radius: 50%;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}`.trim(),
    getHtml: () => `<div class="orbit-loader"></div>`,
  },
  ripple: {
    name: 'Ripple',
    icon: <Disc />,
    component: ({ color, size }: { color: string; size: number }) => (
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{ position: 'absolute', border: `4px solid ${color}`, borderRadius: '50%', animation: 'ripple-anim 1.2s cubic-bezier(0, 0.2, 0.8, 1) infinite', opacity: 1}} />
        <div style={{ position: 'absolute', border: `4px solid ${color}`, borderRadius: '50%', animation: 'ripple-anim 1.2s cubic-bezier(0, 0.2, 0.8, 1) infinite', opacity: 1, animationDelay: '-0.6s'}} />
      </div>
    ),
    getCss: (color: string, size: number) => `
.ripple-loader {
  position: relative;
  width: ${size}px;
  height: ${size}px;
}
.ripple-loader div {
  position: absolute;
  border: 4px solid ${color};
  opacity: 1;
  border-radius: 50%;
  animation: ripple-anim 1.2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.ripple-loader div:nth-child(2) {
  animation-delay: -0.6s;
}
@keyframes ripple-anim {
  0% {
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}`.trim(),
    getHtml: () => `
<div class="ripple-loader">
  <div></div>
  <div></div>
</div>`.trim(),
  },
  flip: {
    name: 'Flipping Square',
    icon: <Square />,
    component: ({ color, size }: { color: string; size: number }) => (
      <div style={{ width: size, height: size, backgroundColor: color, animation: 'flip-anim 1.2s infinite ease-in-out' }} />
    ),
    getCss: (color: string, size: number) => `
.flipping-square {
  width: ${size}px;
  height: ${size}px;
  background-color: ${color};
  animation: flip-anim 1.2s infinite ease-in-out;
}
@keyframes flip-anim {
  0% {
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
  } 50% {
    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
  } 100% {
    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
  }
}`.trim(),
    getHtml: () => `<div class="flipping-square"></div>`,
  },
  typing: {
    name: 'Typing',
    icon: <MoreVertical className="rotate-90" />,
    component: ({ color, size }: { color: string; size: number }) => (
      <div className="flex" style={{gap: `${size/10}px`}}>
        <div style={{ backgroundColor: color, width: size / 5, height: size / 5, borderRadius: '50%', animation: 'typing-anim 1.4s infinite both' }} />
        <div style={{ backgroundColor: color, width: size / 5, height: size / 5, borderRadius: '50%', animation: 'typing-anim 1.4s infinite both', animationDelay: '.2s' }} />
        <div style={{ backgroundColor: color, width: size / 5, height: size / 5, borderRadius: '50%', animation: 'typing-anim 1.4s infinite both', animationDelay: '.4s' }} />
      </div>
    ),
    getCss: (color: string, size: number) => `
.typing-loader {
  display: flex;
  gap: ${size/10}px;
}
.typing-dot {
  width: ${size / 5}px;
  height: ${size / 5}px;
  border-radius: 50%;
  background-color: ${color};
  animation: typing-anim 1.4s infinite both;
}
.typing-dot:nth-child(2) {
  animation-delay: .2s;
}
.typing-dot:nth-child(3) {
  animation-delay: .4s;
}
@keyframes typing-anim {
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-${size/5}px);
  }
  40%, 100% {
    transform: translateY(0);
  }
}`.trim(),
    getHtml: () => `
<div class="typing-loader">
  <div class="typing-dot"></div>
  <div class="typing-dot"></div>
  <div class="typing-dot"></div>
</div>`.trim(),
  },
};

type LoaderType = keyof typeof loaderTypes;

export default function CssLoaderGenerator() {
  const { toast } = useToast();
  const [activeLoader, setActiveLoader] = useState<LoaderType>('spinner');
  const [color, setColor] = useState('#A020F0');
  const [size, setSize] = useState(48);

  const loaderKeys = Object.keys(loaderTypes) as LoaderType[];
  const selectedLoader = loaderTypes[activeLoader];

  // This is a workaround for a hydration mismatch issue with animations
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = Object.values(loaderTypes).map(l => l.getCss('#000', 48)).join('\n\n');
    document.head.appendChild(styleSheet);

    const keyframes = `
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes dot-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      @keyframes pulse { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }
      @keyframes slide-up-down { 0%, 40%, 100% { transform: scaleY(0.4); } 20% { transform: scaleY(1.0); } }
      @keyframes wave-anim { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
      @keyframes fade-in-out { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      @keyframes ripple-anim { 0% { top: 50%; left: 50%; width: 0; height: 0; opacity: 0; } 5% { top: 50%; left: 50%; width: 0; height: 0; opacity: 1; } 100% { top: 0px; left: 0px; width: 100%; height: 100%; opacity: 0; } }
      @keyframes flip-anim { 0% { transform: perspective(120px) rotateX(0deg) rotateY(0deg); } 50% { transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); } 100% { transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); } }
      @keyframes typing-anim { 0% { transform: translateY(0); } 20% { transform: translateY(-${size/5}px); } 40%, 100% { transform: translateY(0); } }
    `;

    const keyframeSheet = document.createElement("style");
    keyframeSheet.innerText = keyframes;
    document.head.appendChild(keyframeSheet);


  }, [size]);

  const cssCode = selectedLoader.getCss(color, size);
  const htmlCode = selectedLoader.getHtml();
  
  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: `${type} Copied!`,
      description: `The ${type.toLowerCase()} code has been copied to your clipboard.`,
    });
  };

  const cycleLoader = (direction: 'next' | 'prev') => {
    const currentIndex = loaderKeys.indexOf(activeLoader);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % loaderKeys.length;
    } else {
      nextIndex = (currentIndex - 1 + loaderKeys.length) % loaderKeys.length;
    }
    setActiveLoader(loaderKeys[nextIndex]);
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

        <Card className="max-w-4xl mx-auto shadow-lg border-border/60 bg-secondary/30 backdrop-blur-sm">
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
              <div className="flex flex-col space-y-6">
                
                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-2 text-center">{selectedLoader.name}</h3>
                  <Card className="w-full h-64 flex items-center justify-center bg-muted/50 border-dashed">
                    {isClient && selectedLoader.component({ color, size })}
                  </Card>
                   <div className="flex justify-center items-center gap-4 mt-4">
                      <Button variant="outline" size="icon" onClick={() => cycleLoader('prev')}>
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous Loader</span>
                      </Button>
                      <span className="text-sm text-muted-foreground">{loaderKeys.indexOf(activeLoader) + 1} / {loaderKeys.length}</span>
                      <Button variant="outline" size="icon" onClick={() => cycleLoader('next')}>
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next Loader</span>
                      </Button>
                   </div>
                </div>
                
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
                     <Card className="relative bg-muted/50 font-mono text-sm max-h-[400px] overflow-y-auto">
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

    
