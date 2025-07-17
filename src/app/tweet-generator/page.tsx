
'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowLeft, MessageSquare, Download, Upload, RefreshCw, Calendar as CalendarIcon, Heart, Repeat, MessageCircle, BarChart2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const VerifiedBadge = () => (
  <svg viewBox="0 0 22 22" className="h-[1.25em] w-[1.25em] fill-current text-blue-500">
    <g>
      <path d="M20.396 11c-.018-.646-.21-1.276-.57-1.816-.37-5.408-4.796-9.626-10.202-9.186-2.015.166-3.88.944-5.424 2.22C2.79 3.654 1.486 5.618.905 7.828.024 11.21-2.14 17.618 4.22 21.334c.6.36 1.253.62 1.942.766.33.07.66.104.99.104.5 0 1-.1 1.46-.31.42-.192.823-.466 1.18-.81s.68-.74.912-1.18c1.3-2.583 2.83-5.016 4.336-7.46.15-.246.3-.5.44-.75.336-.576.62-1.18.84-1.783.14-.38.24-.76.3-1.14.008-.042.016-.084.024-.128.016-.08.03-.16.04-.24.02-.12.03-.24.04-.36.01-.06.01-.12.02-.18.01-.08.01-.16.02-.24.004-.03.008-.06.012-.09.01-.08.01-.15.02-.23zm-4.524-2.84l-5.38 5.38-2.805-2.804a.75.75 0 0 0-1.06 1.06l3.334 3.334a.75.75 0 0 0 1.06 0l5.91-5.91a.75.75 0 1 0-1.06-1.06z"></path>
    </g>
  </svg>
);


export default function TweetGenerator() {
  const { toast } = useToast();
  const tweetRef = useRef<HTMLDivElement>(null);
  
  const [username, setUsername] = useState('Dev Basket');
  const [handle, setHandle] = useState('devbasket');
  const [pfp, setPfp] = useState<string>('https://placehold.co/48x48.png');
  const [tweetText, setTweetText] = useState('Just created this awesome Tweet Generator with Dev Basket! 🧺 So easy to make realistic-looking tweet mockups for my projects. #devtool #uidesign');
  const [likes, setLikes] = useState('1.2K');
  const [retweets, setRetweets] = useState('450');
  const [quotes, setQuotes] = useState('88');
  const [isVerified, setIsVerified] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handlePfpUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPfp(e.target?.result as string);
        toast({ title: "Profile picture updated!" });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDownload = useCallback(() => {
    if (tweetRef.current === null) {
      return
    }

    toPng(tweetRef.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'tweet-by-dev-basket.png'
        link.href = dataUrl
        link.click()
        toast({ title: "Tweet image downloading!" });
      })
      .catch((err) => {
        toast({ variant: "destructive", title: "Oops!", description: "Something went wrong while generating the image."})
      })
  }, [tweetRef, toast]);
  
  const resetAll = () => {
    setUsername('Dev Basket');
    setHandle('devbasket');
    setPfp('https://placehold.co/48x48.png');
    setTweetText('Just created this awesome Tweet Generator with Dev Basket! 🧺 So easy to make realistic-looking tweet mockups for my projects. #devtool #uidesign');
    setLikes('1.2K');
    setRetweets('450');
    setQuotes('88');
    setIsVerified(true);
    setDate(new Date());
    toast({ title: "Fields have been reset!" });
  };
  
  const formatNumber = (numStr: string) => {
    // This is a simple formatter, can be expanded
    return numStr;
  }

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
              <MessageSquare className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Tweet Generator
            </CardTitle>
            <CardDescription>
              Create and download realistic tweet mockups for your projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Author</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                         <AvatarImage src={pfp} alt={username} />
                         <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                      </Avatar>
                       <input type="file" id="pfp-upload" className="hidden" accept="image/*" onChange={handlePfpUpload} />
                       <Button asChild variant="outline">
                         <Label htmlFor="pfp-upload" className="cursor-pointer"><Upload className="mr-2 h-4 w-4" /> Upload</Label>
                       </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <Label htmlFor="username">Name</Label>
                         <Input id="username" value={username} onChange={e => setUsername(e.target.value)} />
                       </div>
                       <div>
                         <Label htmlFor="handle">Handle</Label>
                         <Input id="handle" value={handle} onChange={e => setHandle(e.target.value)} placeholder="@handle" />
                       </div>
                    </div>
                     <div className="flex items-center space-x-2 pt-2">
                        <Switch id="verified-switch" checked={isVerified} onCheckedChange={setIsVerified} />
                        <Label htmlFor="verified-switch">Verified Account</Label>
                     </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                     <CardTitle className="text-xl">Content & Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div>
                       <Label htmlFor="tweet-text">Tweet Content</Label>
                       <Textarea id="tweet-text" value={tweetText} onChange={e => setTweetText(e.target.value)} rows={5} />
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="retweets">Retweets</Label>
                          <Input id="retweets" value={retweets} onChange={e => setRetweets(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="quotes">Quotes</Label>
                          <Input id="quotes" value={quotes} onChange={e => setQuotes(e.target.value)} />
                        </div>
                         <div>
                          <Label htmlFor="likes">Likes</Label>
                          <Input id="likes" value={likes} onChange={e => setLikes(e.target.value)} />
                        </div>
                     </div>
                     <div>
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                     </div>
                  </CardContent>
                </Card>
                 <div className="flex flex-wrap gap-2">
                    <Button onClick={onDownload} className="flex-1"><Download className="mr-2 h-4 w-4" /> Download as PNG</Button>
                    <Button onClick={resetAll} variant="outline" className="flex-1"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                 </div>
              </div>

              {/* Preview */}
              <div className="flex flex-col items-center justify-center">
                 <h3 className="text-xl font-semibold mb-4 text-center">Preview</h3>
                <div ref={tweetRef} className="p-6 bg-background dark:bg-black rounded-xl border border-border/60 w-full max-w-lg">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={pfp} alt={username} />
                      <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-foreground">{username}</span>
                        {isVerified && <VerifiedBadge />}
                        <span className="text-muted-foreground ml-1">@{handle}</span>
                         <span className="text-muted-foreground ml-auto">· {date ? format(date, "MMM d") : ""}</span>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap break-words">{tweetText}</p>
                      
                       <div className="text-muted-foreground text-sm mt-3">
                        <span>{date ? format(date, "h:mm a") : ""} · </span>
                        <span>{date ? format(date, "MMM d, yyyy") : ""}</span>
                        <span className="text-foreground font-semibold"> · View post analytics</span>
                       </div>

                      <div className="mt-3 pt-3 border-t border-border/60 flex justify-around text-muted-foreground">
                        <div className="flex items-center gap-2 hover:text-blue-500">
                          <MessageCircle size={18} />
                          <span></span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-green-500">
                          <Repeat size={18} />
                          <span>{formatNumber(retweets)}</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-pink-500">
                           <Heart size={18} />
                          <span>{formatNumber(likes)}</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-blue-500">
                           <BarChart2 size={18} />
                          <span></span>
                        </div>
                         <div className="flex items-center gap-2 hover:text-blue-500">
                           <Upload size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
