
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calculator, RefreshCw, Sparkles, Loader2, Globe } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculateTax, CalculateTaxInput, CalculateTaxOutput } from '@/ai/flows/tax-calculator-flow';

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Pakistan",
  "India", "Germany", "France", "Spain", "Italy",
  "Netherlands", "Sweden", "Japan", "Brazil", "South Africa"
];

const filingStatuses: { [key: string]: string[] } = {
  "United States": ["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household"],
  "Canada": ["Single", "Married / Common-law"],
  "Germany": ["Single (Class 1)", "Married (Class 3/5 or 4/4)"],
};

export default function TaxCalculator() {
  const { toast } = useToast();
  const [country, setCountry] = useState('United States');
  const [income, setIncome] = useState('60000');
  const [filingStatus, setFilingStatus] = useState<string | undefined>(filingStatuses["United States"][0]);
  const [taxYear, setTaxYear] = useState(new Date().getFullYear().toString());

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CalculateTaxOutput | null>(null);

  useEffect(() => {
    // Reset filing status when country changes
    setFilingStatus(filingStatuses[country] ? filingStatuses[country][0] : undefined);
  }, [country]);

  const handleCalculate = async () => {
    const incomeNum = parseFloat(income);
    if (isNaN(incomeNum) || incomeNum <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Input', description: 'Please enter a valid gross income.' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const input: CalculateTaxInput = {
        country,
        income: incomeNum,
        year: parseInt(taxYear, 10),
        filingStatus,
      };
      const response = await calculateTax(input);
      setResult(response);
    } catch (error) {
      console.error('Error calculating tax:', error);
      toast({ variant: 'destructive', title: 'Calculation Failed', description: 'Could not calculate the tax. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setCountry('United States');
    setIncome('');
    setFilingStatus(filingStatuses["United States"][0]);
    setTaxYear(new Date().getFullYear().toString());
    setResult(null);
  };

  const currencySymbol = useMemo(() => result?.currencySymbol || '$', [result]);

  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Net Income', value: result.netIncome, fill: 'hsl(var(--primary))' },
      { name: 'Total Tax', value: result.totalTax, fill: 'hsl(var(--destructive))' },
    ];
  }, [result]);

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

        <Card className="max-w-6xl mx-auto shadow-lg border-border/60 bg-secondary/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <Globe className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              AI-Powered Tax Calculator
            </CardTitle>
            <CardDescription>
              Estimate your income tax obligations across 15 different countries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Your Financial Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger id="country"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="income">Gross Annual Income (Local Currency)</Label>
                      <Input id="income" type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g., 60000" />
                    </div>
                     {filingStatuses[country] && (
                        <div>
                          <Label htmlFor="filing-status">Filing Status</Label>
                           <Select value={filingStatus} onValueChange={setFilingStatus}>
                            <SelectTrigger id="filing-status"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {filingStatuses[country].map(fs => <SelectItem key={fs} value={fs}>{fs}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                     )}
                    <div>
                      <Label htmlFor="tax-year">Tax Year</Label>
                      <Input id="tax-year" type="number" value={taxYear} onChange={e => setTaxYear(e.target.value)} placeholder="e.g., 2024" />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex gap-2">
                  <Button onClick={handleCalculate} size="lg" className="flex-1" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                    Calculate Tax
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="lg" className="flex-1"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center">Tax Estimation</h3>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96">
                        <Loader2 className="h-16 w-16 mb-4 animate-spin text-primary" />
                        <p>AI is crunching the numbers... this may take a moment.</p>
                    </div>
                ) : result ? (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="text-center p-4">
                            <CardDescription>Total Tax</CardDescription>
                            <CardTitle className="text-3xl text-destructive">{currencySymbol}{result.totalTax.toLocaleString()}</CardTitle>
                        </Card>
                        <Card className="text-center p-4">
                            <CardDescription>Net Income (After Tax)</CardDescription>
                            <CardTitle className="text-3xl text-green-500">{currencySymbol}{result.netIncome.toLocaleString()}</CardTitle>
                        </Card>
                    </div>

                    <Card>
                       <CardHeader>
                         <CardTitle className="text-lg">Tax Breakdown</CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-2 text-sm">
                           {result.breakdown.map((item, index) => (
                               <div key={index} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                                   <span>{item.description}</span>
                                   <span className="font-mono font-semibold">{currencySymbol}{item.amount.toLocaleString()}</span>
                               </div>
                           ))}
                           <div className="text-xs text-muted-foreground pt-2">
                             {result.disclaimer}
                           </div>
                       </CardContent>
                    </Card>

                    <Card className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96 bg-muted/30 rounded-lg">
                    <Calculator className="h-16 w-16 mb-4" />
                    <p>Your tax calculation results will appear here.</p>
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

    