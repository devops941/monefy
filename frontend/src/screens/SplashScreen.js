import React, { useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/colors';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>M</Text>
        </View>
        <Text style={styles.appName}>Monefy</Text>
        <Text style={styles.tagline}>Track Every Rupee</Text>
      </View>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoLetter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  spinnerContainer: {
    marginBottom: 48,
  },
});

export default SplashScreen;
