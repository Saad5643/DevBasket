
'use server';
/**
 * @fileOverview An AI flow to calculate income tax for various countries.
 *
 * - calculateTax - A function that handles the tax calculation process.
 * - CalculateTaxInput - The input type for the calculateTax function.
 * - CalculateTaxOutput - The return type for the calculateTax function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CalculateTaxInputSchema = z.object({
  country: z.string().describe('The country for which to calculate the tax.'),
  income: z.number().describe('The gross annual income in the local currency.'),
  year: z.number().describe('The tax year for the calculation.'),
  filingStatus: z.string().optional().describe('The filing status (e.g., Single, Married). This is country-specific.'),
});
export type CalculateTaxInput = z.infer<typeof CalculateTaxInputSchema>;

const TaxBreakdownItemSchema = z.object({
    description: z.string().describe("Description of the tax bracket or component (e.g., '10% on first 10,000' or 'Federal Tax')."),
    amount: z.number().describe("The tax amount for this specific bracket or component.")
});

const CalculateTaxOutputSchema = z.object({
  totalTax: z.number().describe('The total estimated income tax amount.'),
  netIncome: z.number().describe('The net income after all taxes are deducted.'),
  currencySymbol: z.string().describe("The currency symbol for the country (e.g., $, €, £)."),
  breakdown: z.array(TaxBreakdownItemSchema).describe('An array of objects detailing the tax bracket breakdown.'),
  disclaimer: z.string().describe("A brief disclaimer stating that this is an estimate and a tax professional should be consulted."),
});
export type CalculateTaxOutput = z.infer<typeof CalculateTaxOutputSchema>;


export async function calculateTax(input: CalculateTaxInput): Promise<CalculateTaxOutput> {
  return calculateTaxFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateTaxPrompt',
  input: { schema: CalculateTaxInputSchema },
  output: { schema: CalculateTaxOutputSchema },
  prompt: `You are an expert tax consultant. Your task is to calculate the estimated income tax for a user based on the provided information.

Country: {{{country}}}
Gross Annual Income: {{{income}}}
Tax Year: {{{year}}}
{{#if filingStatus}}Filing Status: {{{filingStatus}}}{{/if}}

Instructions:
1.  **Calculate Total Tax:** Based on the country's tax laws for the specified year and filing status, calculate the total estimated income tax.
2.  **Calculate Net Income:** Subtract the total tax from the gross income.
3.  **Determine Currency Symbol:** Provide the correct currency symbol for the country.
4.  **Create Breakdown:** Provide a simplified breakdown of the main tax brackets or components that contribute to the total tax. For example, federal tax, state/provincial tax, social security contributions, etc. Show how different income portions are taxed at different rates.
5.  **Add Disclaimer:** Include a disclaimer that this is an estimate for informational purposes only and a professional tax advisor should be consulted for accurate financial planning.

Provide the response as a JSON object that strictly follows the output schema. Do not include any markdown formatting.`,
});

const calculateTaxFlow = ai.defineFlow(
  {
    name: 'calculateTaxFlow',
    inputSchema: CalculateTaxInputSchema,
    outputSchema: CalculateTaxOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to calculate tax');
    }
    return output;
  }
);

    