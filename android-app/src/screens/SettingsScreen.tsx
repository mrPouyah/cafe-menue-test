import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { PROVIDERS } from '../providers';
import { ProviderId } from '../types';
import {
  getApiKey,
  getSelectedProvider,
  saveApiKey,
  saveSelectedProvider,
  clearApiKey,
} from '../storage/apiKeyStore';

export default function SettingsScreen() {
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('openai');
  const [apiKey, setApiKey] = useState('');
  const [savedKeyPresent, setSavedKeyPresent] = useState(false);

  const loadForProvider = useCallback(async (provider: ProviderId) => {
    const stored = await getApiKey(provider);
    setApiKey(stored ?? '');
    setSavedKeyPresent(!!stored);
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const stored = await getSelectedProvider();
        const provider = stored ?? 'openai';
        setSelectedProvider(provider);
        await loadForProvider(provider);
      })();
    }, [loadForProvider])
  );

  useEffect(() => {
    loadForProvider(selectedProvider);
  }, [selectedProvider, loadForProvider]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Missing key', 'Enter an API key before saving.');
      return;
    }
    await saveApiKey(selectedProvider, apiKey.trim());
    await saveSelectedProvider(selectedProvider);
    setSavedKeyPresent(true);
    Alert.alert('Saved', 'Your API key was saved securely on this device.');
  };

  const handleClear = async () => {
    await clearApiKey(selectedProvider);
    setApiKey('');
    setSavedKeyPresent(false);
  };

  const activeProvider = PROVIDERS.find((p) => p.id === selectedProvider)!;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Provider</Text>
      <View style={styles.providerRow}>
        {PROVIDERS.map((provider) => (
          <Pressable
            key={provider.id}
            onPress={() => setSelectedProvider(provider.id)}
            style={[
              styles.providerChip,
              provider.id === selectedProvider && styles.providerChipActive,
            ]}
          >
            <Text
              style={[
                styles.providerChipText,
                provider.id === selectedProvider && styles.providerChipTextActive,
              ]}
            >
              {provider.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>API Key</Text>
      <TextInput
        style={styles.input}
        placeholder={activeProvider.keyPlaceholder}
        placeholderTextColor="#6b7280"
        value={apiKey}
        onChangeText={setApiKey}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable onPress={() => Linking.openURL(activeProvider.keyHelpUrl)}>
        <Text style={styles.link}>Get a {activeProvider.label} API key</Text>
      </Pressable>

      <View style={styles.buttonRow}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        {savedKeyPresent && (
          <Pressable style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.note}>
        Your API key is stored only on this device using the Android Keystore
        (via expo-secure-store) and is sent directly from your device to your
        chosen provider's API — never to any third-party server.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111318' },
  content: { padding: 20 },
  sectionTitle: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
  },
  providerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  providerChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#1f2430',
    borderWidth: 1,
    borderColor: '#2c3242',
  },
  providerChipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  providerChipText: { color: '#d1d5db', fontSize: 14 },
  providerChipTextActive: { color: '#fff', fontWeight: '600' },
  input: {
    backgroundColor: '#1f2430',
    borderWidth: 1,
    borderColor: '#2c3242',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 15,
  },
  link: { color: '#60a5fa', marginTop: 10, fontSize: 13 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  clearButton: {
    backgroundColor: '#1f2430',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2c3242',
  },
  clearButtonText: { color: '#f87171', fontWeight: '600', fontSize: 15 },
  note: { color: '#6b7280', fontSize: 12, marginTop: 24, lineHeight: 18 },
});
