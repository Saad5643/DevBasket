
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileSignature, UploadCloud, FileText, Wand2, Download, RefreshCw, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

type ConversionStatus = 'idle' | 'uploading' | 'converting' | 'success' | 'error';

type ToastInfo = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export default function PdfToWordConverter() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [useOcr, setUseOcr] = useState(false);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
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
      if (error.code === 'file-too-large') {
        setToastInfo({ variant: 'destructive', title: 'File Error', description: `Please upload a file smaller than ${MAX_SIZE_MB}MB.` });
      } else {
        setToastInfo({ variant: 'destructive', title: 'File Error', description: 'Please upload a valid PDF file.' });
      }
      return;
    }
    
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('idle');
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
  });

  const handleConvert = () => {
    if (!file) return;

    setStatus('converting');
    setProgress(0);
    
    // Simulate conversion progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setStatus('success');
          setToastInfo({ title: "Conversion Complete!", description: "Your DOCX file is ready for download." });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const handleDownload = () => {
    // In a real app, this would trigger a download from a server URL
    const link = document.createElement('a');
    link.href = '#'; // Placeholder
    link.download = `${file?.name.replace(/\.pdf$/, '') || 'document'}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastInfo({ title: 'Download Started', description: 'This is a placeholder download.' });
  };
  
  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setUseOcr(false);
  };

  const fileSize = useMemo(() => {
    if (!file) return '';
    const sizeInMB = file.size / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
  }, [file]);

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

        <Card className="max-w-3xl mx-auto shadow-lg border-border/60">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <FileSignature className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              PDF to Word Converter
            </CardTitle>
            <CardDescription>
              Easily convert your PDF files into editable DOCX documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
                <div
                {...getRootProps()}
                className={cn(
                    "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    isDragActive ? 'border-primary bg-primary/10' : 'border-border bg-muted/50 hover:bg-muted'
                )}
                >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                    <UploadCloud className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-lg font-semibold text-foreground">
                    {isDragActive ? "Drop the file here..." : "Drag & drop a PDF here, or click to select"}
                    </p>
                    <p className="text-sm text-muted-foreground">Maximum file size: {MAX_SIZE_MB}MB</p>
                </div>
                </div>
            ) : (
                 <Card className="p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <FileText className="h-10 w-10 text-primary" />
                            <div>
                                <p className="font-semibold truncate max-w-xs">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{fileSize}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleReset}>
                            <XCircle className="h-6 w-6 text-destructive" />
                        </Button>
                    </div>
                </Card>
            )}

            <Card className="p-4" hidden={!file || status !== 'idle'}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Label htmlFor="ocr-switch" className="font-semibold">Enable OCR</Label>
                   <Switch id="ocr-switch" checked={useOcr} onCheckedChange={setUseOcr} />
                </div>
                 <p className="text-sm text-muted-foreground">For scanned documents or images in PDF</p>
              </div>
            </Card>

            <div className="pt-4">
              {status === 'idle' && file && (
                 <Button onClick={handleConvert} size="lg" className="w-full">
                    <Wand2 className="mr-2 h-5 w-5" /> Convert to Word
                </Button>
              )}
              
              {status === 'converting' && (
                <div className="space-y-4 text-center">
                  <Progress value={progress} className="w-full" />
                  <p className="text-muted-foreground animate-pulse">Converting your document... {useOcr && '(with OCR)'}</p>
                </div>
              )}
              
              {status === 'success' && (
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleDownload} size="lg" className="flex-1">
                        <Download className="mr-2 h-5 w-5" /> Download DOCX
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="lg" className="flex-1">
                        <RefreshCw className="mr-2 h-5 w-5" /> Convert Another File
                    </Button>
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}
