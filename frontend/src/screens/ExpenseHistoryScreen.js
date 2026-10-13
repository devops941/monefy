import { useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Plus, Inbox } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import ExpenseCard from '../components/expense/ExpenseCard';

const ExpenseHistoryScreen = ({ navigation }) => {
  const { expenses } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses
    .filter((expense) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        expense.merchantName?.toLowerCase().includes(q) ||
        expense.merchant?.toLowerCase().includes(q) ||
        expense.title?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Expense History</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('ManualExpenseEntry')}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#FFF" strokeWidth={2.5} />
          <Text style={styles.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Search size={16} color={COLORS.textMuted} strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
            <X size={16} color={COLORS.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            onPress={() => navigation.navigate('ExpenseDetails', { expenseId: item._id || item.id })}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          filteredExpenses.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Inbox size={52} color={COLORS.textMuted} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No results found' : 'No expenses yet'}
            </Text>
            <Text style={styles.emptySubText}>
              {searchQuery
                ? `No expenses match "${searchQuery}"`
                : 'Scan a bill or add an expense to get started'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
  },
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  listContent: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
  listEmpty: { flex: 1 },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
});

export default ExpenseHistoryScreen;
