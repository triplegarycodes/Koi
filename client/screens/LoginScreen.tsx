import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const res = await signIn(username, password);
    setLoading(false);
    if (!res.ok) {
      Alert.alert('Sign in failed', res.message || 'Unknown error');
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const res = await signUp(username, password);
    setLoading(false);
    if (!res.ok) {
      Alert.alert('Sign up failed', res.message || 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.inner}>
        <Text style={styles.title}>Koi</Text>
        <Text style={styles.description}>
          Chill app to relax and customize your koi — sign in to save your session.
        </Text>

        <TextInput
          placeholder="Username"
          style={styles.input}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          editable={!loading}
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.link]} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.linkText}>New? Create an account (mock)</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          For this demo any non-empty username and password will sign you in. No backend required.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 40, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  description: { textAlign: 'center', color: '#666', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  button: {
    backgroundColor: '#1f8ef1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { marginTop: 12, alignItems: 'center' },
  linkText: { color: '#1f8ef1' },
  note: { marginTop: 20, color: '#999', fontSize: 12, textAlign: 'center' }
});
