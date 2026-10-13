import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { loginUser, registerUser } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const { login } = useApp();
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetFields = () => { setName(''); setEmail(''); setPassword(''); setError(''); };

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) { setError('Email and password are required'); return; }
    setLoading(true);
    try {
      const userData = await loginUser({ email: email.trim(), password });
      await login(userData);
      navigation.replace('MainTabs');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) { setError('All fields are required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const userData = await registerUser({ name: name.trim(), email: email.trim(), password });
      await login(userData);
      navigation.replace('MainTabs');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoLetter}>M</Text>
            </View>
            <Text style={styles.appName}>Monefy</Text>
            <Text style={styles.tagline}>Track Every Rupee</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, tab === 'login' && styles.tabActive]}
                onPress={() => { setTab('login'); resetFields(); }}
              >
                <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, tab === 'register' && styles.tabActive]}
                onPress={() => { setTab('register'); resetFields(); }}
              >
                <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>Register</Text>
              </TouchableOpacity>
            </View>

            {tab === 'register' && (
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={tab === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading
                ? <ActivityIndicator color="#FFF" />
                : <Text style={styles.btnText}>{tab === 'login' ? 'Login' : 'Create Account'}</Text>
              }
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1E40AF' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },

  hero: { alignItems: 'center', marginBottom: 36 },
  logoCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  logoLetter: { fontSize: 46, fontWeight: 'bold', color: '#1E40AF' },
  appName: { fontSize: 38, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
  tagline: { fontSize: 15, color: '#BFDBFE' },

  card: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },

  tabs: {
    flexDirection: 'row', backgroundColor: '#F1F5F9',
    borderRadius: 12, padding: 4, marginBottom: 22,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: '#3563E9' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#FFF' },

  input: {
    backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: '#0F172A', marginBottom: 14,
  },

  errorText: { color: '#EF4444', fontSize: 13, marginBottom: 12, textAlign: 'center', fontWeight: '500' },

  btn: {
    backgroundColor: '#3563E9', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  btnDisabled: { opacity: 0.65 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default LoginScreen;
