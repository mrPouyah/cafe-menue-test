import { AnalyzeParams, ProviderRequestError, VisionProvider } from './types';
import { DETAILED_PROMPT_INSTRUCTION, REFERENCE_PROMPT_INSTRUCTION } from './prompts';

const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-5';
const ANTHROPIC_VERSION = '2023-06-01';

export const claudeProvider: VisionProvider = {
  async analyzeImage({ apiKey, image, referenceImage }: AnalyzeParams): Promise<string> {
    const instruction = referenceImage ? REFERENCE_PROMPT_INSTRUCTION : DETAILED_PROMPT_INSTRUCTION;
    const content: Array<Record<string, unknown>> = [
      { type: 'text', text: instruction },
      { type: 'image', source: { type: 'base64', media_type: image.mimeType, data: image.base64 } },
    ];
    if (referenceImage) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: referenceImage.mimeType, data: referenceImage.base64 },
      });
    }

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 800,
        messages: [{ role: 'user', content }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new ProviderRequestError(data?.error?.message ?? `Claude request failed (${response.status})`);
    }

    const text = data?.content?.[0]?.text;
    if (!text) {
      throw new ProviderRequestError('Claude response did not contain any text.');
    }
    return text.trim();
  },
};
