
'use server';
/**
 * @fileOverview An AI flow to generate image captions.
 *
 * - generateCaptions - A function that handles the caption generation process.
 * - GenerateCaptionsInput - The input type for the generateCaptions function.
 * - GenerateCaptionsOutput - The return type for the generateCaptions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateCaptionsInputSchema = z.object({
  image: z.string().describe("The image to generate captions for, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  style: z.string().describe("The desired style for the captions (e.g., Funny, Professional, Inspirational)."),
});
export type GenerateCaptionsInput = z.infer<typeof GenerateCaptionsInputSchema>;

const GenerateCaptionsOutputSchema = z.object({
  captions: z.array(z.string()).describe("An array of 5 generated captions."),
});
export type GenerateCaptionsOutput = z.infer<typeof GenerateCaptionsOutputSchema>;

export async function generateCaptions(input: GenerateCaptionsInput): Promise<GenerateCaptionsOutput> {
  return generateCaptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaptionsPrompt',
  input: { schema: GenerateCaptionsInputSchema },
  output: { schema: GenerateCaptionsOutputSchema },
  prompt: `You are an expert social media manager who excels at writing viral, engaging, and creative captions for images.

Analyze the provided image and generate 5 distinct, high-quality captions based on the requested style.

Image: {{media url=image}}
Requested Style: {{{style}}}

Instructions:
- Tailor each caption precisely to the selected style.
- Ensure captions are creative, engaging, and directly relevant to the image content.
- Do not include hashtags unless the style implies it (e.g., 'Trendy').
- Provide the response as a JSON object with a single key "captions" containing an array of 5 strings.
- Do not include markdown formatting in the response.`,
});

const generateCaptionsFlow = ai.defineFlow(
  {
    name: 'generateCaptionsFlow',
    inputSchema: GenerateCaptionsInputSchema,
    outputSchema: GenerateCaptionsOutputSchema,
  },
  async (input: GenerateCaptionsInput) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate captions');
    }
    return output;
  }
);
