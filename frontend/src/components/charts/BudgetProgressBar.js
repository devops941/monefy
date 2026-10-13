import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { formatINRShort } from '../../utils/format';

const BudgetProgressBar = ({
  label,
  current,
  max,
  color = COLORS.primary,
  showAmount = false,
}) => {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percentage}>
          {Math.round(percentage)}%
        </Text>
      </View>

      <View style={styles.barWrapper}>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${percentage}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>

      {showAmount && (
        <Text style={styles.amount}>
          {formatINRShort(current)} / {formatINRShort(max)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  barWrapper: {
    marginBottom: 8,
  },
  barTrack: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  amount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
});

export default BudgetProgressBar;
