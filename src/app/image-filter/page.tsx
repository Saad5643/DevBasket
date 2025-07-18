
'use client';

import { useState, useRef, ChangeEvent, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialFilters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  'hue-rotate': 0,
  invert: 0,
  opacity: 100,
  sharpen: 0,
};

type FilterKeys = keyof typeof initialFilters;

type ToastInfo = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export default function ImageFilterTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters);
  const { toast } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);

  useEffect(() => {
    if (toastInfo) {
      toast({
        title: toastInfo.title,
        description: toastInfo.description,
        variant: toastInfo.variant,
      });
      setToastInfo(null);
    }
  }, [toastInfo, toast]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        setToastInfo({ title: "Image loaded successfully!" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterChange = (filterName: FilterKeys, value: number) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setToastInfo({ title: "Filters Reset", description: "All filter values have been reset to their defaults." });
  }, []);
  
  const getCssFilterString = () => {
    const sharpenContrast = 100 + filters.sharpen / 2;

    return `
      brightness(${filters.brightness}%)
      contrast(${sharpenContrast}%)
      saturate(${filters.saturate}%)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      blur(${filters.blur}px)
      hue-rotate(${filters['hue-rotate']}deg)
      invert(${filters.invert}%)
      opacity(${filters.opacity}%)
    `.trim();
  };

  const downloadImage = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) {
      setToastInfo({ variant: 'destructive', title: "Error", description: "Cannot download image. Please upload an image first." });
      return;
    }
    
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
       setToastInfo({ variant: 'destructive', title: "Error", description: "Could not get canvas context." });
       return;
    }

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.filter = getCssFilterString();
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    const link = document.createElement('a');
    link.download = 'filtered-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setToastInfo({ title: "Image Downloading", description: "Your filtered image has started downloading." });
  }, [getCssFilterString]);


  const filterControls = [
    { name: 'Brightness', key: 'brightness', min: 0, max: 200, unit: '%' },
    { name: 'Contrast', key: 'contrast', min: 0, max: 200, unit: '%' },
    { name: 'Saturation', key: 'saturate', min: 0, max: 200, unit: '%' },
    { name: 'Grayscale', key: 'grayscale', min: 0, max: 100, unit: '%' },
    { name: 'Sepia', key: 'sepia', min: 0, max: 100, unit: '%' },
    { name: 'Invert', key: 'invert', min: 0, max: 100, unit: '%' },
    { name: 'Opacity', key: 'opacity', min: 0, max: 100, unit: '%' },
    { name: 'Blur', key: 'blur', min: 0, max: 20, unit: 'px' },
    { name: 'Hue Rotate', key: 'hue-rotate', min: 0, max: 360, unit: 'deg' },
    { name: 'Sharpen (simulated)', key: 'sharpen', min: 0, max: 100, unit: '%' },
  ];

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
                    <ImageIcon className="h-8 w-8" />
                </div>
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Image Filter & Editor
                </CardTitle>
                <CardDescription>
                    Upload an image and apply filters in real-time.
                </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Preview</h3>
                  <Card className="flex items-center justify-center p-4 border-dashed min-h-[400px] bg-muted/50">
                    {imageSrc ? (
                      <Image
                        ref={imageRef}
                        src={imageSrc}
                        alt="Preview"
                        width={800}
                        height={600}
                        className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md"
                        style={{ filter: getCssFilterString() }}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                        <p>Upload an image to start filtering</p>
                      </div>
                    )}
                  </Card>
                   <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="lg:col-span-1">
                  <h3 className="text-xl font-semibold mb-4">Controls</h3>
                  <div className="space-y-4">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleImageUpload}
                    />
                    <Button asChild className="w-full">
                       <Label htmlFor="image-upload" className="cursor-pointer"><Upload className="mr-2 h-4 w-4" /> Upload Image</Label>
                    </Button>
                    <div className="space-y-6 pt-4 max-h-[450px] overflow-y-auto pr-2">
                      {filterControls.map(fc => (
                        <div key={fc.key}>
                           <Label htmlFor={fc.key} className="flex justify-between mb-2"><span>{fc.name}</span> <span>{filters[fc.key as FilterKeys]}{fc.unit}</span></Label>
                           <Slider id={fc.key} min={fc.min} max={fc.max} step={1} value={[filters[fc.key as FilterKeys]]} onValueChange={(val) => handleFilterChange(fc.key as FilterKeys, val[0])} disabled={!imageSrc} />
                        </div>
                      ))}
                    </div>
                     <div className="flex flex-wrap gap-2 pt-4">
                        <Button onClick={resetFilters} variant="outline" className="flex-1" disabled={!imageSrc}><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                        <Button onClick={downloadImage} className="flex-1" disabled={!imageSrc}><Download className="mr-2 h-4 w-4" /> Download</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
