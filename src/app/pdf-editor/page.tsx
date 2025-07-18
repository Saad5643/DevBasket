
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, UploadCloud, ZoomIn, ZoomOut, Highlighter, Pencil, MessageSquarePlus, Undo2, Redo2, Download, Eraser, FileText, Palette, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

// Setup worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type ToastInfo = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

type Annotation = {
  type: 'draw';
  paths: { x: number; y: number }[][];
  color: string;
  lineWidth: number;
};

type Tool = 'pencil' | 'highlight' | 'note' | 'eraser' | null;

export default function PdfEditorPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1.5);
  const [isLoading, setIsLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const annotationCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  // Editing state
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#EF4444'); // red-500
  const [brushSize, setBrushSize] = useState(2);
  const [annotations, setAnnotations] = useState<Annotation[][]>([]);

  useEffect(() => {
    if (toastInfo) {
      toast({ ...toastInfo });
      setToastInfo(null);
    }
  }, [toastInfo, toast]);
  
  const resetState = () => {
    setFile(null);
    setPdfDoc(null);
    setNumPages(0);
    canvasRefs.current = [];
    annotationCanvasRefs.current = [];
    setAnnotations([]);
    setActiveTool(null);
    setIsLoading(false);
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      resetState();
      setFile(selectedFile);
      setIsLoading(true);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setAnnotations(Array.from({ length: pdf.numPages }, () => []));
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
        const annotationCanvas = annotationCanvasRefs.current[pageNum - 1];
        
        if (canvas && annotationCanvas) {
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            annotationCanvas.height = viewport.height;
            annotationCanvas.width = viewport.width;

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
  
  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>, pageIndex: number) => {
    const canvas = annotationCanvasRefs.current[pageIndex];
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>, pageIndex: number) => {
    if (!activeTool) return;
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e, pageIndex);
    if (!coords) return;
    
    setAnnotations(prev => {
      const newAnnotations = [...prev];
      if (!newAnnotations[pageIndex]) newAnnotations[pageIndex] = [];
      newAnnotations[pageIndex].push({
        type: 'draw',
        paths: [[coords]],
        color: brushColor,
        lineWidth: brushSize,
      });
      return newAnnotations;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>, pageIndex: number) => {
    if (!isDrawing || !activeTool) return;
    const coords = getCanvasCoordinates(e, pageIndex);
    if (!coords) return;
    
    setAnnotations(prev => {
        const newAnnotations = [...prev];
        const currentPageAnnotations = newAnnotations[pageIndex];
        const lastAnnotation = currentPageAnnotations[currentPageAnnotations.length - 1];
        if(lastAnnotation && lastAnnotation.type === 'draw') {
            const lastPath = lastAnnotation.paths[lastAnnotation.paths.length - 1];
            lastPath.push(coords);
            redrawAnnotations(pageIndex);
        }
        return newAnnotations;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const redrawAnnotations = (pageIndex: number) => {
    const canvas = annotationCanvasRefs.current[pageIndex];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const pageAnnotations = annotations[pageIndex];
    if (!pageAnnotations) return;
    
    pageAnnotations.forEach(annotation => {
      if (annotation.type === 'draw') {
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = annotation.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        annotation.paths.forEach(path => {
          if (path.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
          }
          ctx.stroke();
        });
      }
    });
  };

  const handleDownload = async () => {
    if (!pdfDoc) {
      setToastInfo({ variant: "destructive", title: "No PDF loaded"});
      return;
    }

    setToastInfo({ title: "Preparing Download", description: "This might take a moment..."});
    
    try {
       const { PDFDocument } = await import('pdf-lib');
       const pdfBytes = await pdfDoc.getData();
       const newPdfDoc = await PDFDocument.load(pdfBytes);
       const pages = newPdfDoc.getPages();

       for(let i = 0; i < pages.length; i++) {
         const page = pages[i];
         const annotationCanvas = annotationCanvasRefs.current[i];
         if(annotationCanvas) {
            const pngImageBytes = await fetch(annotationCanvas.toDataURL("image/png")).then(res => res.arrayBuffer());
            const pngImage = await newPdfDoc.embedPng(pngImageBytes);
            page.drawImage(pngImage, {
              x: 0,
              y: 0,
              width: page.getWidth(),
              height: page.getHeight(),
            });
         }
       }
       
       const pdfResultBytes = await newPdfDoc.save();
       const blob = new Blob([pdfResultBytes], { type: 'application/pdf' });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = file?.name.replace('.pdf', '-edited.pdf') || 'edited.pdf';
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
       setToastInfo({ title: "Download started!"});
    } catch(e) {
      console.error("Failed to save and download", e);
      setToastInfo({ variant: "destructive", title: "Download Failed", description: "There was an error saving your PDF."});
    }
  };


  const EditorToolbar = () => (
    <Card className="sticky top-4 z-10 shadow-md">
      <CardContent className="p-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <Button asChild variant="outline" size="sm">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>
          <Separator orientation="vertical" className="h-8 mx-2" />
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <UploadCloud />
                  </Button>
               </TooltipTrigger>
               <TooltipContent><p>Upload new PDF</p></TooltipContent>
             </Tooltip>
           </TooltipProvider>
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
            <Tooltip><TooltipTrigger asChild><Button variant={activeTool === 'highlight' ? 'secondary' : 'ghost'} size="icon" disabled><Highlighter /></Button></TooltipTrigger><TooltipContent><p>Highlight (coming soon)</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant={activeTool === 'pencil' ? 'secondary' : 'ghost'} size="icon" disabled={!pdfDoc} onClick={() => setActiveTool(activeTool === 'pencil' ? null : 'pencil')}><Pencil /></Button></TooltipTrigger><TooltipContent><p>Draw</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant={activeTool === 'note' ? 'secondary' : 'ghost'} size="icon" disabled><MessageSquarePlus /></Button></TooltipTrigger><TooltipContent><p>Add Note (coming soon)</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant={activeTool === 'eraser' ? 'secondary' : 'ghost'} size="icon" disabled><Eraser /></Button></TooltipTrigger><TooltipContent><p>Erase (coming soon)</p></TooltipContent></Tooltip>
          </TooltipProvider>
          <Separator orientation="vertical" className="h-8 mx-2" />
           <TooltipProvider>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled><Undo2 /></Button></TooltipTrigger><TooltipContent><p>Undo (coming soon)</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled><Redo2 /></Button></TooltipTrigger><TooltipContent><p>Redo (coming soon)</p></TooltipContent></Tooltip>
          </TooltipProvider>
        </div>
        <Button onClick={handleDownload} disabled={!pdfDoc}><Download className="mr-2 h-4 w-4" /> Save & Download</Button>
      </CardContent>
      {activeTool === 'pencil' && (
        <CardContent className="p-2 border-t flex items-center justify-center gap-4">
            <Label>Brush:</Label>
            <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-8 h-8 p-1 border rounded-md" />
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setBrushSize(s => Math.max(1, s - 1))}><Minus className="h-4 w-4"/></Button>
                <span className="w-6 text-center">{brushSize}</span>
                <Button variant="ghost" size="icon" onClick={() => setBrushSize(s => Math.min(20, s + 1))}><Plus className="h-4 w-4"/></Button>
             </div>
        </CardContent>
      )}
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
            <div className="w-full h-[calc(100vh-160px)] overflow-auto bg-background rounded-lg shadow-inner border p-4">
                {isLoading && <div className="text-center">Rendering PDF...</div>}
                <div className={cn('space-y-4', isLoading ? 'hidden' : 'block')}>
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="relative mx-auto" style={{ width: canvasRefs.current[index]?.width }}>
                        <canvas
                            ref={el => { if (el) canvasRefs.current[index] = el; }}
                        />
                         <canvas
                            ref={el => { if (el) annotationCanvasRefs.current[index] = el; }}
                            className="absolute top-0 left-0"
                            onMouseDown={(e) => handleMouseDown(e, index)}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
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

    