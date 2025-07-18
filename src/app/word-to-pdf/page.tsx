
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileInput, UploadCloud, FileText, Wand2, Download, RefreshCw, XCircle, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

type ConversionStatus = 'idle' | 'uploading' | 'converting' | 'success' | 'error';
type PageSize = 'a4' | 'letter' | 'legal';
type MarginSize = 'narrow' | 'normal' | 'wide';

export default function WordToPdfConverter() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [margins, setMargins] = useState<MarginSize>('normal');
  const [dropError, setDropError] = useState<string | null>(null);

  useEffect(() => {
    if (dropError) {
      toast({ variant: 'destructive', title: 'File Error', description: dropError });
      setDropError(null);
    }
  }, [dropError, toast]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setDropError(null);
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      if (error.code === 'file-too-large') {
        setDropError(`Please upload a file smaller than ${MAX_SIZE_MB}MB.`);
      } else {
        setDropError('Please upload a DOC or DOCX file.');
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
    accept: { 
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
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
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('success');
          toast({ title: "Conversion Complete!", description: "Your PDF file is ready for download." });
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
    link.download = `${file?.name.replace(/\.(docx?)$/, '') || 'document'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Download Started', description: 'This is a placeholder download.' });
  };
  
  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setPageSize('a4');
    setMargins('normal');
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
              <FileInput className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Word to PDF Converter
            </CardTitle>
            <CardDescription>
              Easily convert your DOCX files into professional PDF documents.
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
                    {isDragActive ? "Drop the file here..." : "Drag & drop a DOCX here, or click to select"}
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
              <div className="space-y-4">
                 <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-accent"/>
                    Conversion Settings
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="page-size">Page Size</Label>
                      <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
                        <SelectTrigger id="page-size"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a4">A4</SelectItem>
                          <SelectItem value="letter">Letter</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="margins">Margins</Label>
                       <Select value={margins} onValueChange={(v) => setMargins(v as MarginSize)}>
                        <SelectTrigger id="margins"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="narrow">Narrow</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="wide">Wide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                 </div>
              </div>
            </Card>

            <div className="pt-4">
              {status === 'idle' && file && (
                 <Button onClick={handleConvert} size="lg" className="w-full">
                    <Wand2 className="mr-2 h-5 w-5" /> Convert to PDF
                </Button>
              )}
              
              {status === 'converting' && (
                <div className="space-y-4 text-center">
                  <Progress value={progress} className="w-full" />
                  <p className="text-muted-foreground animate-pulse">Converting your document...</p>
                </div>
              )}
              
              {status === 'success' && (
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleDownload} size="lg" className="flex-1">
                        <Download className="mr-2 h-5 w-5" /> Download PDF
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
