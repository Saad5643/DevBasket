
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
  description: z.string().describe('A well-structured and engaging video description including a summary and key points.'),
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
  prompt: `You are a YouTube content strategist and SEO expert. Your task is to generate optimized content for a video based on a given topic and tone.

Video Topic: {{{topic}}}
{{#if videoDescription}}Video Description: {{{videoDescription}}}{{/if}}
{{#if targetAudience}}Target Audience: {{{targetAudience}}}{{/if}}
Tone: {{{tone}}}

Instructions:
1.  **Title**: Create a compelling, clickable, and SEO-friendly title based on the provided inputs. It should be under 70 characters.
2.  **Description**: Write a detailed and engaging video description. Start with a 2-3 sentence summary. Then, add a "In this video:" section with bullet points or timestamps.
3.  **Hashtags**: Generate a list of 10-15 relevant hashtags. Mix broad and specific tags. All hashtags must start with #.
4.  **Keywords**: Generate a list of 5-10 important keywords and LSI (Latent Semantic Indexing) terms for the YouTube algorithm. These should be terms people are likely to search for.

The tone should be '{{{tone}}}'. For 'viral', use more sensational language and emojis. For 'professional', be more formal. For 'casual', be friendly and relatable.

Provide the response as a JSON object that strictly follows the output schema.`,
});

const generateYoutubeContentFlow = ai.defineFlow(
  {
    name: 'generateYoutubeContentFlow',
    inputSchema: GenerateYoutubeContentInputSchema,
    outputSchema: GenerateYoutubeContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate YouTube content');
    }
    return output;
  }
);
