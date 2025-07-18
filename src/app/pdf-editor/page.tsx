
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, UploadCloud, ZoomIn, ZoomOut, Highlighter, Pencil, MessageSquarePlus, Undo2, Redo2, Download, Eraser, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Setup worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type ToastInfo = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export default function PdfEditorPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    if (toastInfo) {
      toast({ ...toastInfo });
      setToastInfo(null);
    }
  }, [toastInfo, toast]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsLoading(true);
      setPdfDoc(null);
      setNumPages(0);
      canvasRefs.current = [];

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setToastInfo({ title: 'PDF Loaded', description: 'Ready for editing.' });
      } catch (error) {
        console.error("Error loading PDF:", error);
        setToastInfo({ variant: 'destructive', title: 'Error', description: 'Failed to load PDF file.' });
        setFile(null);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const renderPage = useCallback(async (pageNum: number, pdf: pdfjsLib.PDFDocumentProxy, currentZoom: number) => {
    try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: currentZoom });
        const canvas = canvasRefs.current[pageNum - 1];
        if (canvas) {
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            if (context) {
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                await page.render(renderContext).promise;
            }
        }
    } catch (e) {
        console.error(`Failed to render page ${pageNum}`, e);
    }
  }, []);

  useEffect(() => {
    if (pdfDoc) {
      setIsLoading(true);
      const renderAllPages = async () => {
          const pagePromises = [];
          for (let i = 1; i <= numPages; i++) {
              pagePromises.push(renderPage(i, pdfDoc, zoom));
          }
          await Promise.all(pagePromises);
          setIsLoading(false);
      };
      renderAllPages();
    }
  }, [pdfDoc, numPages, zoom, renderPage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  const EditorToolbar = () => (
    <Card className="sticky top-4 z-10 shadow-md">
      <CardContent className="p-2 flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-1">
          <Button asChild variant="outline" size="sm">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>
          <Separator orientation="vertical" className="h-8 mx-2" />
           <Button variant="ghost" size="icon" {...getRootProps()}>
              <input {...getInputProps()} />
              <UploadCloud />
            </Button>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={!pdfDoc}><ZoomOut /></Button></TooltipTrigger><TooltipContent><p>Zoom Out</p></TooltipContent></Tooltip>
            <Button variant="ghost" className="w-20" disabled={!pdfDoc}>{`${Math.round(zoom * 100)}%`}</Button>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={!pdfDoc}><ZoomIn /></Button></TooltipTrigger><TooltipContent><p>Zoom In</p></TooltipContent></Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled={!pdfDoc}><Highlighter /></Button></TooltipTrigger><TooltipContent><p>Highlight</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled={!pdfDoc}><Pencil /></Button></TooltipTrigger><TooltipContent><p>Draw</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled={!pdfDoc}><MessageSquarePlus /></Button></TooltipTrigger><TooltipContent><p>Add Note</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled={!pdfDoc}><Eraser /></Button></TooltipTrigger><TooltipContent><p>Erase</p></TooltipContent></Tooltip>
          </TooltipProvider>
          <Separator orientation="vertical" className="h-8 mx-2" />
           <TooltipProvider>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled={!pdfDoc}><Undo2 /></Button></TooltipTrigger><TooltipContent><p>Undo</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled={!pdfDoc}><Redo2 /></Button></TooltipTrigger><TooltipContent><p>Redo</p></TooltipContent></Tooltip>
          </TooltipProvider>
        </div>
        <Button disabled={!pdfDoc}><Download className="mr-2 h-4 w-4" /> Save & Download</Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-muted min-h-screen flex flex-col">
        <header className="p-4">
            <EditorToolbar />
        </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {!pdfDoc ? (
            <Card className="w-full max-w-3xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
                        <FileText className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        PDF Editor
                    </CardTitle>
                    <CardDescription>Highlight, annotate, and draw directly on your PDFs.</CardDescription>
                </CardHeader>
                <CardContent>
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
                            {isDragActive ? "Drop the file here..." : "Drag & drop a PDF, or click to select"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ) : (
            <div className="w-full max-w-4xl h-[calc(100vh-150px)] overflow-auto bg-background rounded-lg shadow-inner border p-4">
                {isLoading && <div className="text-center">Rendering PDF...</div>}
                <div className={cn('space-y-4', isLoading ? 'hidden' : 'block')}>
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="relative mx-auto" style={{ width: canvasRefs.current[index]?.width }}>
                        <canvas
                            ref={el => {
                                if (el) canvasRefs.current[index] = el;
                            }}
                        />
                    </div>
                ))}
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
