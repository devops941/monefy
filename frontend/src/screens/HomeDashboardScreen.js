import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Camera, PenLine, BarChart2, Inbox } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { formatLongDate, formatINRShort, formatINR } from '../utils/format';
import ExpenseCard from '../components/expense/ExpenseCard';

const HomeDashboardScreen = ({ navigation }) => {
  const { expenses, userProfile, user } = useApp();

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthlyExpenses = expenses.filter((expense) => {
    const d = new Date(expense.transactionDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpent = monthlyExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const budgetLimit = userProfile?.defaultBudget || userProfile?.monthlyBudget || 50000;
  const spentPercentage = budgetLimit > 0 ? Math.min((totalSpent / budgetLimit) * 100, 100) : 0;

  const recentExpenses = [...monthlyExpenses]
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .slice(0, 3);

  const getGreeting = () => {
    const h = today.getHours();
    if (h < 12) return { text: 'Good Morning', emoji: '☀️' };
    if (h < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
    return { text: 'Good Evening', emoji: '🌙' };
  };

  const { text: greetingText, emoji: greetingEmoji } = getGreeting();
  const displayName = user?.name || userProfile?.name || 'User';

  const quickActions = [
    { label: 'Scan Bill',    Icon: Camera,   color: '#3563E9', bg: '#EFF6FF', onPress: () => navigation.navigate('Scan') },
    { label: 'Manual Entry', Icon: PenLine,  color: '#7E22CE', bg: '#FDF4FF', onPress: () => navigation.navigate('ManualExpenseEntry') },
    { label: 'Analytics',   Icon: BarChart2, color: '#0369A1', bg: '#F0F9FF', onPress: () => navigation.navigate('Reports') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingRow}>
            <View style={styles.greetingBadge}>
              <Text style={styles.greetingEmoji}>{greetingEmoji}</Text>
              <Text style={styles.greetingBadgeText}>{greetingText}</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => navigation.navigate('Settings')}
            >
              <Settings size={20} color={COLORS.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <Text style={styles.dateText}>{formatLongDate(today)}</Text>
          <Text style={styles.greeting}>
            Hello, <Text style={styles.greetingName}>{displayName}</Text>!
          </Text>
        </View>

        {/* Spending Card */}
        <View style={styles.spendingCard}>
          <Text style={styles.spendingLabel}>Total Spent This Month</Text>
          <Text style={styles.spendingAmount}>{formatINR(totalSpent)}</Text>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Budget: {formatINRShort(budgetLimit)}</Text>
            <Text style={styles.budgetPct}>{spentPercentage.toFixed(1)}% used</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${spentPercentage}%`,
                  backgroundColor: spentPercentage > 80 ? '#FCA5A5' : '#93C5FD',
                },
              ]}
            />
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>
              {formatINRShort(Math.max(budgetLimit - totalSpent, 0))} remaining
            </Text>
            <View style={[styles.statusPill, { backgroundColor: spentPercentage > 80 ? '#FCA5A5' : '#86EFAC' }]}>
              <Text style={[styles.statusText, { color: spentPercentage > 80 ? '#7F1D1D' : '#14532D' }]}>
                {spentPercentage > 80 ? 'High spend' : 'On track'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {quickActions.map(({ label, Icon, color, bg, onPress }) => (
              <TouchableOpacity key={label} style={[styles.actionBtn, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.8}>
                <View style={[styles.actionIconBox, { backgroundColor: color + '22' }]}>
                  <Icon size={22} color={color} strokeWidth={2} />
                </View>
                <Text style={[styles.actionLabel, { color }]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense) => (
              <ExpenseCard
                key={expense._id || expense.id}
                expense={expense}
                onPress={() => navigation.navigate('ExpenseDetails', { expenseId: expense.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Inbox size={48} color={COLORS.textMuted} strokeWidth={1.5} />
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubText}>Scan a bill or add an expense to get started</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },

  header: { marginBottom: 20 },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  greetingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primaryLight, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
  },
  greetingEmoji: { fontSize: 16 },
  greetingBadgeText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  settingsBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  dateText: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 },
  greeting: { fontSize: 26, fontWeight: '700', color: COLORS.textPrimary },
  greetingName: { color: COLORS.primary },

  spendingCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 20, padding: 20, marginBottom: 24,
  },
  spendingLabel: { fontSize: 13, color: '#BFDBFE', marginBottom: 6 },
  spendingAmount: { fontSize: 38, fontWeight: '900', color: '#FFF', marginBottom: 16 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  budgetLabel: { fontSize: 12, color: '#93C5FD' },
  budgetPct: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  progressTrack: {
    height: 8, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4, overflow: 'hidden', marginBottom: 16,
  },
  progressFill: { height: '100%', borderRadius: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardFooterText: { fontSize: 13, color: '#BFDBFE' },
  statusPill: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, borderRadius: 14, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  actionIconBox: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  actionLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },

  emptyState: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 36,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  emptyText: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginTop: 12, marginBottom: 6 },
  emptySubText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
});

export default HomeDashboardScreen;
