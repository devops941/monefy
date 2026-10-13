import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { formatShortDate } from '../utils/format';
import AppHeader from '../components/common/AppHeader';
import Card from '../components/common/Card';

const WeeklyReportScreen = ({ navigation }) => {
  const { expenses } = useApp();

  const getWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek;
    const sunday = new Date(now.setDate(diff));
    const saturday = new Date(now.setDate(diff + 6));
    return { sunday, saturday };
  };

  const { sunday, saturday } = getWeekRange();

  const getWeekExpenses = () =>
    expenses.filter((e) => {
      const expenseDate = new Date(e.transactionDate);
      return expenseDate >= sunday && expenseDate <= saturday;
    });

  const getDayExpenses = (dayOffset) => {
    const day = new Date(sunday);
    day.setDate(day.getDate() + dayOffset);
    const dayKey = day.toISOString().split('T')[0];
    return expenses.filter(
      (e) => new Date(e.transactionDate).toISOString().split('T')[0] === dayKey
    );
  };

  const weekExpenses = getWeekExpenses();
  const weekTotal = weekExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayData = Array.from({ length: 7 }).map((_, idx) => {
    const dayExpenses = getDayExpenses(idx);
    const dayTotal = dayExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    return { label: dayLabels[idx], value: dayTotal };
  });

  const maxValue = Math.max(...dayData.map((d) => d.value), 1);

  const formatDateRange = () =>
    `${formatShortDate(sunday)} - ${formatShortDate(saturday)}`;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Weekly Report"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.weekRangeCard}>
          <Text style={styles.weekRangeLabel}>Week of</Text>
          <Text style={styles.weekRangeDate}>{formatDateRange()}</Text>
        </Card>

        <Card style={styles.totalCard}>
          <Text style={styles.totalLabel}>Weekly Total</Text>
          <Text style={styles.totalAmount}>
            ₹ {weekTotal.toFixed(2)}
          </Text>
          <Text style={styles.transactionCount}>
            {weekExpenses.length} transactions
          </Text>
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Daily Breakdown</Text>

          <View style={styles.chartContainer}>
            {dayData.map((day, idx) => (
              <View key={idx} style={styles.barGroup}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: day.value > 0 ? (day.value / maxValue) * 150 : 5,
                        backgroundColor:
                          day.value > 0 ? COLORS.primary : COLORS.border,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{day.label}</Text>
                <Text style={styles.barValue}>
                  {day.value > 0 ? `₹${day.value.toFixed(0)}` : '-'}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Weekly Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryValue}>₹ {weekTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Average Daily</Text>
            <Text style={styles.summaryValue}>
              ₹ {(weekTotal / 7).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transactions</Text>
            <Text style={styles.summaryValue}>{weekExpenses.length}</Text>
          </View>
        </Card>
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
  weekRangeCard: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
  },
  weekRangeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  weekRangeDate: {
    fontSize: 16,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  transactionCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  chartCard: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 200,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    width: '70%',
    borderRadius: 4,
    minHeight: 5,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});

export default WeeklyReportScreen;
