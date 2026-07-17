import * as SecureStore from 'expo-secure-store';
import { ProviderId } from '../types';

const keyName = (provider: ProviderId) => `api_key_${provider}`;
const SELECTED_PROVIDER_KEY = 'selected_provider';

export async function saveApiKey(provider: ProviderId, apiKey: string): Promise<void> {
  await SecureStore.setItemAsync(keyName(provider), apiKey);
}

export async function getApiKey(provider: ProviderId): Promise<string | null> {
  return SecureStore.getItemAsync(keyName(provider));
}

export async function clearApiKey(provider: ProviderId): Promise<void> {
  await SecureStore.deleteItemAsync(keyName(provider));
}

export async function saveSelectedProvider(provider: ProviderId): Promise<void> {
  await SecureStore.setItemAsync(SELECTED_PROVIDER_KEY, provider);
}

export async function getSelectedProvider(): Promise<ProviderId | null> {
  const value = await SecureStore.getItemAsync(SELECTED_PROVIDER_KEY);
  return value as ProviderId | null;
}
