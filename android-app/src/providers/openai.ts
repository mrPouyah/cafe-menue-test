import { AnalyzeParams, ProviderRequestError, VisionProvider } from './types';
import { DETAILED_PROMPT_INSTRUCTION, REFERENCE_PROMPT_INSTRUCTION } from './prompts';

const ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o';

export const openaiProvider: VisionProvider = {
  async analyzeImage({ apiKey, image, referenceImage }: AnalyzeParams): Promise<string> {
    const instruction = referenceImage ? REFERENCE_PROMPT_INSTRUCTION : DETAILED_PROMPT_INSTRUCTION;
    const content: Array<Record<string, unknown>> = [
      { type: 'text', text: instruction },
      { type: 'image_url', image_url: { url: `data:${image.mimeType};base64,${image.base64}` } },
    ];
    if (referenceImage) {
      content.push({
        type: 'image_url',
        image_url: { url: `data:${referenceImage.mimeType};base64,${referenceImage.base64}` },
      });
    }

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 800,
        messages: [{ role: 'user', content }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new ProviderRequestError(data?.error?.message ?? `OpenAI request failed (${response.status})`);
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new ProviderRequestError('OpenAI response did not contain any text.');
    }
    return text.trim();
  },
};
