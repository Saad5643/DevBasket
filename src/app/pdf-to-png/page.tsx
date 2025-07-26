
'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileImage, UploadCloud, FileText, Download, RefreshCw, XCircle, FileArchive, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Set worker source for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

type ConversionStatus = 'idle' | 'processing' | 'success' | 'error';
type PngImage = { pageNumber: number; url: string };

type ToastInfo = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export default function PdfToPngConverter() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [imageUrls, setImageUrls] = useState<PngImage[]>([]);
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

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      setToastInfo({
        variant: 'destructive',
        title: 'File Error',
        description: error.code === 'file-too-large' ? `File exceeds ${MAX_SIZE_MB}MB limit.` : 'Invalid file type. Please upload a PDF.',
      });
      return;
    }
    
    if (acceptedFiles.length > 0) {
      handleReset();
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
  });

  const handleConvert = async () => {
    if (!file) return;

    setStatus('processing');
    setProgress(0);
    const newImageUrls: PngImage[] = [];

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High resolution
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');
        
        if (!context) continue;

        await page.render({ canvasContext: context, viewport }).promise;
        newImageUrls.push({ pageNumber: i, url: canvas.toDataURL('image/png') });
        
        setProgress(Math.round((i / numPages) * 100));
      }

      setImageUrls(newImageUrls);
      setStatus('success');
      setToastInfo({ title: 'Conversion Successful!', description: `${numPages} pages converted to PNG.` });

    } catch (error) {
      setStatus('error');
      setToastInfo({ variant: 'destructive', title: 'Conversion Failed', description: 'There was an error processing your PDF.' });
      console.error(error);
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setImageUrls([]);
  };

  const handleDownloadSingle = (url: string, pageNumber: number) => {
    saveAs(url, `page-${pageNumber}.png`);
  };

  const handleDownloadAllAsZip = async () => {
    if (imageUrls.length === 0) return;

    setToastInfo({ title: 'Zipping files...', description: 'Please wait while we create your ZIP archive.' });
    const zip = new JSZip();
    for (const image of imageUrls) {
      const response = await fetch(image.url);
      const blob = await response.blob();
      zip.file(`page-${image.pageNumber}.png`, blob);
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${file?.name.replace('.pdf', '') || 'images'}.zip`);
      setToastInfo({ title: 'Download Started!', description: 'Your ZIP file is being downloaded.' });
    });
  };

  const fileSize = file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '';

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
              <FileImage className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              PDF to PNG Converter
            </CardTitle>
            <CardDescription>
              Convert each page of your PDF into high-quality PNG images.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status !== 'success' && (
              <div
                {...getRootProps()}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  isDragActive ? 'border-primary bg-primary/10' : 'border-border bg-muted/50 hover:bg-muted'
                )}
              >
                <input {...getInputProps()} />
                {!file ? (
                  <div className="text-center">
                    <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-semibold">Drag & drop a PDF here, or click to select</p>
                    <p className="text-sm text-muted-foreground">Max file size: {MAX_SIZE_MB}MB</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-lg">
                    <FileText className="h-12 w-12 text-primary" />
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{fileSize}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleReset(); }}>
                      <XCircle className="h-6 w-6 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {file && status === 'idle' && (
              <div className="flex justify-center">
                <Button onClick={handleConvert} size="lg">Convert to PNG</Button>
              </div>
            )}
            
            {status === 'processing' && (
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground animate-pulse">Converting your document...</p>
                <Progress value={progress} className="w-full" />
                <p className="font-semibold">{progress}%</p>
              </div>
            )}

            {status === 'success' && (
              <div className="animate-in fade-in-50">
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <Button onClick={handleDownloadAllAsZip} size="lg">
                    <FileArchive className="mr-2 h-5 w-5" /> Download All as ZIP
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="lg">
                    <RefreshCw className="mr-2 h-5 w-5" /> Convert Another
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto p-4 bg-muted/50 rounded-lg">
                  {imageUrls.map((image) => (
                    <Card key={image.pageNumber} className="group overflow-hidden">
                      <CardContent className="p-2">
                        <div className="aspect-[2/3] bg-white flex items-center justify-center rounded-md overflow-hidden">
                          <Image
                            src={image.url}
                            alt={`Page ${image.pageNumber}`}
                            width={200}
                            height={300}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-medium">Page {image.pageNumber}</p>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDownloadSingle(image.url, image.pageNumber)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
