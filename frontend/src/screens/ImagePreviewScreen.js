import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import AppButton from '../components/common/AppButton';

const ImagePreviewScreen = ({ navigation, route }) => {
  const imageUri = route?.params?.imageUri || null;

  const handleExtractOCR = () => {
    navigation.navigate('OCRProcessing', { imageUri });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerLink}>← Retake</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview Receipt</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>📋</Text>
            <Text style={styles.placeholderText}>No image selected</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <AppButton
          title="Extract with OCR →"
          onPress={handleExtractOCR}
          variant="primary"
          disabled={!imageUri}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    width: 70,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 400,
    backgroundColor: '#374151',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#6B7280',
  },
  placeholderIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

export default ImagePreviewScreen;
