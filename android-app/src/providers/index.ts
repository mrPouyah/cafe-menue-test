import { ProviderId, ProviderInfo } from '../types';
import { VisionProvider } from './types';
import { openaiProvider } from './openai';
import { geminiProvider } from './gemini';
import { claudeProvider } from './claude';

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'openai',
    label: 'OpenAI (GPT-4o)',
    keyPlaceholder: 'sk-...',
    keyHelpUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    keyPlaceholder: 'AIza...',
    keyHelpUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'claude',
    label: 'Anthropic Claude',
    keyPlaceholder: 'sk-ant-...',
    keyHelpUrl: 'https://console.anthropic.com/settings/keys',
  },
];

const registry: Record<ProviderId, VisionProvider> = {
  openai: openaiProvider,
  gemini: geminiProvider,
  claude: claudeProvider,
};

export function getProvider(id: ProviderId): VisionProvider {
  return registry[id];
}

export * from './types';
