import { View, StyleSheet, Text, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { formatShortDate, formatINR } from '../utils/format';
import AppHeader from '../components/common/AppHeader';
import Card from '../components/common/Card';

const ExpenseDetailsScreen = ({ navigation, route }) => {
  const { expenses, categories, deleteExpense, showToast } = useApp();
  const { expenseId } = route.params;

  const expense = expenses.find((e) => e._id === expenseId || e.id === expenseId);

  if (!expense) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader title="Expense Details" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Expense not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const category = categories.find((c) => (c._id || c.id) === expense.categoryId);
  const displayName = expense.merchantName || expense.merchant || expense.title || 'Expense';

  const handleDelete = () => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => {
          deleteExpense(expense.id || expense._id);
          showToast('Expense deleted');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Expense Details"
        onBack={() => navigation.goBack()}
        rightLabel="Delete"
        onRightPress={handleDelete}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main card */}
        <Card style={styles.mainCard}>
          {category && (
            <View style={[styles.catBadge, { backgroundColor: (category.color || COLORS.primary) + '20' }]}>
              <Text style={styles.catIcon}>{category.icon || '💰'}</Text>
              <Text style={[styles.catName, { color: category.color || COLORS.primary }]}>{category.name}</Text>
            </View>
          )}

          <Text style={styles.amount}>{formatINR(expense.amount)}</Text>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.date}>{formatShortDate(expense.transactionDate)}</Text>
        </Card>

        {/* Items breakdown */}
        {expense.items && expense.items.length > 0 && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Items</Text>
            {expense.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.itemName || item.name || `Item ${index + 1}`}
                </Text>
                {item.quantity > 1 && (
                  <Text style={styles.itemQty}>×{item.quantity}</Text>
                )}
                <Text style={styles.itemAmount}>{formatINR(item.amount || item.price || 0)}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Bill image */}
        {expense.billImageUri && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Bill Image</Text>
            <Image
              source={{ uri: expense.billImageUri }}
              style={styles.billImage}
              resizeMode="contain"
            />
          </Card>
        )}

        {/* Notes */}
        {expense.notes && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{expense.notes}</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 15, color: COLORS.textMuted },

  mainCard: { alignItems: 'center', marginBottom: 16, paddingVertical: 24 },
  catBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 14, gap: 6,
  },
  catIcon: { fontSize: 16 },
  catName: { fontSize: 12, fontWeight: '700' },
  amount: { fontSize: 38, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 6 },
  name: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
  date: { fontSize: 13, color: COLORS.textMuted },

  sectionCard: { marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },

  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  itemName: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  itemQty: { fontSize: 12, color: COLORS.textMuted, marginHorizontal: 8 },
  itemAmount: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },

  billImage: { width: '100%', height: 200, borderRadius: 8 },
  notesText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
});

export default ExpenseDetailsScreen;
