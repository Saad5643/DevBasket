
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Mail, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const email = 'devbasketofficial@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: 'Email Copied!',
      description: `${email} has been copied to your clipboard.`,
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
            <Button asChild variant="outline" size="sm">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg border-border/60 bg-secondary/30 backdrop-blur-sm">
            <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
                    <Mail className="h-8 w-8" />
                </div>
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Get in Touch
                </CardTitle>
                <CardDescription>
                    Have questions or feedback? We'd love to hear from you.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
               <p className="text-lg text-muted-foreground">
                 For support, inquiries, or suggestions, please email us at:
               </p>
               <div className="p-4 bg-muted/50 rounded-lg font-mono text-lg">
                {email}
               </div>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleCopy} variant="outline" size="lg">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Email
                  </Button>
                  <Button asChild size="lg">
                    <a href={`mailto:${email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </a>
                  </Button>
               </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
