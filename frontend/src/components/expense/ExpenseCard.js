import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';
import { formatShortDate, formatINR } from '../../utils/format';

const ExpenseCard = ({ expense, onPress }) => {
  const { categories } = useApp();

  const category = categories.find((c) => (c._id || c.id) === expense.categoryId);

  const displayName =
    expense.merchantName || expense.merchant || expense.title || 'Expense';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: (category?.color || COLORS.primary) + '20' }]}>
          <Text style={styles.icon}>{category?.icon || '💰'}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
          <Text style={styles.meta}>
            {formatShortDate(expense.transactionDate)}
            {category?.name ? ` · ${category.name}` : ''}
          </Text>
        </View>

        <Text style={styles.amount}>{formatINR(expense.amount)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 20 },
  info: { flex: 1, marginRight: 10 },
  name: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
  meta: { fontSize: 12, color: COLORS.textSecondary },
  amount: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
});

export default ExpenseCard;
