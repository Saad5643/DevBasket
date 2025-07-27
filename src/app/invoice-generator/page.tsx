
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, RefreshCw, Trash2, PlusCircle, Briefcase, Upload, Sun, Moon } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface LineItem {
  id: number;
  description: string;
  quantity: string;
  rate: string;
}

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PKR: 'Rs',
};

export default function InvoiceGenerator() {
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [yourName, setYourName] = useState('Sarah Khan');
  const [yourEmail, setYourEmail] = useState('sarah@designhub.com');
  const [yourAddress, setYourAddress] = useState('123 Creative Lane, Art City');
  const [logo, setLogo] = useState<string | null>(null);

  const [clientName, setClientName] = useState('DevBasket Inc.');
  const [clientEmail, setClientEmail] = useState('contact@devbasket.site');
  const [clientCompany, setClientCompany] = useState('DevBasket');
  const [clientAddress, setClientAddress] = useState('456 Tech Park, Codeville');

  const [invoiceNumber, setInvoiceNumber] = useState('2025-INV-001');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, description: 'UI Design for Landing Page', quantity: '10', rate: '25' },
    { id: 2, description: 'Component Library Setup', quantity: '8', rate: '30' },
  ]);

  const [tax, setTax] = useState('5');
  const [discount, setDiscount] = useState('0');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('Thank you for your business! Payment is due within 14 days.');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const subtotal = lineItems.reduce((acc, item) => acc + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), 0);
  const taxAmount = subtotal * (parseFloat(tax) / 100);
  const discountAmount = subtotal * (parseFloat(discount) / 100);
  const total = subtotal + taxAmount - discountAmount;
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { id: Date.now(), description: '', quantity: '1', rate: '0' }]);
  };

  const removeLineItem = (id: number) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleLineItemChange = (id: number, field: keyof Omit<LineItem, 'id'>, value: string) => {
    setLineItems(lineItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const handleDownloadPdf = async () => {
    const invoiceElement = invoiceRef.current;
    if (!invoiceElement) return;

    toast({ title: 'Generating PDF...', description: 'Please wait a moment.' });
    
    // Temporarily set theme for capture
    const originalTheme = document.documentElement.getAttribute('class');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100)); // allow theme to apply

    html2canvas(invoiceElement, {
      scale: 2,
      backgroundColor: isDarkMode ? '#020817' : '#ffffff',
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoiceNumber}.pdf`);
      
      // Restore original theme
      if(originalTheme) document.documentElement.setAttribute('class', originalTheme);
      else document.documentElement.removeAttribute('class');
      
      toast({ title: 'PDF Downloaded!', description: `Invoice ${invoiceNumber}.pdf has been saved.` });
    });
  };

  const handleReset = () => {
    // Reset all state to initial values
    setYourName('Sarah Khan');
    setYourEmail('sarah@designhub.com');
    setYourAddress('123 Creative Lane, Art City');
    setLogo(null);
    setClientName('DevBasket Inc.');
    setClientEmail('contact@devbasket.site');
    setClientCompany('DevBasket');
    setClientAddress('456 Tech Park, Codeville');
    setInvoiceNumber('2025-INV-001');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setLineItems([
      { id: 1, description: 'UI Design for Landing Page', quantity: '10', rate: '25' },
      { id: 2, description: 'Component Library Setup', quantity: '8', rate: '30' },
    ]);
    setTax('5');
    setDiscount('0');
    setCurrency('USD');
    setNotes('Thank you for your business! Payment is due within 14 days.');
    if(logoInputRef.current) logoInputRef.current.value = '';
    toast({ title: "Form Reset", description: "All fields have been reset to their default values." });
  };


  return (
    <div className="bg-background min-h-screen text-foreground">
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
              <Briefcase className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Freelancer Invoice Generator
            </CardTitle>
            <CardDescription>
              Create, preview, and download professional invoices in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Your Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Button asChild variant="outline"><Label htmlFor="logo-upload" className="cursor-pointer"><Upload className="mr-2" /> Upload Logo</Label></Button>
                    <input type="file" id="logo-upload" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload}/>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><Label htmlFor="your-name">Name</Label><Input id="your-name" value={yourName} onChange={e => setYourName(e.target.value)} /></div>
                      <div><Label htmlFor="your-email">Email</Label><Input id="your-email" type="email" value={yourEmail} onChange={e => setYourEmail(e.target.value)} /></div>
                    </div>
                    <div><Label htmlFor="your-address">Address</Label><Textarea id="your-address" value={yourAddress} onChange={e => setYourAddress(e.target.value)} /></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Client Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><Label htmlFor="client-name">Name</Label><Input id="client-name" value={clientName} onChange={e => setClientName(e.target.value)} /></div>
                      <div><Label htmlFor="client-email">Email</Label><Input id="client-email" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} /></div>
                    </div>
                    <div><Label htmlFor="client-company">Company</Label><Input id="client-company" value={clientCompany} onChange={e => setClientCompany(e.target.value)} /></div>
                    <div><Label htmlFor="client-address">Address</Label><Textarea id="client-address" value={clientAddress} onChange={e => setClientAddress(e.target.value)} /></div>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><Label htmlFor="invoice-no">Invoice #</Label><Input id="invoice-no" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} /></div>
                       <div>
                         <Label htmlFor="currency">Currency</Label>
                         <Select value={currency} onValueChange={setCurrency}>
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>
                             {Object.keys(currencySymbols).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                           </SelectContent>
                         </Select>
                       </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><Label htmlFor="issue-date">Issue Date</Label><Input id="issue-date" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} /></div>
                      <div><Label htmlFor="due-date">Due Date</Label><Input id="due-date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row justify-between items-center"><CardTitle>Line Items</CardTitle><Button size="sm" variant="ghost" onClick={addLineItem}><PlusCircle className="mr-2" /> Add Item</Button></CardHeader>
                  <CardContent className="space-y-4">
                    {lineItems.map(item => (
                      <div key={item.id} className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center">
                        <Input placeholder="Description" value={item.description} onChange={e => handleLineItemChange(item.id, 'description', e.target.value)} />
                        <Input placeholder="Qty" type="number" value={item.quantity} onChange={e => handleLineItemChange(item.id, 'quantity', e.target.value)} className="w-20" />
                        <Input placeholder="Rate" type="number" value={item.rate} onChange={e => handleLineItemChange(item.id, 'rate', e.target.value)} className="w-24" />
                        <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}><Trash2 className="text-destructive h-4 w-4" /></Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader><CardTitle>Totals & Notes</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><Label htmlFor="tax">Tax (%)</Label><Input id="tax" type="number" value={tax} onChange={e => setTax(e.target.value)} /></div>
                      <div><Label htmlFor="discount">Discount (%)</Label><Input id="discount" type="number" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
                    </div>
                    <div><Label htmlFor="notes">Notes/Payment Instructions</Label><Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} /></div>
                  </CardContent>
                </Card>
                <div className="flex gap-2">
                  <Button size="lg" onClick={handleDownloadPdf} className="flex-1"><Download className="mr-2" /> Download PDF</Button>
                  <Button size="lg" variant="outline" onClick={handleReset} className="flex-1"><RefreshCw className="mr-2" /> Reset</Button>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-center">Preview</h3>
                    <Button variant="ghost" onClick={() => setIsDarkMode(!isDarkMode)}>
                      {isDarkMode ? <Sun /> : <Moon />}
                    </Button>
                 </div>
                 <div className="p-2 bg-muted/50 rounded-lg">
                    <Card ref={invoiceRef} className={`${isDarkMode ? 'dark bg-slate-950 text-slate-50' : 'bg-white text-slate-900'} p-8 transition-colors duration-300`}>
                       {/* Header */}
                       <div className="flex justify-between items-start mb-12">
                         <div>
                            {logo ? <Image src={logo} alt="logo" width={100} height={40} className="object-contain" /> : <h1 className="text-3xl font-bold text-primary">Your Brand</h1>}
                            <div className="mt-4 text-sm">
                                <p className="font-semibold">{yourName}</p>
                                <p>{yourEmail}</p>
                                <p>{yourAddress}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <h2 className="text-4xl font-bold uppercase text-muted-foreground">Invoice</h2>
                            <p className="mt-2"># {invoiceNumber}</p>
                         </div>
                       </div>
                       
                       {/* Client & Dates */}
                       <div className="flex justify-between items-start mb-12">
                         <div className="text-sm">
                            <p className="font-semibold text-muted-foreground mb-1">BILL TO</p>
                            <p className="font-bold">{clientCompany}</p>
                            <p>{clientName}</p>
                            <p>{clientEmail}</p>
                            <p>{clientAddress}</p>
                         </div>
                         <div className="text-right text-sm">
                             <div className="mb-2"><p className="font-semibold text-muted-foreground">Issue Date</p><p>{issueDate}</p></div>
                             <div><p className="font-semibold text-muted-foreground">Due Date</p><p>{dueDate}</p></div>
                         </div>
                       </div>
                       
                       {/* Line Items Table */}
                       <table className="w-full text-left mb-12">
                         <thead className="border-b-2 border-primary">
                           <tr>
                             <th className="p-2">Description</th>
                             <th className="p-2 text-right">Qty/Hrs</th>
                             <th className="p-2 text-right">Rate</th>
                             <th className="p-2 text-right">Total</th>
                           </tr>
                         </thead>
                         <tbody>
                            {lineItems.map(item => (
                               <tr key={item.id} className="border-b">
                                 <td className="p-2">{item.description}</td>
                                 <td className="p-2 text-right">{item.quantity}</td>
                                 <td className="p-2 text-right">{currencySymbols[currency] || '$'}{parseFloat(item.rate).toFixed(2)}</td>
                                 <td className="p-2 text-right">{currencySymbols[currency] || '$'}{(parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2)}</td>
                               </tr>
                            ))}
                         </tbody>
                       </table>

                       {/* Totals */}
                       <div className="flex justify-end mb-12">
                          <div className="w-full max-w-xs space-y-2 text-sm">
                            <div className="flex justify-between"><p className="text-muted-foreground">Subtotal</p><p>{currencySymbols[currency] || '$'}{subtotal.toFixed(2)}</p></div>
                            <div className="flex justify-between"><p className="text-muted-foreground">Tax ({tax}%)</p><p>{currencySymbols[currency] || '$'}{taxAmount.toFixed(2)}</p></div>
                            <div className="flex justify-between"><p className="text-muted-foreground">Discount ({discount}%)</p><p>-{currencySymbols[currency] || '$'}{discountAmount.toFixed(2)}</p></div>
                            <div className="border-t-2 my-2 border-primary"></div>
                            <div className="flex justify-between font-bold text-lg"><p>Total</p><p>{currencySymbols[currency] || '$'}{total.toFixed(2)}</p></div>
                          </div>
                       </div>
                       
                       {/* Notes */}
                       <div className="text-sm text-muted-foreground">
                         <p className="font-bold mb-1">Notes</p>
                         <p>{notes}</p>
                       </div>
                    </Card>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
