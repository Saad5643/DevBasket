
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessagesSquare, Download, Upload, RefreshCw, Trash2, Send, ChevronLeft, Video, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

type Message = {
  id: number;
  text: string;
  sender: 'me' | 'other';
};

const TopBar = () => (
  <div className="w-full h-6 bg-muted dark:bg-zinc-800 rounded-t-lg flex items-center px-2">
    <div className="flex gap-1">
      <div className="w-3 h-3 rounded-full bg-red-500"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
  </div>
);

const ChatHeader = ({ name, pfp }: { name: string; pfp: string }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-muted/50 dark:bg-zinc-800/50 border-b border-border/50">
     <Avatar className="h-16 w-16 mb-2">
        <AvatarImage src={pfp} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <h3 className="font-semibold text-lg">{name}</h3>
    <p className="text-sm text-blue-500">FaceTime</p>
    <div className="flex gap-8 mt-3">
        <Button variant="ghost" size="icon" className="h-auto flex-col gap-1 text-blue-500">
            <div className="bg-white/20 dark:bg-white/10 p-2 rounded-full"><Phone size={20}/></div>
            <span className="text-xs">audio</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-auto flex-col gap-1 text-blue-500">
            <div className="bg-white/20 dark:bg-white/10 p-2 rounded-full"><Video size={20}/></div>
            <span className="text-xs">video</span>
        </Button>
    </div>
  </div>
);

