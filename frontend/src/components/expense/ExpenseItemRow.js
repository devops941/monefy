import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { formatINR } from '../../utils/format';

const ExpenseItemRow = ({ item }) => {
  const { itemName, quantity, unitPrice, amount } = item;

  return (
    <View style={styles.row}>
      <Text style={styles.itemName} numberOfLines={1}>
        {itemName}
      </Text>
      <Text style={styles.quantity}>
        {quantity}x
      </Text>
      <Text style={styles.unitPrice}>
        {formatINR(unitPrice)}
      </Text>
      <Text style={styles.amount}>
        {formatINR(amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  quantity: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: 'center',
  },
  unitPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginHorizontal: 8,
    minWidth: 50,
    textAlign: 'right',
  },
  amount: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'right',
    minWidth: 60,
  },
});

export default ExpenseItemRow;
