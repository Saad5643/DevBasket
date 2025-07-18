
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Video, Film, Type, Sprout, Wand2, Download, Play, Music, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const KineticAnimation = ({ text, color, font }: { text: string; color: string; font: string }) => {
    const words = text.split(' ');

    return (
        <div className="w-full h-full flex items-center justify-center p-4" style={{ fontFamily: font }}>
            <p className="text-4xl font-bold text-center" style={{ color: color }}>
                {words.map((word, index) => (
                    <span key={index} className="inline-block animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                        {word}&nbsp;
                    </span>
                ))}
            </p>
        </div>
    );
};

export default function VideoGeneratorPage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('kinetic');
    
    // Kinetic Typography State
    const [kineticText, setKineticText] = useState('Create amazing videos with AI.');
    const [kineticColor, setKineticColor] = useState('#FFFFFF');
    const [kineticFont, setKineticFont] = useState('Inter');
    const [kineticPreview, setKineticPreview] = useState(false);

    // This is needed to re-trigger animations
    useEffect(() => {
        if (kineticPreview) {
            const timer = setTimeout(() => setKineticPreview(false), 500);
            return () => clearTimeout(timer);
        }
    }, [kineticPreview]);

    const handleGenerate = (type: string) => {
        if (type === 'kinetic') {
            if (!kineticText.trim()) {
                toast({ variant: 'destructive', title: 'Text is empty' });
                return;
            }
            setKineticPreview(true);
        } else {
             toast({
                title: "Coming Soon!",
                description: `The ${type} video generator is under construction.`,
            });
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

                <Card className="max-w-7xl mx-auto shadow-lg border-border/60">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
                            <Video className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            AI Video Generator
                        </CardTitle>
                        <CardDescription>
                            Create professional videos from text, images, or AI avatars.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 h-auto">
                                <TabsTrigger value="kinetic" className="flex-col h-auto py-2 gap-1"><Type /> Kinetic Text</TabsTrigger>
                                <TabsTrigger value="slideshow" className="flex-col h-auto py-2 gap-1"><Film /> Slideshow</TabsTrigger>
                                <TabsTrigger value="avatar" className="flex-col h-auto py-2 gap-1"><Sprout /> AI Avatar</TabsTrigger>
                                <TabsTrigger value="voice" className="flex-col h-auto py-2 gap-1"><Wand2 /> Voiceover</TabsTrigger>
                            </TabsList>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Controls Panel */}
                                <div className="md:col-span-1 space-y-6">
                                     <TabsContent value="kinetic">
                                        <Card>
                                            <CardHeader><CardTitle>Kinetic Text Settings</CardTitle></CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <Label htmlFor="kinetic-text">Text</Label>
                                                    <Textarea id="kinetic-text" value={kineticText} onChange={e => setKineticText(e.target.value)} rows={4} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="kinetic-color">Text Color</Label>
                                                        <Input id="kinetic-color" type="color" value={kineticColor} onChange={e => setKineticColor(e.target.value)} className="p-1 h-10"/>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="kinetic-font">Font</Label>
                                                        <Select value={kineticFont} onValueChange={setKineticFont}>
                                                            <SelectTrigger id="kinetic-font"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Inter">Inter</SelectItem>
                                                                <SelectItem value="Poppins">Poppins</SelectItem>
                                                                <SelectItem value="Roboto">Roboto</SelectItem>
                                                                <SelectItem value="Montserrat">Montserrat</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                     <TabsContent value="slideshow">
                                        <Card>
                                            <CardHeader><CardTitle>Slideshow Settings</CardTitle></CardHeader>
                                            <CardContent className="text-center text-muted-foreground">
                                                <p>Slideshow generator coming soon!</p>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                     <TabsContent value="avatar">
                                        <Card>
                                            <CardHeader><CardTitle>AI Avatar Settings</CardTitle></CardHeader>
                                            <CardContent className="text-center text-muted-foreground">
                                                <p>AI Avatar generator coming soon!</p>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                     <TabsContent value="voice">
                                        <Card>
                                            <CardHeader><CardTitle>Voiceover Video Settings</CardTitle></CardHeader>
                                            <CardContent className="text-center text-muted-foreground">
                                                <p>Voiceover video generator coming soon!</p>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    
                                    <Card>
                                        <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label htmlFor="orientation">Orientation</Label>
                                                <Select defaultValue="vertical">
                                                    <SelectTrigger id="orientation"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="vertical">Vertical (9:16)</SelectItem>
                                                        <SelectItem value="square">Square (1:1)</SelectItem>
                                                        <SelectItem value="horizontal">Horizontal (16:9)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                 <Button variant="outline" className="w-full justify-start"><Music className="mr-2"/> Add Background Music</Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Button onClick={() => handleGenerate(activeTab)} size="lg" className="w-full">
                                        <Play className="mr-2"/> Generate Video
                                    </Button>
                                </div>

                                {/* Preview Panel */}
                                <div className="md:col-span-2">
                                     <h3 className="text-xl font-semibold mb-4 text-center">Preview</h3>
                                     <Card className={cn(
                                        "w-full bg-gray-900 aspect-video flex items-center justify-center shadow-inner",
                                        activeTab === 'kinetic' && 'aspect-[9/16] max-w-sm mx-auto'
                                     )}>
                                         {activeTab === 'kinetic' && kineticPreview && (
                                            <KineticAnimation text={kineticText} color={kineticColor} font={kineticFont} />
                                         )}
                                          {activeTab === 'kinetic' && !kineticPreview && (
                                            <p className="text-muted-foreground">Preview will appear here</p>
                                         )}
                                         {activeTab !== 'kinetic' && (
                                              <div className="text-center text-muted-foreground">
                                                <Video className="h-16 w-16 mx-auto mb-4" />
                                                <p>Video preview for {activeTab} will appear here.</p>
                                            </div>
                                         )}
                                     </Card>
                                     <div className="flex justify-center mt-4">
                                         <Button variant="outline" disabled={activeTab === 'kinetic' && !kineticPreview}>
                                             <Download className="mr-2"/> Download MP4
                                         </Button>
                                     </div>
                                </div>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
