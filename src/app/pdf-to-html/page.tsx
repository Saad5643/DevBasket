
'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Code, UploadCloud, FileText, Download, RefreshCw, XCircle, Copy, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

type ConversionStatus = 'idle' | 'processing' | 'success' | 'error';

type ToastInfo = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export default function PdfToHtmlConverter() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [htmlContent, setHtmlContent] = useState('');
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
    let fullHtml = '';

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Simple heuristic to group text items into paragraphs
        let lines: { text: string; y: number }[] = [];
        textContent.items.forEach((item: any) => {
          lines.push({ text: item.str, y: item.transform[5] });
        });

        lines.sort((a, b) => b.y - a.y); // Sort by vertical position

        let pageHtml = '';
        let currentY = -1;
        let lineBuffer = '';

        lines.forEach((line, j) => {
          if (currentY !== -1 && Math.abs(currentY - line.y) > 20) { // New paragraph threshold
            pageHtml += `<p>${lineBuffer.trim()}</p>\n`;
            lineBuffer = '';
          }
          lineBuffer += line.text + ' ';
          currentY = line.y;
        });
        if (lineBuffer) {
           pageHtml += `<p>${lineBuffer.trim()}</p>\n`;
        }

        fullHtml += `<section data-page-number="${i}">\n${pageHtml}</section>\n\n`;
        setProgress(Math.round((i / numPages) * 100));
      }

      const finalHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${file.name.replace('.pdf', '')}</title>\n  <style>body { font-family: sans-serif; line-height: 1.6; } section { border-bottom: 1px solid #ccc; padding-bottom: 1rem; margin-bottom: 1rem; }</style>\n</head>\n<body>\n${fullHtml}</body>\n</html>`;
      
      setHtmlContent(finalHtml);
      setStatus('success');
      setToastInfo({ title: 'Conversion Successful!', description: `Converted ${numPages} pages to HTML.` });

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
    setHtmlContent('');
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setToastInfo({ title: 'HTML Copied!', description: 'The HTML code has been copied to your clipboard.' });
  };
  
  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace('.pdf', '') || 'converted'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

        <Card className="max-w-6xl mx-auto shadow-lg border-border/60">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <Code className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              PDF to HTML Converter
            </CardTitle>
            <CardDescription>
              Extract text and layout from your PDF into a structured HTML document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel: Upload and Controls */}
              <div className="space-y-6">
                <div
                  {...getRootProps()}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    isDragActive ? 'border-primary bg-primary/10' : 'border-border bg-muted/50 hover:bg-muted'
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-semibold">Drag & drop a PDF here, or click to select</p>
                    <p className="text-sm text-muted-foreground">Max file size: {MAX_SIZE_MB}MB</p>
                  </div>
                </div>

                {file && (
                   <Card className="p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <FileText className="h-10 w-10 text-primary" />
                            <div>
                                <p className="font-semibold truncate max-w-xs">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{fileSize}</p>
                            </div>
                        </div>
                         <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleReset(); }} disabled={status === 'processing'}>
                            <XCircle className="h-6 w-6 text-destructive" />
                        </Button>
                    </div>
                </Card>
                )}

                {status === 'processing' && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-center text-sm text-muted-foreground animate-pulse">Converting... {progress}%</p>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <Button onClick={handleConvert} size="lg" className="w-full" disabled={!file || status === 'processing'}>
                     {status === 'processing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null }
                    Convert to HTML
                  </Button>
                   <Button onClick={handleReset} variant="outline" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
              </div>

              {/* Right Panel: Output */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Output</h3>
                 {status === 'success' ? (
                   <div className="flex gap-2">
                     <Button onClick={handleCopy} variant="outline"><Copy className="mr-2 h-4 w-4"/> Copy HTML</Button>
                     <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4"/> Download .html</Button>
                   </div>
                 ) : null}

                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview" disabled={status !== 'success'}>Rendered Preview</TabsTrigger>
                    <TabsTrigger value="raw" disabled={status !== 'success'}>Raw HTML</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview">
                    <Card className="h-96 overflow-y-auto">
                      <CardContent className="p-4">
                        {status === 'success' ? (
                          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>HTML preview will appear here.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="raw">
                     <Textarea
                        value={htmlContent}
                        readOnly
                        placeholder="Raw HTML code will appear here."
                        className="w-full h-96 text-xs font-mono"
                      />
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
