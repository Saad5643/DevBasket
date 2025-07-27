
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PiggyBank, RefreshCw, PlusCircle, Trash2, TrendingUp, AlertCircle, BarChart, DollarSign, Target } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface Expense {
  id: number;
  name: string;
  amount: string;
}

export default function BudgetPlanner() {
  const { toast } = useToast();
  const [income, setIncome] = useState('2000');
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, name: 'Rent', amount: '600' },
    { id: 2, name: 'Food', amount: '300' },
    { id: 3, name: 'Transport', amount: '150' },
    { id: 4, name: 'Subscriptions', amount: '50' },
  ]);
  const [savingsGoal, setSavingsGoal] = useState('400');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalIncome = useMemo(() => parseFloat(income) || 0, [income]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0), [expenses]);
  const totalSavingsGoal = useMemo(() => parseFloat(savingsGoal) || 0, [savingsGoal]);
  const remainingBalance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);
  const isOverBudget = useMemo(() => totalExpenses > totalIncome, [totalExpenses, totalIncome]);
  
  const savingsProgress = useMemo(() => {
    if(totalSavingsGoal <= 0) return 0;
    const potentialSavings = totalIncome - totalExpenses;
    return Math.max(0, Math.min(100, (potentialSavings / totalSavingsGoal) * 100));
  }, [totalIncome, totalExpenses, totalSavingsGoal]);


  const handleAddExpense = () => {
    setExpenses([...expenses, { id: Date.now(), name: 'New Expense', amount: '0' }]);
  };

  const handleExpenseChange = (id: number, field: 'name' | 'amount', value: string) => {
    setExpenses(expenses.map(exp => (exp.id === id ? { ...exp, [field]: value } : exp)));
  };

  const handleRemoveExpense = (id: number) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };
  
  const handleReset = () => {
    setIncome('2000');
    setExpenses([
      { id: 1, name: 'Rent', amount: '600' },
      { id: 2, name: 'Food', amount: '300' },
      { id: 3, name: 'Transport', amount: '150' },
      { id: 4, name: 'Subscriptions', amount: '50' },
    ]);
    setSavingsGoal('400');
    toast({ title: "Budget Planner Reset", description: "All fields have been reset to their default values." });
  };
  
  const chartData = useMemo(() => expenses.map(exp => ({
    name: exp.name,
    Expense: parseFloat(exp.amount) || 0,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
  })), [expenses]);

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
              <PiggyBank className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Smart Budget Planner
            </CardTitle>
            <CardDescription>
              Track your income, manage expenses, and reach your savings goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Financials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="income" className="flex items-center gap-2"><DollarSign className="h-4 w-4" />Total Monthly Income</Label>
                      <Input id="income" type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g., 2000" />
                    </div>
                     <div>
                      <Label htmlFor="savings-goal" className="flex items-center gap-2"><Target className="h-4 w-4" />Monthly Savings Goal</Label>
                      <Input id="savings-goal" type="number" value={savingsGoal} onChange={e => setSavingsGoal(e.target.value)} placeholder="e.g., 400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl">Expenses</CardTitle>
                             <Button onClick={handleAddExpense} size="sm" variant="ghost"><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {expenses.map((expense) => (
                           <div key={expense.id} className="flex gap-2 items-center">
                             <Input value={expense.name} onChange={e => handleExpenseChange(expense.id, 'name', e.target.value)} placeholder="Expense Name" />
                             <Input type="number" value={expense.amount} onChange={e => handleExpenseChange(expense.id, 'amount', e.target.value)} placeholder="Amount" className="w-32" />
                             <Button variant="ghost" size="icon" onClick={() => handleRemoveExpense(expense.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                           </div>
                        ))}
                    </CardContent>
                </Card>
                <Button onClick={handleReset} variant="outline" className="w-full"><RefreshCw className="mr-2 h-4 w-4" /> Reset All</Button>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center">Budget Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center p-4">
                        <CardDescription>Total Income</CardDescription>
                        <CardTitle className="text-2xl text-green-500">${totalIncome.toLocaleString()}</CardTitle>
                    </Card>
                     <Card className="text-center p-4">
                        <CardDescription>Total Expenses</CardDescription>
                        <CardTitle className="text-2xl text-red-500">${totalExpenses.toLocaleString()}</CardTitle>
                    </Card>
                </div>
                 <Card className={cn("text-center p-4", isOverBudget ? "bg-destructive/20" : "bg-green-500/20")}>
                    <CardDescription>Remaining Balance</CardDescription>
                    <CardTitle className={cn("text-4xl", isOverBudget ? "text-destructive" : "text-green-500")}>
                        ${remainingBalance.toLocaleString()}
                    </CardTitle>
                    {isOverBudget && <p className="text-sm text-destructive-foreground mt-1">You've exceeded your income!</p>}
                </Card>
                
                 {totalSavingsGoal > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Savings Goal Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Progress value={savingsProgress} className="h-4" />
                           <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>${(totalIncome - totalExpenses).toLocaleString()} saved</span>
                            <span>Goal: ${totalSavingsGoal.toLocaleString()}</span>
                           </div>
                        </CardContent>
                    </Card>
                 )}
                
                <Card>
                    <CardHeader>
                       <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 w-full">
                      {isClient ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} formatter={(value: number) => `$${value.toLocaleString()}`}/>
                                <Bar dataKey="Expense" background={{ fill: 'hsl(var(--muted))' }} radius={[4, 4, 4, 4]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">Loading chart...</div>
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
