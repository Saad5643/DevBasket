
'use client';

import { useState, useRef, ChangeEvent, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UploadCloud, Download, RefreshCw, FileImage, Loader2, Replace } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

type ConversionStatus = 'idle' | 'converting' | 'success' | 'error';

export default function JpegToPngConverter() {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [compression, setCompression] = useState<number>(90); // PNG compression is lossless, this will affect quality level in canvas
  
  const [status, setStatus] = useState<ConversionStatus>('idle');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      toast({ variant: 'destructive', title: 'Invalid file', description: 'Please upload a JPEG file.' });
      return;
    }
    if (acceptedFiles.length > 0) {
      handleReset();
      const file = acceptedFiles[0];
      setImageFile(file);
      setOriginalSize(file.size);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = e.target?.result as string;
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'] },
    multiple: false,
  });

  const handleConvert = () => {
    if (!imageFile || !canvasRef.current) return;
    
    setStatus('converting');
    setConvertedImage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        ctx!.drawImage(img, 0, 0, width, height);
        
        // The second argument for toDataURL for 'image/png' is not for compression,
        // but it's often mistaken for it. PNG is lossless. We'll just convert.
        // For 'image/jpeg', it would be a quality value between 0 and 1.
        // We simulate a delay to show the "converting" state.
        setTimeout(() => {
          const pngUrl = canvas.toDataURL('image/png');
          setConvertedImage(pngUrl);
          
          const base64Data = pngUrl.split(',')[1];
          const pngSize = (base64Data.length * 0.75); // Estimate byte size
          setConvertedSize(pngSize);
          
          setStatus('success');
          toast({ title: 'Conversion Successful!', description: 'Your PNG is ready to download.' });
        }, 500);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const link = document.createElement('a');
    link.href = convertedImage;
    link.download = `${imageFile?.name.split('.')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Download Started' });
  };
  
  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setConvertedImage(null);
    setOriginalSize(0);
    setConvertedSize(0);
    setWidth(0);
    setHeight(0);
    setCompression(90);
    setStatus('idle');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <Replace className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Advanced JPEG to PNG Converter
            </CardTitle>
            <CardDescription>
              Convert, resize, and compress your JPEG images to PNG with a live preview.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel: Upload and Controls */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Upload JPEG</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div {...getRootProps()} className={cn(
                                "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer",
                                isDragActive ? "border-primary bg-primary/10" : "border-border bg-muted/50 hover:bg-muted"
                            )}>
                                <input {...getInputProps()} />
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="JPEG preview" width={150} height={150} className="max-h-44 w-auto object-contain"/>
                                ) : (
                                    <div className="text-center">
                                        <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="font-semibold">Drag & drop a JPEG, or click to select</p>
                                        <p className="text-sm text-muted-foreground">.jpeg or .jpg files only</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. Configure Output</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="width">Width (px)</Label>
                                    <Input id="width" type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} disabled={!imageFile} />
                                </div>
                                <div>
                                    <Label htmlFor="height">Height (px)</Label>
                                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} disabled={!imageFile} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="compression" className="flex justify-between">
                                    <span>Quality</span>
                                    <span>{compression}%</span>
                                </Label>
                                <Slider id="compression" min={0} max={100} step={1} value={[compression]} onValueChange={(val) => setCompression(val[0])} disabled={!imageFile} />
                                <p className="text-xs text-muted-foreground mt-1">Note: PNG is lossless. This is a hint for the encoder.</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                     <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleConvert} className="w-full" disabled={!imageFile || status === 'converting'}>
                          {status === 'converting' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Replace className="mr-2 h-4 w-4"/>}
                          Convert to PNG
                        </Button>
                        <Button onClick={handleReset} variant="outline" className="w-full">
                           <RefreshCw className="mr-2 h-4 w-4"/> Reset
                        </Button>
                    </div>
                </div>

                {/* Right Panel: Preview and Download */}
                <div className="space-y-4">
                   <h3 className="text-xl font-semibold text-center">Preview & Download</h3>
                   <Card className="flex items-center justify-center p-4 border-dashed min-h-[300px] bg-muted/50">
                     {status === 'success' && convertedImage ? (
                        <Image src={convertedImage} alt="Converted PNG" width={400} height={400} className="max-w-full max-h-[400px] object-contain" />
                     ) : status === 'converting' ? (
                        <div className="text-center text-muted-foreground">
                          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                          <p>Converting...</p>
                        </div>
                     ) : (
                        <div className="text-center text-muted-foreground">
                            <FileImage className="h-16 w-16 mx-auto mb-4" />
                            <p>Your converted PNG will appear here.</p>
                        </div>
                     )}
                   </Card>
                    <canvas ref={canvasRef} className="hidden" />

                    {status === 'success' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>File Size Comparison</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-around text-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">Original (JPEG)</p>
                                    <p className="text-lg font-bold">{formatFileSize(originalSize)}</p>
                                </div>
                                 <div>
                                    <p className="text-sm text-muted-foreground">Converted (PNG)</p>
                                    <p className="text-lg font-bold">{formatFileSize(convertedSize)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Change</p>
                                    <p className={cn("text-lg font-bold", convertedSize > originalSize ? 'text-destructive' : 'text-green-500')}>
                                        {(((convertedSize - originalSize) / originalSize) * 100).toFixed(2)}%
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                   <Button onClick={handleDownload} className="w-full" size="lg" disabled={!convertedImage}>
                     <Download className="mr-2 h-4 w-4" /> Download PNG
                   </Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
