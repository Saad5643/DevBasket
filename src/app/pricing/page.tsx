
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    frequency: '/month',
    description: 'For individuals and hobbyists starting out.',
    features: [
      'Access to 5 basic tools',
      '10 AI generations per day',
      'Community support',
      'Limited to 1 project',
    ],
    cta: 'Get Started',
    variant: 'outline',
  },
  {
    name: 'Pro',
    price: '$15',
    frequency: '/month',
    description: 'For professionals and small teams.',
    features: [
      'Access to all tools',
      '1000 AI generations per day',
      'Priority email support',
      'Unlimited projects',
      'Advanced analytics',
    ],
    cta: 'Upgrade to Pro',
    variant: 'default',
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    frequency: '',
    description: 'For large organizations and custom needs.',
    features: [
      'Everything in Pro, plus:',
      'Unlimited AI generations',
      'Dedicated support & SLA',
      'Custom integrations',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
    variant: 'outline',
  },
];


export default function PricingPage() {
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="max-w-5xl mx-auto shadow-lg border-border/60">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 text-primary p-3 rounded-xl inline-block mb-4">
              <DollarSign className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Pricing Plans
            </CardTitle>
            <CardDescription>
              Choose the plan that's right for you. Simple and transparent pricing.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {tiers.map((tier) => (
              <Card key={tier.name} className={cn(
                "flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2",
                tier.recommended && "border-primary shadow-primary/20"
              )}>
                <CardHeader>
                  {tier.recommended && (
                     <div className="text-center">
                        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-primary-foreground bg-primary rounded-full uppercase">Most Popular</span>
                     </div>
                  )}
                  <CardTitle className="text-center text-2xl pt-4">{tier.name}</CardTitle>
                  <CardDescription className="text-center">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.frequency}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-center text-muted-foreground mb-6">{tier.description}</p>
                   <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={tier.variant as any}>
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
