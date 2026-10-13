import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/common/AppHeader';
import AppInput from '../components/common/AppInput';
import AppButton from '../components/common/AppButton';
import Card from '../components/common/Card';

const ManualExpenseEntryScreen = ({ navigation }) => {
  const { categories, addExpense, showToast } = useApp();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const getCatId = (cat) => cat._id || cat.id || '';
  const [categoryId, setCategoryId] = useState(
    categories.length > 0 ? getCatId(categories[0]) : ''
  );
  const [showCategoryList, setShowCategoryList] = useState(false);

  const selectedCategory = categories.find((c) => getCatId(c) === categoryId);

  const handleSave = async () => {
    if (!title.trim()) {
      showToast('Please enter expense title');
      return;
    }

    if (!amount.trim()) {
      showToast('Please enter amount');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Please enter a valid amount');
      return;
    }

    const newExpense = {
      title,
      amount: parsedAmount,
      merchantName: merchant.trim() || undefined,
      categoryId,
      transactionDate: new Date().toISOString(),
      type: 'manual',
    };

    try {
      await addExpense(newExpense);
      showToast('Expense Saved!');
      navigation.goBack();
    } catch {
      showToast('Failed to save expense. Check connection.');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Add Expense"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <Text style={styles.label}>Expense Title</Text>
          <AppInput
            placeholder="e.g., Lunch at cafe"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, styles.labelMargin]}>
            Amount (₹)
          </Text>
          <AppInput
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text style={[styles.label, styles.labelMargin]}>
            Merchant Name (Optional)
          </Text>
          <AppInput
            placeholder="e.g., Coffee Shop"
            value={merchant}
            onChangeText={setMerchant}
          />

          <Text style={[styles.label, styles.labelMargin]}>Category</Text>
          <TouchableOpacity
            style={styles.categorySelector}
            onPress={() => setShowCategoryList(!showCategoryList)}
          >
            {selectedCategory ? (
              <View style={styles.categoryDisplay}>
                <Text style={styles.categoryDisplayEmoji}>
                  {selectedCategory.icon}
                </Text>
                <Text style={styles.categoryDisplayName}>
                  {selectedCategory.name}
                </Text>
              </View>
            ) : (
              <Text style={styles.categoryPlaceholder}>
                Select a category
              </Text>
            )}
            <Text style={styles.categoryChevron}>
              {showCategoryList ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {showCategoryList && (
            <View style={styles.categoryListContainer}>
              {categories.map((item) => {
                const id = getCatId(item);
                return (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.categoryOption,
                      categoryId === id && styles.categoryOptionSelected,
                    ]}
                    onPress={() => {
                      setCategoryId(id);
                      setShowCategoryList(false);
                    }}
                  >
                    <View style={styles.categoryOptionContent}>
                      <Text style={styles.categoryOptionEmoji}>{item.icon}</Text>
                      <Text style={styles.categoryOptionName}>{item.name}</Text>
                    </View>
                    {categoryId === id && (
                      <Text style={styles.categoryCheckmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Card>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Save Expense"
            onPress={handleSave}
            variant="primary"
          />
          <AppButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  formCard: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  labelMargin: {
    marginTop: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
  },
  categoryDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDisplayEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryDisplayName: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  categoryPlaceholder: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  categoryChevron: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  categoryListContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.primaryLight,
  },
  categoryOptionSelected: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  categoryOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryOptionEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryOptionName: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  categoryCheckmark: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
});

export default ManualExpenseEntryScreen;
