
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
import { ArrowLeft, MessagesSquare, Download, Upload, RefreshCw, Trash2, Send, ChevronLeft, Video, Phone, MoreVertical, Search, Check, CheckCheck, Info, Edit, Smile, Mic, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';


type MessageStatus = 'sent' | 'delivered' | 'read';

type Message = {
  id: number;
  text: string;
  sender: 'me' | 'other';
  status?: MessageStatus;
  time: string;
};

type Platform = 'imessage' | 'whatsapp' | 'instagram' | 'telegram';

const IMessageHeader = ({ name, pfp }: { name: string; pfp: string }) => (
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

const WhatsAppHeader = ({ name, pfp, status }: { name: string, pfp: string, status: string }) => (
    <div className="flex items-center justify-between p-2 bg-[#008069] dark:bg-[#202c33] text-white">
        <div className="flex items-center gap-3">
            <ArrowLeft size={22} />
            <Avatar className="h-10 w-10">
                <AvatarImage src={pfp} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="font-semibold">{name}</h3>
                <p className="text-xs text-white/90">{status}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <Video size={22} />
            <Phone size={20} />
            <MoreVertical size={22} />
        </div>
    </div>
);

const InstagramHeader = ({ name, pfp, status }: { name: string; pfp: string, status: string }) => (
  <div className="flex items-center justify-between p-3 border-b border-border/70 bg-white dark:bg-black">
      <div className="flex items-center gap-3">
          <ArrowLeft size={24} />
          <Avatar className="h-10 w-10">
              <AvatarImage src={pfp} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-xs text-muted-foreground">{status}</p>
          </div>
      </div>
      <div className="flex items-center gap-5">
          <Phone size={22} />
          <Video size={24} />
          <Info size={24} />
      </div>
  </div>
);

const TelegramHeader = ({ name, pfp, status }: { name: string; pfp: string, status: string }) => (
  <div className="flex items-center justify-between p-2 bg-[#527da3] dark:bg-[#212d3b] text-white">
      <div className="flex items-center gap-3">
          <ArrowLeft size={22} />
          <Avatar className="h-10 w-10">
              <AvatarImage src={pfp} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-xs text-white/90">{status}</p>
          </div>
      </div>
      <div className="flex items-center gap-4">
          <Phone size={22} />
          <MoreVertical size={22} />
      </div>
  </div>
);


const ReadStatusIcon = ({ status, platform }: { status: Message['status'], platform: Platform }) => {
    if (!status) return null;
    if (platform === 'whatsapp') {
      if (status === 'sent') return <Check size={16} className="text-gray-500 dark:text-gray-400" />;
      if (status === 'delivered') return <CheckCheck size={16} className="text-gray-500 dark:text-gray-400" />;
      if (status === 'read') return <CheckCheck size={16} className="text-[#53bdeb]" />;
    }
    if (platform === 'telegram') {
      if (status === 'sent') return <Check size={16} className="text-white/80" />;
      if (status === 'read') return <CheckCheck size={16} className="text-white/80" />;
    }
    return null;
}

const platforms = {
    imessage: { name: "iMessage", defaultStatus: "FaceTime" },
    whatsapp: { name: "WhatsApp", defaultStatus: "online" },
    instagram: { name: "Instagram", defaultStatus: "Active now" },
    telegram: { name: "Telegram", defaultStatus: "typing..." },
}

type ToastInfo = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export default function ChatGenerator() {
  const { toast } = useToast();
  const chatRef = useRef<HTMLDivElement>(null);
  const [platform, setPlatform] = useState<Platform>('imessage');

  const [receiverName, setReceiverName] = useState('Sarah');
  const [receiverPfp, setReceiverPfp] = useState('https://placehold.co/128x128.png?text=S');
  const [receiverStatus, setReceiverStatus] = useState(platforms.imessage.defaultStatus);
  
  const [senderName, setSenderName] = useState('Me');
  const [senderPfp, setSenderPfp] = useState('https://placehold.co/128x128.png?text=M');

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hey, are you free this weekend?', sender: 'other', time: '10:30 AM', status: 'read' },
    { id: 2, text: 'Yeah, I think so! What do you have in mind?', sender: 'me', time: '10:31 AM', status: 'read' },
    { id: 3, text: 'Fancy a hike? The weather is supposed to be amazing.', sender: 'other', time: '10:31 AM', status: 'read' },
  ]);

  const [newMessage, setNewMessage] = useState('');
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

  const handlePlatformChange = (value: Platform) => {
    setPlatform(value);
    setReceiverStatus(platforms[value].defaultStatus);
  }
  
  const handlePfpUpload = (event: React.ChangeEvent<HTMLInputElement>, user: 'sender' | 'receiver') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if(user === 'sender') setSenderPfp(result);
        else setReceiverPfp(result);
        setToastInfo({ title: "Profile picture updated!" });
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
        link.download = `chat-by-devbasket-${platform}.png`;
        link.href = dataUrl;
        link.click();
        setToastInfo({ title: "Chat image downloading!" });
      })
      .catch((err) => {
        setToastInfo({ variant: "destructive", title: "Oops!", description: "Something went wrong while generating the image."});
      });
  }, [platform]);
  
  const resetAll = () => {
    setPlatform('imessage');
    setReceiverName('Sarah');
    setReceiverPfp('https://placehold.co/128x128.png?text=S');
    setReceiverStatus(platforms.imessage.defaultStatus);
    setSenderName('Me');
    setSenderPfp('https://placehold.co/128x128.png?text=M');
    setMessages([
        { id: 1, text: 'Hey, are you free this weekend?', sender: 'other', time: '10:30 AM', status: 'read' },
        { id: 2, text: 'Yeah, I think so! What do you have in mind?', sender: 'me', time: '10:31 AM', status: 'read' },
        { id: 3, text: 'Fancy a hike? The weather is supposed to be amazing.', sender: 'other', time: '10:31 AM', status: 'read' },
    ]);
    setNewMessage('');
    setToastInfo({ title: "Fields have been reset!" });
  };
  
  const handleAddMessage = (sender: 'me' | 'other') => {
      if(!newMessage.trim()) return;
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([...messages, { id: Date.now(), text: newMessage, sender, time, status: 'sent' }]);
      setNewMessage('');
  };
  
  const deleteMessage = (id: number) => {
      setMessages(messages.filter(msg => msg.id !== id));
  };
  
  const updateMessageStatus = (id: number, status: MessageStatus) => {
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status } : msg));
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

        <Card className="max-w-7xl mx-auto shadow-lg border-border/60 bg-secondary/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <MessagesSquare className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Chat Screenshot Generator
            </CardTitle>
            <CardDescription>
              Create realistic chat mockups for different platforms and download them as an image.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Controls */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="platform-select">Platform</Label>
                             <Select value={platform} onValueChange={(value) => handlePlatformChange(value as Platform)}>
                                <SelectTrigger id="platform-select">
                                    <SelectValue placeholder="Select a platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(platforms).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>{value.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
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
                           {platform !== 'imessage' && (
                              <Input id="receiver-status" value={receiverStatus} onChange={e => setReceiverStatus(e.target.value)} placeholder="Status, last seen, etc." />
                           )}
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
                        <div key={msg.id} className="grid grid-cols-[auto,1fr,auto,auto] items-center gap-2 bg-muted/50 p-2 rounded-md">
                          <span className={`text-xs font-semibold ${msg.sender === 'me' ? 'text-primary' : 'text-accent'}`}>{msg.sender === 'me' ? senderName : receiverName}:</span>
                          <p className="text-sm truncate flex-1">{msg.text}</p>
                          
                           {platform === 'whatsapp' && msg.sender === 'me' && (
                            <Select value={msg.status} onValueChange={(value) => updateMessageStatus(msg.id, value as MessageStatus)}>
                              <SelectTrigger className="h-7 w-[90px] text-xs">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          
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
                         <Button onClick={() => handleAddMessage('me')} className="flex-1">Send as {senderName}</Button>
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
                    <div ref={chatRef} className={cn(
                        "rounded-xl border-8 border-muted dark:border-zinc-800 shadow-2xl",
                         (platform === 'whatsapp' || platform === 'instagram' || platform === 'telegram') && 'border-none'
                        )}>
                        <div className="w-full h-full flex flex-col bg-white dark:bg-black">
                           {platform === 'imessage' && <IMessageHeader name={receiverName} pfp={receiverPfp} />}
                           {platform === 'whatsapp' && <WhatsAppHeader name={receiverName} pfp={receiverPfp} status={receiverStatus} />}
                           {platform === 'instagram' && <InstagramHeader name={receiverName} pfp={receiverPfp} status={receiverStatus} />}
                           {platform === 'telegram' && <TelegramHeader name={receiverName} pfp={receiverPfp} status={receiverStatus} />}
                           
                           <div className={cn("flex-1 p-4 space-y-2 overflow-y-auto",
                            platform === 'imessage' ? 'bg-white dark:bg-black' : 
                            platform === 'whatsapp' ? 'bg-[#E5DDD5] dark:bg-[#0b141a]' : 
                            platform === 'instagram' ? 'bg-white dark:bg-black' :
                            platform === 'telegram' ? 'bg-[#a3bde3] dark:bg-[#18222d]' :
                            'bg-white dark:bg-black'
                           )}>
                             {messages.map((msg, index) => (
                               <div key={msg.id} className={cn('flex flex-col', msg.sender === 'me' ? 'items-end' : 'items-start')}>
                                <div className={cn('flex items-end gap-2', msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                                  {msg.sender === 'other' && (platform === 'imessage' || platform === 'instagram') && (
                                      <Avatar className="h-6 w-6">
                                         <AvatarImage src={receiverPfp} alt={receiverName} />
                                         <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                  )}
                                   <div className={cn(
                                     'max-w-[80%] rounded-2xl px-3 py-1.5 text-base relative',
                                     {
                                         // iMessage styles
                                         'bg-blue-500 text-white rounded-br-lg': platform === 'imessage' && msg.sender === 'me',
                                         'bg-gray-200 dark:bg-zinc-700 text-black dark:text-white rounded-bl-lg': platform === 'imessage' && msg.sender === 'other',
                                         // WhatsApp styles
                                         'bg-[#dcf8c6] dark:bg-[#005c4b] text-black dark:text-white !rounded-tr-none shadow-sm': platform === 'whatsapp' && msg.sender === 'me',
                                         'bg-white dark:bg-[#202c33] text-black dark:text-white !rounded-tl-none shadow-sm': platform === 'whatsapp' && msg.sender === 'other',
                                         // Instagram styles
                                         'bg-[#3797F0] text-white rounded-br-lg': platform === 'instagram' && msg.sender === 'me',
                                         'bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-black dark:text-white rounded-bl-lg': platform === 'instagram' && msg.sender === 'other',
                                         // Telegram styles
                                         'bg-[#e1ffc7] dark:bg-[#344558] text-black dark:text-white !rounded-br-none': platform === 'telegram' && msg.sender === 'me',
                                         'bg-white dark:bg-[#212d3b] text-black dark:text-white !rounded-bl-none': platform === 'telegram' && msg.sender === 'other',
                                     }
                                    )}>
                                     <p className="break-words pr-12">{msg.text}</p>
                                     <span className={cn(
                                         'absolute bottom-1 right-2 text-[10px] flex items-center gap-1',
                                         platform === 'imessage' && 'hidden',
                                         platform === 'instagram' && 'hidden',
                                         platform === 'whatsapp' && msg.sender === 'me' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400',
                                         platform === 'telegram' && msg.sender === 'me' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                                         )}>
                                         {msg.time}
                                         {msg.sender === 'me' && <ReadStatusIcon status={msg.status} platform={platform} />}
                                     </span>
                                  </div>
                                </div>
                                 {platform === 'instagram' && index === messages.length - 1 && (
                                    <p className="text-xs text-muted-foreground mt-1 pr-2">Seen</p>
                                 )}
                               </div>
                             ))}
                           </div>
                           
                           <div className={cn(
                               "p-2 border-t border-border/50 bg-muted/30 dark:bg-zinc-900/50 flex items-center gap-2",
                                (platform === 'whatsapp' || platform === 'instagram' || platform === 'telegram') && 'hidden' // Hide for non-iMessage
                            )}>
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