export default function ChatGenerator() {
  const { toast } = useToast();
  const chatRef = useRef<HTMLDivElement>(null);

  const [receiverName, setReceiverName] = useState('Sarah');
  const [receiverPfp, setReceiverPfp] = useState('https://placehold.co/128x128/E0E0E0/7F7F7F.png?text=S');
  
  const [senderName, setSenderName] = useState('Me');
  const [senderPfp, setSenderPfp] = useState('https://placehold.co/128x128/A0E0A0/7F7F7F.png?text=M');

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hey, are you free this weekend?', sender: 'other' },
    { id: 2, text: 'Yeah, I think so! What do you have in mind?', sender: 'me' },
    { id: 3, text: 'Fancy a hike? The weather is supposed to be amazing.', sender: 'other' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  
  const handlePfpUpload = (event: React.ChangeEvent<HTMLInputElement>, user: 'sender' | 'receiver') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if(user === 'sender') setSenderPfp(result);
        else setReceiverPfp(result);
        toast({ title: "Profile picture updated!" });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDownload = useCallback(() => {
    if (chatRef.current === null) {
      return
    }

    toPng(chatRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'chat-by-dev-basket.png';
        link.href = dataUrl;
        link.click();
        toast({ title: "Chat image downloading!" });
      })
      .catch((err) => {
        toast({ variant: "destructive", title: "Oops!", description: "Something went wrong while generating the image."});
      });
  }, [chatRef, toast]);
  
  const resetAll = () => {
    setReceiverName('Sarah');
    setReceiverPfp('https://placehold.co/128x128/E0E0E0/7F7F7F.png?text=S');
    setSenderName('Me');
    setSenderPfp('https://placehold.co/128x128/A0E0A0/7F7F7F.png?text=M');
    setMessages([
        { id: 1, text: 'Hey, are you free this weekend?', sender: 'other' },
        { id: 2, text: 'Yeah, I think so! What do you have in mind?', sender: 'me' },
        { id: 3, text: 'Fancy a hike? The weather is supposed to be amazing.', sender: 'other' },
    ]);
    setNewMessage('');
    toast({ title: "Fields have been reset!" });
  };
  
  const handleAddMessage = (sender: 'me' | 'other') => {
      if(!newMessage.trim()) return;
      setMessages([...messages, { id: Date.now(), text: newMessage, sender }]);
      setNewMessage('');
  };
  
  const deleteMessage = (id: number) => {
      setMessages(messages.filter(msg => msg.id !== id));
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
              <MessagesSquare className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Chat Screenshot Generator
            </CardTitle>
            <CardDescription>
              Create realistic iMessage-style chat mockups and download them as an image.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Controls */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Participants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Receiver */}
                        <div className="space-y-2">
                           <Label className="font-semibold">Receiver</Label>
                           <div className="flex items-center gap-4">
                             <Avatar className="h-12 w-12">
                                <AvatarImage src={receiverPfp} alt={receiverName} />
                                <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <input type="file" id="receiver-pfp-upload" className="hidden" accept="image/*" onChange={(e) => handlePfpUpload(e, 'receiver')} />
                             <Button asChild variant="outline" size="sm">
                                <Label htmlFor="receiver-pfp-upload" className="cursor-pointer">Upload</Label>
                             </Button>
                           </div>
                           <Input id="receiver-name" value={receiverName} onChange={e => setReceiverName(e.target.value)} placeholder="Receiver's Name" />
                        </div>
                        <Separator />
                        {/* Sender */}
                         <div className="space-y-2">
                           <Label className="font-semibold">Sender (You)</Label>
                            <div className="flex items-center gap-4">
                             <Avatar className="h-12 w-12">
                                <AvatarImage src={senderPfp} alt={senderName} />
                                <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <input type="file" id="sender-pfp-upload" className="hidden" accept="image/*" onChange={(e) => handlePfpUpload(e, 'sender')} />
                             <Button asChild variant="outline" size="sm">
                                <Label htmlFor="sender-pfp-upload" className="cursor-pointer">Upload</Label>
                             </Button>
                           </div>
                           <Input id="sender-name" value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your Name" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                     <CardTitle className="text-xl">Messages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                      {messages.map(msg => (
                        <div key={msg.id} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <span className={`text-xs font-semibold ${msg.sender === 'me' ? 'text-primary' : 'text-accent'}`}>{msg.sender === 'me' ? senderName : receiverName}:</span>
                          <p className="text-sm truncate flex-1">{msg.text}</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteMessage(msg.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                     <div className="space-y-2">
                       <Label htmlFor="new-message">New Message</Label>
                       <Textarea id="new-message" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your message..." />
                       <div className="flex gap-2">
                         <Button onClick={() => handleAddMessage('me')} className="flex-1">Send as Me</Button>
                         <Button onClick={() => handleAddMessage('other')} variant="secondary" className="flex-1">Send as {receiverName}</Button>
                       </div>
                     </div>
                  </CardContent>
                </Card>
                 <div className="flex flex-wrap gap-2">
                    <Button onClick={onDownload} className="flex-1"><Download className="mr-2 h-4 w-4" /> Download PNG</Button>
                    <Button onClick={resetAll} variant="outline" className="flex-1"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                 </div>
              </div>

              {/* Preview */}
              <div className="lg:col-span-2 flex flex-col items-center justify-start">
                 <h3 className="text-xl font-semibold mb-4 text-center">Preview</h3>
                <div className="w-full max-w-md">
                    <div ref={chatRef} className="bg-background dark:bg-black rounded-xl border-8 border-muted dark:border-zinc-800 shadow-2xl">
                        <div className="w-full h-full flex flex-col">
                           {/*<TopBar />*/}
                           <ChatHeader name={receiverName} pfp={receiverPfp} />
                           <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-white dark:bg-black">
                             {messages.map((msg, index) => (
                               <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                 {msg.sender === 'other' && (
                                     <Avatar className="h-6 w-6">
                                        <AvatarImage src={receiverPfp} alt={receiverName} />
                                        <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
                                     </Avatar>
                                 )}
                                  <div className={`max-w-xs md:max-w-md rounded-2xl px-3 py-2 text-white ${msg.sender === 'me' ? 'bg-blue-500 rounded-br-lg' : 'bg-gray-500 dark:bg-zinc-700 rounded-bl-lg'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                 </div>
                               </div>
                             ))}
                           </div>
                           <div className="p-2 border-t border-border/50 bg-muted/30 dark:bg-zinc-900/50 flex items-center gap-2">
                                <div className="flex-1 h-9 bg-gray-200 dark:bg-zinc-700 rounded-full px-4 text-muted-foreground text-sm flex items-center">iMessage</div>
                                <Send className="text-blue-500" />
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
