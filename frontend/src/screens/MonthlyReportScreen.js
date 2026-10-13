import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { formatMonthYear } from '../utils/format';
import AppHeader from '../components/common/AppHeader';
import Card from '../components/common/Card';
import BudgetProgressBar from '../components/charts/BudgetProgressBar';

const MonthlyReportScreen = ({ navigation }) => {
  const { expenses, userProfile } = useApp();

  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter((e) => {
      const expenseDate = new Date(e.transactionDate);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });
  };

  const monthExpenses = getCurrentMonthExpenses();
  const monthTotal = monthExpenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );

  const budgetLimit = userProfile?.defaultBudget || 50000;
  const percentageUsed = (monthTotal / budgetLimit) * 100;

  const getRemainingDays = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDay.getDate() - now.getDate();
  };

  const currentMonthName = formatMonthYear(new Date());

  const dailyBudget = budgetLimit / 30;
  const projectedSpend =
    monthTotal + dailyBudget * getRemainingDays();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Monthly Budget Usage"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.budgetCard}>
          <Text style={styles.monthTitle}>{currentMonthName}</Text>

          <View style={styles.budgetInfo}>
            <View style={styles.budgetColumn}>
              <Text style={styles.budgetLabel}>Budget Limit</Text>
              <Text style={styles.budgetValue}>
                ₹ {budgetLimit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.budgetDivider} />
            <View style={styles.budgetColumn}>
              <Text style={styles.budgetLabel}>Amount Spent</Text>
              <Text style={styles.budgetValue}>₹ {monthTotal.toFixed(2)}</Text>
            </View>
          </View>

          <Text style={styles.percentageText}>
            {percentageUsed.toFixed(1)}% Used
          </Text>
        </Card>

        <Card style={styles.progressCard}>
          <BudgetProgressBar
            label="Monthly Budget"
            current={monthTotal}
            max={budgetLimit}
            color={
              percentageUsed > 95
                ? COLORS.danger
                : percentageUsed > 80
                  ? COLORS.warning
                  : COLORS.success
            }
          />
        </Card>

        <Card style={styles.warningCard}>
          {percentageUsed > 95 && (
            <View style={styles.warningContent}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>
                You've exceeded 95% of your monthly budget!
              </Text>
            </View>
          )}
          {percentageUsed > 80 && percentageUsed <= 95 && (
            <View style={styles.warningContent}>
              <Text style={styles.warningIcon}>⚡</Text>
              <Text style={styles.warningText}>
                You're at 80% of your monthly budget. Be cautious!
              </Text>
            </View>
          )}
          {percentageUsed <= 80 && (
            <View style={styles.warningContent}>
              <Text style={styles.warningIcon}>✅</Text>
              <Text style={styles.warningText}>
                You're within budget. Keep it up!
              </Text>
            </View>
          )}
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Month Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryValue}>₹ {monthTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Remaining Budget</Text>
            <Text
              style={[
                styles.summaryValue,
                (budgetLimit - monthTotal) < 0 && styles.negativeValue,
              ]}
            >
              ₹ {Math.max(0, budgetLimit - monthTotal).toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Daily Average</Text>
            <Text style={styles.summaryValue}>
              ₹ {(monthTotal / Math.max(1, new Date().getDate())).toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Projected Spend</Text>
            <Text
              style={[
                styles.summaryValue,
                projectedSpend > budgetLimit && styles.negativeValue,
              ]}
            >
              ₹ {projectedSpend.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transaction Count</Text>
            <Text style={styles.summaryValue}>{monthExpenses.length}</Text>
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
  budgetCard: {
    marginBottom: 16,
    paddingVertical: 20,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetColumn: {
    alignItems: 'center',
    flex: 1,
  },
  budgetDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  budgetLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  progressCard: {
    marginBottom: 16,
    paddingVertical: 16,
  },
  warningCard: {
    marginBottom: 16,
    paddingVertical: 12,
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  warningText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    flexWrap: 'wrap',
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
    paddingVertical: 10,
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
  negativeValue: {
    color: COLORS.danger,
  },
});

export default MonthlyReportScreen;
