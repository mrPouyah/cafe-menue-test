import { AnalyzeParams, ProviderRequestError, VisionProvider } from './types';
import { DETAILED_PROMPT_INSTRUCTION, REFERENCE_PROMPT_INSTRUCTION } from './prompts';

const MODEL = 'gemini-1.5-flash';

export const geminiProvider: VisionProvider = {
  async analyzeImage({ apiKey, image, referenceImage }: AnalyzeParams): Promise<string> {
    const instruction = referenceImage ? REFERENCE_PROMPT_INSTRUCTION : DETAILED_PROMPT_INSTRUCTION;
    const parts: Array<Record<string, unknown>> = [
      { text: instruction },
      { inline_data: { mime_type: image.mimeType, data: image.base64 } },
    ];
    if (referenceImage) {
      parts.push({ inline_data: { mime_type: referenceImage.mimeType, data: referenceImage.base64 } });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new ProviderRequestError(data?.error?.message ?? `Gemini request failed (${response.status})`);
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new ProviderRequestError('Gemini response did not contain any text.');
    }
    return text.trim();
  },
};
