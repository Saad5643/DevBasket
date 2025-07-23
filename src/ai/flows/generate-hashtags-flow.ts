
'use server';
/**
 * @fileOverview An AI flow to generate hashtags based on a topic.
 *
 * - generateHashtags - A function that handles the hashtag generation process.
 * - GenerateHashtagsInput - The input type for the generateHashtags function.
 * - GenerateHashtagsOutput - The return type for the generateHashtags function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateHashtagsInputSchema = z.object({
  topic: z.string().describe('The topic or keyword to generate hashtags for.'),
  style: z.enum(['trending', 'niche', 'random-mix']).describe('The desired style for the hashtags.'),
});
export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  hashtags: z.array(z.string()).describe('An array of 20-30 generated hashtags, including the # symbol.'),
});
export type GenerateHashtagsOutput = z.infer<typeof GenerateHashtagsOutputSchema>;


export async function generateHashtags(input: GenerateHashtagsInput): Promise<GenerateHashtagsOutput> {
  return generateHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHashtagsPrompt',
  input: { schema: GenerateHashtagsInputSchema },
  output: { schema: GenerateHashtagsOutputSchema },
  prompt: `You are a social media expert specializing in advanced hashtag strategy. Your task is to generate a list of 20-30 highly relevant and effective hashtags for a given topic and style.

Topic: {{{topic}}}
Style: {{{style}}}

Instructions:
- If the style is "trending", generate popular and widely used hashtags related to the topic. Focus on high-volume tags that maximize reach.
- If the style is "niche", generate more specific, long-tail, and community-focused hashtags. These should target a very specific audience.
- If the style is "random-mix", provide a well-balanced mix of trending (broad reach) and niche (high engagement) hashtags. Aim for a 50/50 split.
- All hashtags must start with the # symbol.
- Avoid generic and spammy hashtags.
- Ensure the output is a JSON object with a "hashtags" key containing an array of strings.
`,
});

const generateHashtagsFlow = ai.defineFlow(
  {
    name: 'generateHashtagsFlow',
    inputSchema: GenerateHashtagsInputSchema,
    outputSchema: GenerateHashtagsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate hashtags');
    }
    return output;
  }
);
