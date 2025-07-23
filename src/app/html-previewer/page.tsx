
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Code, Copy, Trash2, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const initialHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: #333;
            padding: 1rem;
        }
        h1 {
            color: #007BFF;
        }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a live preview of your HTML code.</p>
</body>
</html>
`;

export default function HtmlPreviewer() {
  const { toast } = useToast();
  const [htmlCode, setHtmlCode] = useState<string>(initialHtml);
  const [previewSrcDoc, setPreviewSrcDoc] = useState<string>('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPreviewSrcDoc(htmlCode);
    }, 300); // Debounce updates for better performance

    return () => clearTimeout(timeout);
  }, [htmlCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    toast({ title: 'HTML code copied to clipboard!' });
  };

  const handleClear = () => {
    setHtmlCode('');
    toast({ title: 'Code cleared.' });
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

        <Card className="max-w-full mx-auto shadow-lg border-border/60">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <Code className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Real-time HTML Previewer
            </CardTitle>
            <CardDescription>
              Write HTML code on the left and see it rendered live on the right.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[70vh]">
              {/* Editor */}
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">HTML Code</h3>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                            <Copy className="mr-2 h-4 w-4" /> Copy
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleClear}>
                            <Trash2 className="mr-2 h-4 w-4" /> Clear
                        </Button>
                    </div>
                </div>
                <Textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="Enter your HTML code here..."
                  className="w-full flex-1 font-mono text-sm"
                  spellCheck="false"
                />
              </div>

              {/* Preview */}
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                <Card className="flex-1 w-full h-full border-dashed">
                    <iframe
                        srcDoc={previewSrcDoc}
                        title="HTML Preview"
                        sandbox="allow-same-origin" // Security: blocks scripts
                        className="w-full h-full bg-white rounded-md"
                    />
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
