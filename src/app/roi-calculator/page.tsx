
'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calculator, RefreshCw, TrendingUp, Wallet, Percent, Calendar, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toPng } from 'html-to-image';

type TimePeriod = 'months' | 'years';

interface CalculationResult {
  roiPercentage: number;
  netProfit: number;
  periodicRoi?: number;
}

export default function RoiCalculator() {
  const { toast } = useToast();
  const [initialInvestment, setInitialInvestment] = useState('1000');
  const [finalValue, setFinalValue] = useState('1300');
  const [duration, setDuration] = useState('6');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('months');
  const [currency, setCurrency] = useState('$');
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const dur = parseInt(duration);

    if (isNaN(initial) || isNaN(final) || initial <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter valid numbers for investment and final value.',
      });
      return;
    }

    const netProfit = final - initial;
    const roiPercentage = (netProfit / initial) * 100;
    
    let periodicRoi;
    if (!isNaN(dur) && dur > 0) {
        if (timePeriod === 'years') {
            periodicRoi = roiPercentage / dur;
        } else { // months
            periodicRoi = roiPercentage / (dur / 12);
        }
    }

    setResult({
      roiPercentage,
      netProfit,
      periodicRoi,
    });
  };

  const handleReset = () => {
    setInitialInvestment('');
    setFinalValue('');
    setDuration('');
    setTimePeriod('months');
    setResult(null);
    setCurrency('$');
  };

  const formatCurrency = (value: number) => {
    return `${currency}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Initial Investment', value: parseFloat(initialInvestment) || 0, fill: 'hsl(var(--secondary-foreground))' },
      { name: 'Final Value', value: parseFloat(finalValue) || 0, fill: 'hsl(var(--primary))' },
    ];
  }, [result, initialInvestment, finalValue]);

  const handleDownload = () => {
    if (!resultRef.current) return;
    toPng(resultRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'roi-calculation.png';
        link.href = dataUrl;
        link.click();
        toast({ title: 'Result image downloading!' });
      })
      .catch(() => {
        toast({ variant: 'destructive', title: 'Could not generate image.' });
      });
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

        <Card className="max-w-6xl mx-auto shadow-lg border-border/60 bg-secondary/30 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <Calculator className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Return on Investment (ROI) Calculator
            </CardTitle>
            <CardDescription>
              Calculate the profitability of your investments quickly and easily.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Investment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currency-symbol">Currency Symbol</Label>
                      <Input id="currency-symbol" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-20" />
                    </div>
                    <div>
                      <Label htmlFor="initial-investment">Initial Investment</Label>
                      <Input id="initial-investment" type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} placeholder="e.g., 1000" />
                    </div>
                    <div>
                      <Label htmlFor="final-value">Final Value / Return</Label>
                      <Input id="final-value" type="number" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} placeholder="e.g., 1300" />
                    </div>
                    <div>
                      <Label>Time Duration (Optional)</Label>
                      <div className="flex gap-2">
                        <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 6" />
                        <Select value={timePeriod} onValueChange={(val: TimePeriod) => setTimePeriod(val)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex gap-2">
                  <Button onClick={handleCalculate} size="lg" className="flex-1">Calculate ROI</Button>
                  <Button onClick={handleReset} variant="outline" size="lg" className="flex-1"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Formula Used</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <p><span className="font-semibold">ROI %</span> = ((Final Value - Initial Investment) / Initial Investment) * 100</p>
                        <p><span className="font-semibold">Net Profit</span> = Final Value - Initial Investment</p>
                    </CardContent>
                 </Card>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <div ref={resultRef} className="bg-background rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">Results</h3>
                    {result ? (
                      <div className="space-y-6 animate-fade-in-up">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="text-center">
                                <CardHeader><CardTitle>ROI</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-green-500">{result.roiPercentage.toFixed(2)}%</p>
                                </CardContent>
                            </Card>
                             <Card className="text-center">
                                <CardHeader><CardTitle>Net Profit</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-primary">{formatCurrency(result.netProfit)}</p>
                                </CardContent>
                            </Card>
                             {result.periodicRoi !== undefined && (
                                <Card className="text-center sm:col-span-2">
                                  <CardHeader><CardTitle>Annualized ROI</CardTitle></CardHeader>
                                  <CardContent>
                                    <p className="text-3xl font-bold">{result.periodicRoi.toFixed(2)}%</p>
                                    <p className="text-sm text-muted-foreground">per year</p>
                                  </CardContent>
                                </Card>
                            )}
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-center mb-2">Visual Comparison</h4>
                            <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                  <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{fill: 'hsl(var(--muted))'}} />
                                  <Bar dataKey="value" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                        </div>

                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-96">
                        <TrendingUp className="h-16 w-16 mb-4" />
                        <p>Your calculation results will appear here.</p>
                      </div>
                    )}
                </div>
                {result && (
                    <Button onClick={handleDownload} variant="secondary" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download as PNG
                    </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
