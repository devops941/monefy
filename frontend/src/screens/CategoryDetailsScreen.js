import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/common/AppHeader';
import ExpenseCard from '../components/expense/ExpenseCard';
import EmptyState from '../components/common/EmptyState';

const CategoryDetailsScreen = ({ navigation, route }) => {
  const { categoryId } = route.params;
  const { expenses, categories } = useApp();

  const category = categories.find((c) => c.id === categoryId);
  const categoryExpenses = expenses.filter((e) => e.categoryId === categoryId);

  const totalSpent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleExpensePress = (expenseId) => {
    navigation.navigate('ExpenseDetails', { expenseId });
  };

  const renderExpenseCard = ({ item }) => (
    <ExpenseCard
      expense={item}
      onPress={() => handleExpensePress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title={category?.name || 'Category'}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.headerInfo}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>₹{totalSpent.toFixed(2)}</Text>
        <Text style={styles.transactionCount}>
          {categoryExpenses.length} transaction
          {categoryExpenses.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={categoryExpenses}
        renderItem={renderExpenseCard}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="No Expenses"
            message="You haven't added any expenses in this category yet."
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  headerInfo: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  transactionCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

export default CategoryDetailsScreen;
