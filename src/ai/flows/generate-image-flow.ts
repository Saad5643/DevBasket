
'use server';
/**
 * @fileOverview An AI flow to generate an image from a text prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe("The user's text prompt for the image."),
  style: z.string().describe("The desired artistic style for the image (e.g., Cinematic, Anime)."),
  quality: z.enum(['standard', 'hd']).describe("The desired quality for the image."),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;


const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({ prompt, quality, style }) => {
    
    let enhancedPrompt = prompt;
    if (style && style !== 'none') {
      enhancedPrompt = `${prompt}, ${style} style`;
    }
    if (quality === 'hd') {
      enhancedPrompt = `${enhancedPrompt}, 4k, photorealistic, ultra detailed, high quality`;
    }
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: enhancedPrompt,
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed to return an image.');
    }

    return { imageUrl: media.url };
  }
);
