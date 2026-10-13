import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import AppButton from '../components/common/AppButton';
import AppInput from '../components/common/AppInput';

const ProfileSetupScreen = ({ navigation }) => {
  const { userProfile, setUserProfile, showToast } = useApp();
  const [name, setName] = useState(userProfile?.name || '');
  const [monthlyIncome, setMonthlyIncome] = useState(
    userProfile?.monthlyIncome?.toString() || ''
  );
  const [monthlyBudget, setMonthlyBudget] = useState(
    userProfile?.monthlyBudget?.toString() || ''
  );

  const handleSave = () => {
    if (!name.trim()) {
      showToast('Please enter your name');
      return;
    }
    if (!monthlyIncome.trim()) {
      showToast('Please enter monthly income');
      return;
    }
    if (!monthlyBudget.trim()) {
      showToast('Please enter monthly budget');
      return;
    }

    const profile = {
      name: name.trim(),
      monthlyIncome: parseFloat(monthlyIncome),
      monthlyBudget: parseFloat(monthlyBudget),
    };

    setUserProfile(profile);
    showToast('Profile saved successfully!');
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Set Up Your Profile</Text>
            <Text style={styles.subtitle}>
              Help us personalize your experience
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <AppInput
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Monthly Income</Text>
              <View style={styles.currencyInputWrapper}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <AppInput
                  placeholder="0"
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                  keyboardType="decimal-pad"
                  style={styles.currencyInput}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Monthly Budget</Text>
              <View style={styles.currencyInputWrapper}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <AppInput
                  placeholder="0"
                  value={monthlyBudget}
                  onChangeText={setMonthlyBudget}
                  keyboardType="decimal-pad"
                  style={styles.currencyInput}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Save Profile"
            onPress={handleSave}
            variant="primary"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  formContainer: {
    marginBottom: 40,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  currencyInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    paddingLeft: 12,
  },
  currencyInput: {
    flex: 1,
    marginLeft: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});

export default ProfileSetupScreen;
