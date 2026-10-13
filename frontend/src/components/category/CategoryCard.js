import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { formatINRShort } from '../../utils/format';

const CategoryCard = ({ category, onPress, showSpent = false }) => {

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const iconBgColor = hexToRgba(category.color || COLORS.primary, 0.15);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.leftContent}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: iconBgColor },
            ]}
          >
            <Text style={styles.icon}>{category.icon}</Text>
          </View>
          <View style={styles.textContent}>
            <Text style={styles.categoryName}>{category.name}</Text>
            {showSpent && (
              <Text style={styles.spent}>
                Spent: {formatINRShort(category.spent || 0)}
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  spent: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
});

export default CategoryCard;
