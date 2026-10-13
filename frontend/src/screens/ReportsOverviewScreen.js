import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, CalendarDays, BarChart2, Clock, ArrowRight } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import Card from '../components/common/Card';
import AppButton from '../components/common/AppButton';

const ReportsOverviewScreen = ({ navigation }) => {
  const { expenses, categories } = useApp();
  const [activeTab, setActiveTab] = useState('monthly');

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

  const getLastMonthExpenses = () => {
    const now = new Date();
    const lastMonth = now.getMonth() - 1;
    const lastMonthYear =
      lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
    const adjustedLastMonth = lastMonth < 0 ? 11 : lastMonth;

    return expenses.filter((e) => {
      const expenseDate = new Date(e.transactionDate);
      return (
        expenseDate.getMonth() === adjustedLastMonth &&
        expenseDate.getFullYear() === lastMonthYear
      );
    });
  };

  const currentMonthExpenses = getCurrentMonthExpenses();
  const lastMonthExpenses = getLastMonthExpenses();

  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );
  const lastMonthTotal = lastMonthExpenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );

  const monthlyChange =
    lastMonthTotal === 0
      ? 0
      : ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

  const knownCatIds = new Set(categories.map((c) => c._id || c.id).filter(Boolean));

  const rows = categories.map((cat) => {
    const catId = cat._id || cat.id;
    const total = currentMonthExpenses
      .filter((e) => e.categoryId === catId)
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    return { name: cat.name, icon: cat.icon || '📦', value: total, color: cat.color || COLORS.primary };
  });

  const uncategorizedTotal = currentMonthExpenses
    .filter((e) => !knownCatIds.has(e.categoryId))
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  if (uncategorizedTotal > 0) {
    rows.push({ name: 'Uncategorized', icon: '❓', value: uncategorizedTotal, color: '#94A3B8' });
  }

  const categoryBreakdown = rows
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Reports Overview</Text>

        <View style={styles.tabContainer}>
          {['daily', 'weekly', 'monthly'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === tab && styles.tabButtonTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'monthly' && (
          <>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Monthly Total</Text>
              <Text style={styles.summaryAmount}>
                ₹ {currentMonthTotal.toFixed(2)}
              </Text>
              <View style={styles.comparisonBadge}>
                <View style={styles.comparisonRow}>
                  {monthlyChange > 0
                    ? <TrendingUp size={14} color={COLORS.danger} strokeWidth={2} />
                    : <TrendingDown size={14} color={COLORS.success} strokeWidth={2} />
                  }
                  <Text style={[styles.comparisonText, monthlyChange > 0 && styles.comparisonNegative]}>
                    {' '}{Math.abs(monthlyChange).toFixed(0)}%
                  </Text>
                </View>
                <Text style={styles.comparisonLabel}>vs last month</Text>
              </View>
            </Card>

            {categoryBreakdown.length > 0 && (
              <Card style={styles.chartCard}>
                <Text style={styles.chartTitle}>Category Breakdown</Text>
                <View style={styles.mockChart}>
                  {categoryBreakdown.map((cat, idx) => (
                    <View key={idx} style={styles.chartRow}>
                      <Text style={styles.chartIcon}>{cat.icon}</Text>
                      <Text style={styles.chartLabel}>{cat.name}</Text>
                      <View style={styles.chartBarContainer}>
                        <View
                          style={[
                            styles.chartBar,
                            {
                              width: `${Math.min(
                                (cat.value /
                                  Math.max(...categoryBreakdown.map((c) => c.value))) *
                                  100,
                                100
                              )}%`,
                              backgroundColor: cat.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.chartValue}>
                        ₹ {cat.value.toFixed(0)}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            <View style={styles.navigationButtons}>
              {[
                { label: 'Daily Report',   Icon: Clock,        route: 'DailyReport'   },
                { label: 'Weekly Report',  Icon: CalendarDays, route: 'WeeklyReport'  },
                { label: 'Monthly Report', Icon: BarChart2,    route: 'MonthlyReport' },
              ].map(({ label, Icon, route }) => (
                <TouchableOpacity
                  key={route}
                  style={styles.navBtn}
                  onPress={() => navigation.navigate(route)}
                  activeOpacity={0.7}
                >
                  <View style={styles.navBtnLeft}>
                    <Icon size={18} color={COLORS.primary} strokeWidth={2} />
                    <Text style={styles.navBtnText}>{label}</Text>
                  </View>
                  <ArrowRight size={16} color={COLORS.primary} strokeWidth={2} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {activeTab === 'daily' && (
          <Card style={styles.messageCard}>
            <BarChart2 size={32} color={COLORS.primary} strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <Text style={styles.messageText}>Go to Daily Report to view today's expenses.</Text>
            <AppButton
              title="View Daily Report"
              onPress={() => navigation.navigate('DailyReport')}
              variant="primary"
              style={styles.messageButton}
            />
          </Card>
        )}

        {activeTab === 'weekly' && (
          <Card style={styles.messageCard}>
            <BarChart2 size={32} color={COLORS.primary} strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <Text style={styles.messageText}>Go to Weekly Report to view this week's expenses.</Text>
            <AppButton
              title="View Weekly Report"
              onPress={() => navigation.navigate('WeeklyReport')}
              variant="primary"
              style={styles.messageButton}
            />
          </Card>
        )}
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
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tabButtonTextActive: {
    color: COLORS.card,
  },
  summaryCard: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 24,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  comparisonBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  comparisonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  comparisonNegative: {
    color: COLORS.danger,
  },
  comparisonLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  chartCard: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  mockChart: {
    gap: 12,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartIcon: {
    fontSize: 16,
    width: 22,
  },
  chartLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 54,
  },
  chartBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    borderRadius: 4,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    width: 70,
    textAlign: 'right',
  },
  navigationButtons: {
    gap: 10,
    marginBottom: 24,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  navBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  messageButton: {
    marginTop: 12,
  },
});

export default ReportsOverviewScreen;
