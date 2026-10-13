import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { formatDayDate, formatINR } from '../utils/format';
import AppHeader from '../components/common/AppHeader';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';

const DailyReportScreen = ({ navigation }) => {
  const { expenses, categories } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayExpenses = (date) => {
    const dateKey = getDateKey(date);
    return expenses.filter((e) => {
      const expenseDate = new Date(e.transactionDate);
      return getDateKey(expenseDate) === dateKey;
    });
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const dayExpenses = getDayExpenses(selectedDate);
  const dailyTotal = dayExpenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );

  const renderExpenseItem = ({ item }) => {
    const category = categories.find((c) => (c._id || c.id) === item.categoryId);

    return (
      <TouchableOpacity
        style={styles.expenseItem}
        onPress={() =>
          navigation.navigate('ExpenseDetails', { expenseId: item.id || item._id })
        }
      >
        <View style={styles.expenseItemLeft}>
          {category && (
            <Text style={styles.expenseIcon}>{category.icon}</Text>
          )}
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseTitle}>{item.title}</Text>
            {item.merchant && (
              <Text style={styles.expenseMerchant}>{item.merchant}</Text>
            )}
          </View>
        </View>
        <Text style={styles.expenseAmount}>
          ₹ {item.amount?.toFixed(2) || '0.00'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Daily Report"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Card style={styles.dateNavigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePreviousDay}
          >
            <Text style={styles.navButtonText}>← Prev</Text>
          </TouchableOpacity>

          <View style={styles.dateDisplay}>
            <Text style={styles.currentDate}>{formatDayDate(selectedDate)}</Text>
          </View>

          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNextDay}
          >
            <Text style={styles.navButtonText}>Next →</Text>
          </TouchableOpacity>
        </Card>

        {dayExpenses.length > 0 ? (
          <>
            <Card style={styles.totalCard}>
              <Text style={styles.totalLabel}>Daily Total</Text>
              <Text style={styles.totalAmount}>
                ₹ {dailyTotal.toFixed(2)}
              </Text>
            </Card>

            <ScrollView
              style={styles.expensesList}
              showsVerticalScrollIndicator={false}
            >
              <FlatList
                data={dayExpenses}
                renderItem={renderExpenseItem}
                keyExtractor={(item) => item.id || item._id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View style={styles.separator} />
                )}
              />
            </ScrollView>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="📅"
              title="No Expenses"
              description={`No expenses recorded for ${formatDayDate(
                selectedDate
              )}`}
            />
          </View>
        )}
      </View>
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
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  currentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  totalCard: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  expensesList: {
    flex: 1,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  expenseItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expenseIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  expenseMerchant: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  separator: {
    height: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DailyReportScreen;
