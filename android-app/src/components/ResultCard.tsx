import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface Props {
  title: string;
  text: string;
}

export default function ResultCard({ title, text }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={handleCopy}>
          <Text style={styles.copyLink}>{copied ? 'Copied!' : 'Copy'}</Text>
        </Pressable>
      </View>
      <Text style={styles.body} selectable>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2430',
    borderWidth: 1,
    borderColor: '#2c3242',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { color: '#9ca3af', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
  copyLink: { color: '#60a5fa', fontSize: 13, fontWeight: '600' },
  body: { color: '#e5e7eb', fontSize: 14, lineHeight: 21 },
});
