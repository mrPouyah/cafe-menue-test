import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ImagePickerButton from '../components/ImagePickerButton';
import ResultCard from '../components/ResultCard';
import { getApiKey, getSelectedProvider } from '../storage/apiKeyStore';
import { getProvider } from '../providers';
import { ImageAsset, ProviderId, RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  const [provider, setProvider] = useState<ProviderId | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const [mainImage, setMainImage] = useState<ImageAsset | null>(null);
  const [referenceImage, setReferenceImage] = useState<ImageAsset | null>(null);

  const [prompt, setPrompt] = useState<string | null>(null);
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [refining, setRefining] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const selected = (await getSelectedProvider()) ?? 'openai';
        const key = await getApiKey(selected);
        setProvider(selected);
        setApiKey(key);
      })();
    }, [])
  );

  const requireApiKey = (): boolean => {
    if (!apiKey || !provider) {
      Alert.alert('API key required', 'Add your API key in Settings before analyzing an image.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => navigation.navigate('Settings') },
      ]);
      return false;
    }
    return true;
  };

  const handleMainImagePicked = (asset: ImageAsset) => {
    setMainImage(asset);
    setPrompt(null);
    setRefinedPrompt(null);
    setReferenceImage(null);
  };

  const handleAnalyze = async () => {
    if (!mainImage || !requireApiKey()) return;
    setAnalyzing(true);
    try {
      const result = await getProvider(provider!).analyzeImage({ apiKey: apiKey!, image: mainImage });
      setPrompt(result);
    } catch (err) {
      Alert.alert('Analysis failed', err instanceof Error ? err.message : 'Unknown error.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReferencePicked = (asset: ImageAsset) => {
    setReferenceImage(asset);
    setRefinedPrompt(null);
  };

  const handleRefine = async () => {
    if (!mainImage || !referenceImage || !requireApiKey()) return;
    setRefining(true);
    try {
      const result = await getProvider(provider!).analyzeImage({
        apiKey: apiKey!,
        image: mainImage,
        referenceImage,
      });
      setRefinedPrompt(result);
    } catch (err) {
      Alert.alert('Refinement failed', err instanceof Error ? err.message : 'Unknown error.');
    } finally {
      setRefining(false);
    }
  };

  const handleReset = () => {
    setMainImage(null);
    setReferenceImage(null);
    setPrompt(null);
    setRefinedPrompt(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!apiKey && (
        <Pressable style={styles.warningBanner} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.warningText}>No API key set — tap here to add one in Settings.</Text>
        </Pressable>
      )}

      <Text style={styles.sectionTitle}>1. Upload an image</Text>
      {mainImage ? (
        <Image source={{ uri: mainImage.uri }} style={styles.preview} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}
      <View style={styles.buttonSpacer}>
        <ImagePickerButton label={mainImage ? 'Change Image' : 'Upload Image'} onPicked={handleMainImagePicked} />
      </View>

      {mainImage && (
        <Pressable
          style={[styles.analyzeButton, analyzing && styles.disabledButton]}
          onPress={handleAnalyze}
          disabled={analyzing}
        >
          {analyzing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analyze Image</Text>
          )}
        </Pressable>
      )}

      {prompt && <ResultCard title="Detailed Prompt" text={prompt} />}

      {prompt && (
        <>
          <Text style={styles.sectionTitle}>2. Match a reference photo (optional)</Text>
          <Text style={styles.hint}>
            Upload a reference photo showing the exact style, lighting, or composition you want.
            We'll rewrite the prompt to match it precisely.
          </Text>
          {referenceImage ? (
            <Image source={{ uri: referenceImage.uri }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No reference photo selected</Text>
            </View>
          )}
          <View style={styles.buttonSpacer}>
            <ImagePickerButton
              label={referenceImage ? 'Change Reference Photo' : 'Upload Reference Photo'}
              onPicked={handleReferencePicked}
              variant="secondary"
            />
          </View>

          {referenceImage && (
            <Pressable
              style={[styles.analyzeButton, refining && styles.disabledButton]}
              onPress={handleRefine}
              disabled={refining}
            >
              {refining ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.analyzeButtonText}>Generate Exact Prompt</Text>
              )}
            </Pressable>
          )}

          {refinedPrompt && <ResultCard title="Exact Prompt (matched to reference)" text={refinedPrompt} />}
        </>
      )}

      {(mainImage || prompt) && (
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Start Over</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111318' },
  content: { padding: 20, paddingBottom: 60 },
  warningBanner: {
    backgroundColor: '#3f2d1a',
    borderWidth: 1,
    borderColor: '#7c5a26',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  warningText: { color: '#facc15', fontSize: 13 },
  sectionTitle: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
  },
  hint: { color: '#6b7280', fontSize: 13, marginBottom: 12, lineHeight: 18 },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#1f2430',
    marginBottom: 12,
  },
  placeholder: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#1f2430',
    borderWidth: 1,
    borderColor: '#2c3242',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  placeholderText: { color: '#4b5563', fontSize: 14 },
  buttonSpacer: { marginBottom: 12 },
  analyzeButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  disabledButton: { opacity: 0.6 },
  analyzeButtonText: { color: '#0b1a10', fontWeight: '700', fontSize: 15 },
  resetButton: { alignItems: 'center', marginTop: 28, padding: 10 },
  resetButtonText: { color: '#6b7280', fontSize: 13 },
});
