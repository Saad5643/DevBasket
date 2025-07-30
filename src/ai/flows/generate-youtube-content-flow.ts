
'use server';
/**
 * @fileOverview An AI flow to generate youtube content.
 *
 * - generateYoutubeContent - A function that handles the youtube content generation process.
 * - GenerateYoutubeContentInput - The input type for the generateYoutubeContent function.
 * - GenerateYoutubeContentOutput - The return type for the generateYoutubeContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateYoutubeContentInputSchema = z.object({
  topic: z.string().describe('The main topic or title for the YouTube video.'),
  videoDescription: z.string().optional().describe('A brief description of the video content.'),
  targetAudience: z.string().optional().describe('The intended audience for the video (e.g., beginner developers, fitness enthusiasts).'),
  tone: z.enum(['professional', 'casual', 'viral']).describe('The desired tone for the generated content.'),
});
export type GenerateYoutubeContentInput = z.infer<typeof GenerateYoutubeContentInputSchema>;

const GenerateYoutubeContentOutputSchema = z.object({
  title: z.string().describe('A catchy and SEO-optimized video title.'),
  description: z.string().describe('A well-structured and engaging video description including a summary, key points/timestamps, and a call-to-action.'),
  hashtags: z.array(z.string()).describe('An array of 10-15 relevant hashtags, including the # symbol.'),
  keywords: z.array(z.string()).describe('A list of 5-10 SEO keywords or LSI terms related to the video topic.'),
});
export type GenerateYoutubeContentOutput = z.infer<typeof GenerateYoutubeContentOutputSchema>;


export async function generateYoutubeContent(input: GenerateYoutubeContentInput): Promise<GenerateYoutubeContentOutput> {
  return generateYoutubeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateYoutubeContentPrompt',
  input: { schema: GenerateYoutubeContentInputSchema },
  output: { schema: GenerateYoutubeContentOutputSchema },
  prompt: `You are a YouTube content strategist and SEO expert with a knack for creating viral content. Your task is to generate highly optimized metadata for a video based on the provided details.

Video Topic: {{{topic}}}
{{#if videoDescription}}Video Description: {{{videoDescription}}}{{/if}}
{{#if targetAudience}}Target Audience: {{{targetAudience}}}{{/if}}
Tone: {{{tone}}}

Instructions:
1.  **Title**: Create a compelling, clickable, and SEO-friendly title under 70 characters. Use power words, numbers, and brackets/parentheses to maximize click-through-rate.
2.  **Description**: Write a detailed, engaging, and well-structured video description.
    - Start with a 2-3 sentence hook that summarizes the video's value.
    - Add a "In this video:" or "Timestamps:" section with at least 3-5 bullet points covering key topics.
    - Include a clear call-to-action (e.g., "Subscribe for more!", "Check out the links below.").
    - Naturally weave in important keywords throughout the description.
3.  **Hashtags**: Generate a list of 10-15 relevant hashtags. Include a mix of broad (high volume) and specific (niche) tags. All hashtags must start with #.
4.  **Keywords**: Generate a list of 5-10 important keywords and LSI (Latent Semantic Indexing) terms. These should be search terms people are likely to use to find this video. Do not include the # symbol.

The tone should be '{{{tone}}}'.
- For 'viral', use sensational language, emojis, and create a sense of urgency or curiosity.
- For 'professional', be formal, authoritative, and clear.
- For 'casual', be friendly, relatable, and use conversational language.

Provide the response as a JSON object that strictly follows the output schema.`,
});

const generateYoutubeContentFlow = ai.defineFlow(
  {
    name: 'generateYoutubeContentFlow',
    inputSchema: GenerateYoutubeContentInputSchema,
    outputSchema: GenerateYoutubeContentOutputSchema,
  },
  async (input: GenerateYoutubeContentInput) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate YouTube content');
    }
    return output;
  }
);
