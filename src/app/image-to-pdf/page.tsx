
'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UploadCloud, FileText, Download, RefreshCw, XCircle, Images, Loader2, Move, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ImageFile = {
  id: string;
  file: File;
  preview: string;
};

type PageSize = 'a4' | 'letter';
type Orientation = 'p' | 'l';

export default function ImageToPdfConverter() {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('p');
  const [margin, setMargin] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: `${file.name}-${file.lastModified}`,
        file,
        preview: URL.createObjectURL(file),
      }));

    setImages(prev => [...prev, ...newImages]);
    toast({ title: `${newImages.length} image(s) added.` });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    multiple: true,
  });

  const handleReset = () => {
    images.forEach(image => URL.revokeObjectURL(image.preview));
    setImages([]);
    setIsLoading(false);
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if(imageToRemove) URL.revokeObjectURL(imageToRemove.preview);
    setImages(prev => prev.filter(img => img.id !== id));
  };
  
  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newImages = [...images];
    const draggedItemContent = newImages.splice(dragItem.current, 1)[0];
    newImages.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setImages(newImages);
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      toast({ variant: 'destructive', title: 'No images to convert.' });
      return;
    }
    setIsLoading(true);

    try {
      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
      });

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imgData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(image.file);
        });

        const img = document.createElement('img');
        await new Promise<void>(resolve => {
            img.onload = () => resolve();
            img.src = imgData;
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;
        
        const imgWidth = img.width;
        const imgHeight = img.height;
        const aspectRatio = imgWidth / imgHeight;

        let finalWidth, finalHeight;

        if (imgWidth / usableWidth > imgHeight / usableHeight) {
          finalWidth = usableWidth;
          finalHeight = finalWidth / aspectRatio;
        } else {
          finalHeight = usableHeight;
          finalWidth = finalHeight * aspectRatio;
        }
        
        if (i > 0) doc.addPage();
        
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        doc.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
      }

      doc.save('converted-images.pdf');
      toast({ title: 'PDF created successfully!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error creating PDF', description: 'An unexpected error occurred.' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
              <Images className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Image to PDF Converter
            </CardTitle>
            <CardDescription>
              Combine multiple images into a single PDF. Drag to reorder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel: Upload and Options */}
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>1. Upload Images</CardTitle></CardHeader>
                  <CardContent>
                    <div {...getRootProps()} className={cn(
                      "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer",
                      isDragActive ? "border-primary bg-primary/10" : "border-border bg-muted/50 hover:bg-muted"
                    )}>
                      <input {...getInputProps()} />
                      <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="font-semibold">Drag & drop images here</p>
                      <p className="text-sm text-muted-foreground">or click to select files</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader><CardTitle>2. PDF Options</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="page-size">Page Size</Label>
                       <Select value={pageSize} onValueChange={v => setPageSize(v as PageSize)}>
                          <SelectTrigger id="page-size"><SelectValue/></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a4">A4</SelectItem>
                            <SelectItem value="letter">Letter</SelectItem>
                          </SelectContent>
                       </Select>
                     </div>
                      <div>
                       <Label htmlFor="orientation">Orientation</Label>
                       <Select value={orientation} onValueChange={v => setOrientation(v as Orientation)}>
                          <SelectTrigger id="orientation"><SelectValue/></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="p">Portrait</SelectItem>
                            <SelectItem value="l">Landscape</SelectItem>
                          </SelectContent>
                       </Select>
                     </div>
                     <div className="sm:col-span-2">
                       <Label htmlFor="margin">Margin (mm)</Label>
                       <Input id="margin" type="number" value={margin} onChange={e => setMargin(Number(e.target.value))} min={0} max={50} />
                     </div>
                  </CardContent>
                </Card>
                <div className="flex gap-4">
                  <Button onClick={handleConvert} size="lg" className="w-full" disabled={images.length === 0 || isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                    Create PDF
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="lg" disabled={isLoading}>
                    <RefreshCw className="mr-2 h-4 w-4"/> Reset
                  </Button>
                </div>
              </div>

              {/* Right Panel: Image Preview & Reorder */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Uploaded Images ({images.length})</h3>
                <Card className="h-[500px] bg-muted/50 p-4 overflow-y-auto">
                  {images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={image.id}
                          className="relative group aspect-square bg-background rounded-lg shadow-sm cursor-grab"
                          draggable
                          onDragStart={() => (dragItem.current = index)}
                          onDragEnter={() => (dragOverItem.current = index)}
                          onDragEnd={handleSort}
                          onDragOver={e => e.preventDefault()}
                        >
                          <Image src={image.preview} alt={`preview ${index + 1}`} fill className="object-cover rounded-lg" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeImage(image.id)}>
                               <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>
                          <div className="absolute top-1 left-1 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                       <FileText className="h-16 w-16 mb-4"/>
                       <p>Your uploaded images will appear here.</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
