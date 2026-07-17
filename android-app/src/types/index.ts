export type ProviderId = 'openai' | 'gemini' | 'claude';

export interface ProviderInfo {
  id: ProviderId;
  label: string;
  keyPlaceholder: string;
  keyHelpUrl: string;
}

export interface ImageAsset {
  uri: string;
  base64: string;
  mimeType: string;
}

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};
