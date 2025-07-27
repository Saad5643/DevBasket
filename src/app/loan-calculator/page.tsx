
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calculator, RefreshCw, Landmark } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AmortizationEntry {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
}

export default function LoanCalculator() {
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = useState('20000');
  const [interestRate, setInterestRate] = useState('8');
  const [loanTenure, setLoanTenure] = useState('5');
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [currency, setCurrency] = useState('$');

  const [result, setResult] = useState<{
    emi: number;
    totalInterest: number;
    totalPayment: number;
    amortizationSchedule: AmortizationEntry[];
  } | null>(null);

  const handleCalculate = () => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const tenure = parseInt(loanTenure, 10);

    if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate <= 0 || isNaN(tenure) || tenure <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter valid numbers for all fields.',
      });
      return;
    }

    const R = annualRate / 12 / 100;
    const N = tenureUnit === 'years' ? tenure * 12 : tenure;

    if (R === 0) {
        const emi = P / N;
        const schedule = [];
        let balance = P;
        for (let i = 1; i <= N; i++) {
            balance -= emi;
            schedule.push({ month: i, principal: emi, interest: 0, totalPayment: emi, remainingBalance: balance });
        }
         setResult({ emi, totalInterest: 0, totalPayment: P, amortizationSchedule: schedule });
        return;
    }
    
    const emi = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    let remainingBalance = P;
    const amortizationSchedule: AmortizationEntry[] = [];
    for (let i = 1; i <= N; i++) {
      const interestPayment = remainingBalance * R;
      const principalPayment = emi - interestPayment;
      remainingBalance -= principalPayment;
      amortizationSchedule.push({
        month: i,
        principal: principalPayment,
        interest: interestPayment,
        totalPayment: emi,
        remainingBalance: Math.max(0, remainingBalance), // Ensure balance doesn't go negative
      });
    }

    setResult({
      emi,
      totalInterest,
      totalPayment,
      amortizationSchedule,
    });
  };
  
  const handleReset = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTenure('');
    setTenureUnit('years');
    setResult(null);
    setCurrency('$');
  };

  const formatCurrency = (value: number) => {
    return `${currency}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const pieChartData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Principal Amount', value: parseFloat(loanAmount), fill: 'hsl(var(--primary))' },
      { name: 'Total Interest', value: result.totalInterest, fill: 'hsl(var(--destructive))' }
    ];
  }, [result, loanAmount]);

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
              <Landmark className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Loan & EMI Calculator
            </CardTitle>
            <CardDescription>
              Calculate your Equated Monthly Installment (EMI) and plan your loan repayment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Controls */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Loan Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currency-symbol">Currency Symbol</Label>
                      <Input id="currency-symbol" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-20" />
                    </div>
                    <div>
                      <Label htmlFor="loan-amount">Loan Amount</Label>
                      <Input id="loan-amount" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="e.g., 20000" />
                    </div>
                    <div>
                      <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
                      <Input id="interest-rate" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="e.g., 8" />
                    </div>
                    <div>
                      <Label>Loan Tenure</Label>
                      <div className="flex gap-2">
                        <Input type="number" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} placeholder="e.g., 5" />
                        <Select value={tenureUnit} onValueChange={(val: 'years' | 'months') => setTenureUnit(val)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="years">Years</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex gap-2">
                  <Button onClick={handleCalculate} size="lg" className="flex-1">Calculate</Button>
                  <Button onClick={handleReset} variant="outline" size="lg" className="flex-1"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                </div>
              </div>

              {/* Results */}
              <div className="lg:col-span-3 space-y-6">
                 <h3 className="text-xl font-semibold mb-4 text-center">Results</h3>
                 {result ? (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             <Card className="text-center p-4">
                                <CardDescription>Monthly EMI</CardDescription>
                                <CardTitle className="text-2xl text-primary">{formatCurrency(result.emi)}</CardTitle>
                            </Card>
                            <Card className="text-center p-4">
                                <CardDescription>Total Interest</CardDescription>
                                <CardTitle className="text-2xl text-destructive">{formatCurrency(result.totalInterest)}</CardTitle>
                            </Card>
                             <Card className="text-center p-4">
                                <CardDescription>Total Payment</CardDescription>
                                <CardTitle className="text-2xl">{formatCurrency(result.totalPayment)}</CardTitle>
                            </Card>
                        </div>
                        
                        <Card>
                            <CardHeader><CardTitle>Loan Breakdown</CardTitle></CardHeader>
                            <CardContent className="h-80 w-full">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} label>
                                             {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                             ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader><CardTitle>Amortization Schedule</CardTitle></CardHeader>
                            <CardContent className="h-96 overflow-y-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Month</TableHead>
                                            <TableHead className="text-right">Principal</TableHead>
                                            <TableHead className="text-right">Interest</TableHead>
                                            <TableHead className="text-right">Balance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {result.amortizationSchedule.map(row => (
                                            <TableRow key={row.month}>
                                                <TableCell>{row.month}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(row.principal)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(row.interest)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(row.remainingBalance)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96 bg-muted/30 rounded-lg">
                        <Calculator className="h-16 w-16 mb-4" />
                        <p>Your loan calculation results will appear here.</p>
                      </div>
                 )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

    