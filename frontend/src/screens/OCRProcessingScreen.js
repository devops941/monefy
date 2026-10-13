import { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import Constants from 'expo-constants';
import { RefreshCw, PenLine, AlertCircle, CheckCircle } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:5000`;
  return 'http://localhost:5000';
};

const parseBillWithAI = async (imageUri) => {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const response = await fetch(`${getBaseUrl()}/api/parse-bill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg' }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${response.status}`);
  }

  return response.json();
};

const STATUS = { SCANNING: 'scanning', SUCCESS: 'success', FAILED: 'failed' };

const STEPS = ['Reading image...', 'AI scanning receipt...', 'Organising results...'];

const OCRProcessingScreen = ({ navigation, route }) => {
  const imageUri = route?.params?.imageUri || null;
  const [status, setStatus] = useState(STATUS.SCANNING);
  const [step, setStep] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const extractedRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (mountedRef.current) setElapsedSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const runScan = useCallback(async () => {
    if (!imageUri) {
      setStatus(STATUS.FAILED);
      setErrorMsg('No image provided.');
      return;
    }

    setStatus(STATUS.SCANNING);
    setStep(0);
    setElapsedSec(0);
    setErrorMsg('');
    extractedRef.current = null;

    await new Promise((r) => setTimeout(r, 400));
    if (!mountedRef.current) return;

    setStep(1);

    try {
      const result = await parseBillWithAI(imageUri);
      if (!mountedRef.current) return;

      extractedRef.current = result;
      setStep(2);
      await new Promise((r) => setTimeout(r, 400));
      if (!mountedRef.current) return;

      // Success — navigate immediately
      navigation.navigate('ExtractedBillReview', { imageUri, ...result });
    } catch (err) {
      if (!mountedRef.current) return;
      setErrorMsg(err.message || 'AI service failed.');
      setStatus(STATUS.FAILED);
    }
  }, [imageUri, navigation]);

  useEffect(() => { runScan(); }, [runScan]);

  const handleManual = () => {
    navigation.navigate('ExtractedBillReview', {
      imageUri,
      merchantName: '',
      items: [{ id: 1, itemName: '', quantity: 1, unitPrice: 0, amount: 0, category: 'Other' }],
    });
  };

  // ── Failed state ──────────────────────────────────────────────────────────
  if (status === STATUS.FAILED) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.failedIcon}>
            <AlertCircle size={48} color={COLORS.danger} strokeWidth={1.5} />
          </View>
          <Text style={styles.failedTitle}>Scan Failed</Text>
          <Text style={styles.failedMsg}>
            {errorMsg.includes('busy') || errorMsg.includes('503')
              ? 'The AI service is temporarily busy. Please try again in a moment.'
              : errorMsg}
          </Text>

          <TouchableOpacity style={styles.retryBtn} onPress={runScan} activeOpacity={0.8}>
            <RefreshCw size={18} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.manualBtn} onPress={handleManual} activeOpacity={0.8}>
            <PenLine size={16} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.manualBtnText}>Enter Manually</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
            <Text style={styles.backLinkText}>← Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Scanning state ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.title}>Scanning Bill</Text>
        <Text style={styles.subtitle}>AI is reading your receipt...</Text>

        <View style={styles.stepsBox}>
          {STEPS.map((text, i) => (
            <View key={i} style={styles.stepRow}>
              <Text style={styles.stepIcon}>
                {i < step ? '✅' : i === step ? '⏳' : '○'}
              </Text>
              <Text style={[styles.stepText, i === step && styles.stepTextActive]}>{text}</Text>
            </View>
          ))}
        </View>

        {elapsedSec >= 8 && (
          <Text style={styles.slowNote}>Still working — the AI service may be busy...</Text>
        )}
        <Text style={styles.elapsed}>{elapsedSec}s</Text>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 },

  // Scanning
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginTop: 24, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 28 },
  stepsBox: { width: '100%', gap: 10, marginBottom: 24 },
  stepRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.card, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  stepIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  stepText: { fontSize: 14, color: COLORS.textSecondary },
  stepTextActive: { color: COLORS.textPrimary, fontWeight: '600' },
  slowNote: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginBottom: 6 },
  elapsed: { fontSize: 12, color: COLORS.textMuted, marginBottom: 24 },
  cancelBtn: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 32,
  },
  cancelText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },

  // Failed
  failedIcon: { marginBottom: 16 },
  failedTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 10 },
  failedMsg: {
    fontSize: 14, color: COLORS.textSecondary, textAlign: 'center',
    lineHeight: 20, marginBottom: 32,
  },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 32, marginBottom: 12, width: '100%',
    justifyContent: 'center',
  },
  retryBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  manualBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.card, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 32, marginBottom: 24, width: '100%',
    justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.primary,
  },
  manualBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  backLink: { marginTop: 4 },
  backLinkText: { fontSize: 13, color: COLORS.textMuted },
});

export default OCRProcessingScreen;
