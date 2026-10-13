import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Lightbulb } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/common/AppHeader';

const PICKER_OPTIONS = {
  mediaTypes: ['images'],
  quality: 0.4,
  allowsEditing: true,
};

const UploadBillScreen = ({ navigation }) => {

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to scan bills.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    if (!result.canceled && result.assets.length > 0) {
      navigation.navigate('ImagePreview', { imageUri: result.assets[0].uri });
    }
  };

  const handleFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access is needed to select bills.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (!result.canceled && result.assets.length > 0) {
      navigation.navigate('ImagePreview', { imageUri: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Scan Bill" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Choose how to upload your expense bill</Text>

        <TouchableOpacity style={[styles.card, styles.primaryCard]} onPress={handleTakePhoto} activeOpacity={0.8}>
          <View style={[styles.cardIcon, { backgroundColor: COLORS.primary + '20' }]}>
            <Camera size={28} color={COLORS.primary} strokeWidth={2} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Take a Photo</Text>
            <Text style={styles.cardDesc}>Open camera and snap your printed receipt</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleFromGallery} activeOpacity={0.8}>
          <View style={[styles.cardIcon, { backgroundColor: '#7E22CE20' }]}>
            <ImageIcon size={28} color="#7E22CE" strokeWidth={2} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>From Gallery</Text>
            <Text style={styles.cardDesc}>Select an existing photo from your device</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.tipBox}>
          <Lightbulb size={20} color="#B45309" strokeWidth={2} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Tips for best results</Text>
            <Text style={styles.tipText}>
              {`• Keep receipt flat and well-lit\n• Avoid shadows and blur\n• Capture the full receipt in frame`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },

  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 20 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  primaryCard: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  cardIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary },

  tipBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 13, fontWeight: '700', color: '#92400E', marginBottom: 6 },
  tipText: { fontSize: 12, color: '#78350F', lineHeight: 20 },
});

export default UploadBillScreen;
