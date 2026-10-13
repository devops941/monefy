import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { formatINRShort } from '../utils/format';
import AppHeader from '../components/common/AppHeader';
import AppButton from '../components/common/AppButton';
import Card from '../components/common/Card';

const MonthlyBudgetScreen = ({ navigation }) => {
  const { userProfile, setUserProfile, showToast } = useApp();
  const [budgetInput, setBudgetInput] = useState(
    (userProfile?.defaultBudget || 50000).toString()
  );

  const parsedBudget = parseFloat(budgetInput) || 0;

  const handleSave = () => {
    if (!budgetInput.trim()) {
      showToast('Please enter a budget amount');
      return;
    }
    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      showToast('Please enter a valid amount');
      return;
    }
    setUserProfile({ ...userProfile, defaultBudget: parsedBudget });
    showToast('Monthly budget updated!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Monthly Budget"
        onBack={() => navigation.goBack()}
        rightLabel="Categories"
        onRightPress={() => navigation.navigate('CategoryBudgets')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            Set your monthly spending limit. You'll receive warnings when you
            reach 80% and 95% of your budget.
          </Text>
        </Card>

        <Card style={styles.inputCard}>
          <Text style={styles.label}>Monthly Budget Limit</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.input}
              placeholder="50000"
              placeholderTextColor={COLORS.textMuted}
              value={budgetInput}
              onChangeText={setBudgetInput}
              keyboardType="decimal-pad"
            />
          </View>
        </Card>

        {parsedBudget > 0 && (
          <>
            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>⚡</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>80% Warning</Text>
                  <Text style={styles.infoDescription}>
                    Alert at {formatINRShort(parsedBudget * 0.8)}
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>⚠️</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>95% Warning</Text>
                  <Text style={styles.infoDescription}>
                    Alert at {formatINRShort(parsedBudget * 0.95)}
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}

        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips for Budget Management</Text>
          {[
            'Review your spending weekly to stay on track',
            'Set category-specific limits for better control',
            'Use the Reports section to analyze spending patterns',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.buttonContainer}>
          <AppButton title="Save Budget" onPress={handleSave} variant="primary" />
          <AppButton title="Cancel" onPress={() => navigation.goBack()} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  descriptionCard: { marginBottom: 20 },
  descriptionText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },

  inputCard: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 12 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginRight: 8,
  },
  input: {
    flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.textPrimary,
  },

  infoCard: { marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIcon: { fontSize: 20, marginTop: 2 },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  infoDescription: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  tipsCard: { marginBottom: 24, backgroundColor: COLORS.primaryLight },
  tipsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 12 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  tipBullet: { fontSize: 12, fontWeight: '600', color: COLORS.primary, marginRight: 8 },
  tipText: { fontSize: 12, color: COLORS.primary, flex: 1, lineHeight: 18 },

  buttonContainer: { gap: 12, marginBottom: 24 },
});

export default MonthlyBudgetScreen;
