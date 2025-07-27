
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PlusCircle, Trash2, User, RefreshCw, Split, ChevronsRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Participant {
  id: number;
  name: string;
  paid: string;
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export default function BillSplitter() {
  const { toast } = useToast();
  const [totalBill, setTotalBill] = useState('120');
  const [tipPercentage, setTipPercentage] = useState('15');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: 'Alex', paid: '60' },
    { id: 2, name: 'Sara', paid: '30' },
    { id: 3, name: 'John', paid: '30' },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const billWithTip = useMemo(() => {
    const bill = parseFloat(totalBill) || 0;
    const tip = parseFloat(tipPercentage) || 0;
    return bill + (bill * (tip / 100));
  }, [totalBill, tipPercentage]);

  const totalPaid = useMemo(() => {
    return participants.reduce((sum, p) => sum + (parseFloat(p.paid) || 0), 0);
  }, [participants]);

  const amountPerPerson = useMemo(() => {
    return participants.length > 0 ? billWithTip / participants.length : 0;
  }, [billWithTip, participants.length]);

  const calculateSplit = () => {
    if (participants.length === 0 || billWithTip <= 0) {
      setTransactions([]);
      return;
    }
    
    if (Math.abs(totalPaid - billWithTip) > 0.01) {
        toast({
            variant: 'destructive',
            title: 'Calculation Mismatch',
            description: `Total paid (${totalPaid.toFixed(2)}) doesn't match the bill with tip (${billWithTip.toFixed(2)}). Please adjust values.`
        });
        setTransactions([]);
        return;
    }

    const balances = participants.map(p => ({
      ...p,
      balance: (parseFloat(p.paid) || 0) - amountPerPerson
    }));

    const debtors = balances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = balances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);

    const newTransactions: Transaction[] = [];

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      const amountToTransfer = Math.min(-debtor.balance, creditor.balance);

      if (amountToTransfer > 0.01) {
        newTransactions.push({
          from: debtor.name,
          to: creditor.name,
          amount: amountToTransfer,
        });

        debtor.balance += amountToTransfer;
        creditor.balance -= amountToTransfer;
      }

      if (Math.abs(debtor.balance) < 0.01) {
        debtorIndex++;
      }
      if (Math.abs(creditor.balance) < 0.01) {
        creditorIndex++;
      }
    }
    setTransactions(newTransactions);
  };
  
  useEffect(() => {
    calculateSplit();
  }, [participants, totalBill, tipPercentage]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { id: Date.now(), name: `Person ${participants.length + 1}`, paid: '0' }]);
  };

  const handleParticipantChange = (id: number, field: 'name' | 'paid', value: string) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleRemoveParticipant = (id: number) => {
    setParticipants(participants.filter(p => p.id !== id));
  };
  
  const handleReset = () => {
    setTotalBill('120');
    setTipPercentage('15');
    setParticipants([
        { id: 1, name: 'Alex', paid: '60' },
        { id: 2, name: 'Sara', paid: '30' },
        { id: 3, name: 'John', paid: '30' },
    ]);
    toast({ title: "Bill Splitter Reset", description: "All fields have been reset to their default values." });
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
        <Card className="max-w-4xl mx-auto shadow-lg border-border/60 bg-secondary/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <Split className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Bill Splitter
            </CardTitle>
            <CardDescription>
              Quickly split group expenses with ease.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Bill Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="total-bill">Total Bill ($)</Label>
                        <Input id="total-bill" type="number" value={totalBill} onChange={e => setTotalBill(e.target.value)} placeholder="e.g., 120" />
                      </div>
                      <div>
                        <Label htmlFor="tip-percentage">Tip (%)</Label>
                        <Input id="tip-percentage" type="number" value={tipPercentage} onChange={e => setTipPercentage(e.target.value)} placeholder="e.g., 15" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl">Participants</CardTitle>
                             <Button onClick={handleAddParticipant} size="sm" variant="ghost"><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        <AnimatePresence>
                        {participants.map((p) => (
                           <motion.div 
                              key={p.id} 
                              className="flex gap-2 items-center"
                              layout
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -300, transition: { duration: 0.3 } }}
                            >
                             <Input value={p.name} onChange={e => handleParticipantChange(p.id, 'name', e.target.value)} placeholder="Participant Name" />
                             <Input type="number" value={p.paid} onChange={e => handleParticipantChange(p.id, 'paid', e.target.value)} placeholder="Amount Paid" className="w-32" />
                             <Button variant="ghost" size="icon" onClick={() => handleRemoveParticipant(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                           </motion.div>
                        ))}
                        </AnimatePresence>
                    </CardContent>
                </Card>
                <Button onClick={handleReset} variant="outline" className="w-full"><RefreshCw className="mr-2 h-4 w-4" /> Reset All</Button>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-xl">Summary</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4 text-center">
                         <div className="p-2 bg-muted rounded-md">
                             <p className="text-sm text-muted-foreground">Total Bill + Tip</p>
                             <p className="text-lg font-bold">${billWithTip.toFixed(2)}</p>
                         </div>
                         <div className="p-2 bg-muted rounded-md">
                             <p className="text-sm text-muted-foreground">Each Owes</p>
                             <p className="text-lg font-bold">${amountPerPerson.toFixed(2)}</p>
                         </div>
                     </div>
                  </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><CardTitle className="text-xl">Who Owes Who</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {transactions.length > 0 ? (
                             <AnimatePresence>
                                {transactions.map((t, i) => (
                                    <motion.div 
                                        key={i} 
                                        className="flex items-center justify-between bg-muted p-3 rounded-lg"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                                    >
                                        <span className="font-semibold">{t.from}</span>
                                        <ChevronsRight className="h-5 w-5 text-primary" />
                                        <span className="font-semibold">{t.to}</span>
                                        <span className="font-bold text-lg">${t.amount.toFixed(2)}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : (
                            <div className="text-center text-muted-foreground p-4">
                                {Math.abs(totalPaid - billWithTip) > 0.01 ? "Total paid doesn't match the bill." : "Everyone is settled up!"}
                            </div>
                        )}
                    </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
