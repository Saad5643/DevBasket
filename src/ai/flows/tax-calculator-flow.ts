
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
  confidenceScore: z.number().min(0).max(1).describe("A score from 0 to 1 indicating the model's confidence in the accuracy of the tax calculation."),
});
export type CalculateTaxOutput = z.infer<typeof CalculateTaxOutputSchema>;


export async function calculateTax(input: CalculateTaxInput): Promise<CalculateTaxOutput> {
  return calculateTaxFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateTaxPrompt',
  input: { schema: CalculateTaxInputSchema },
  output: { schema: CalculateTaxOutputSchema },
  prompt: `You are a certified tax professional with expertise in international tax law. Your task is to provide a highly accurate income tax estimation based on the user's data. You must use the most current and precise tax information available for the specified country and year.

**User Information:**
- **Country:** {{{country}}}
- **Gross Annual Income:** {{{income}}}
- **Tax Year:** {{{year}}}
{{#if filingStatus}}- **Filing Status:** {{{filingStatus}}}{{/if}}

**Instructions:**
1.  **Verify Information:** Access the official tax laws and brackets for the given country, year, and filing status. Double-check all rates, thresholds, and standard deductions.
2.  **Calculate Total Tax:** Perform a step-by-step calculation of the total estimated income tax. Account for all applicable national-level taxes (e.g., federal, social security, medicare). Do not include regional/state taxes unless they are a mandatory part of the national calculation.
3.  **Calculate Net Income:** Subtract the calculated total tax from the gross income.
4.  **Create Detailed Breakdown:** Provide a clear, itemized breakdown of the calculation. Each item in the breakdown should show the income bracket and the tax applied to that portion.
5.  **Set Confidence Score:** Based on the availability and clarity of the tax data you accessed, provide a confidence score between 0.0 (no confidence) and 1.0 (very high confidence) regarding the accuracy of your calculation.
6.  **Add Disclaimer:** Include a standard disclaimer that this is an estimate and a professional should be consulted.

Provide the response as a JSON object that strictly follows the output schema. Do not include any markdown formatting or explanatory text outside the JSON structure.`,
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
    
