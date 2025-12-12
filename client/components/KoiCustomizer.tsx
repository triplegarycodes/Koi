import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/*
  Placeholder Koi customizer.
  - This is intentionally simple and uses only RN components.
  - You can expand with color pickers, animations, sliders, save/load presets, etc.
*/

export default function KoiCustomizer() {
  const [variant, setVariant] = useState<'koi' | 'dragon' | 'blob'>('koi');

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Koi Customizer (placeholder)</Text>
      <Text style={styles.description}>
        Koi in Koi can be anything — fish, dragon, blob, or whatever helps you relax.
      </Text>

      <View style={styles.options}>
        <TouchableOpacity
          style={[styles.optionButton, variant === 'koi' && styles.optionActive]}
          onPress={() => setVariant('koi')}
        >
          <Text style={styles.optionText}>Koi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, variant === 'dragon' && styles.optionActive]}
          onPress={() => setVariant('dragon')}
        >
          <Text style={styles.optionText}>Dragon</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, variant === 'blob' && styles.optionActive]}
          onPress={() => setVariant('blob')}
        >
          <Text style={styles.optionText}>Blob</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.preview}>
        <Text style={styles.previewText}>Preview: {variant}</Text>
        <Text style={styles.hint}>(This is a placeholder — add visuals/animations here)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  description: { color: '#666', marginBottom: 12 },
  options: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  optionButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8
  },
  optionActive: { backgroundColor: '#e6f0ff', borderColor: '#1f8ef1' },
  optionText: { fontWeight: '600' },
  preview: {
    marginTop: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    alignItems: 'center'
  },
  previewText: { fontSize: 16, fontWeight: '600' },
  hint: { color: '#999', marginTop: 8, fontSize: 12 }
});
