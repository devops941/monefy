import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const AppHeader = ({ title, onBack, rightLabel, onRightPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.leftSection}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          {rightLabel && onRightPress && (
            <TouchableOpacity
              onPress={onRightPress}
              activeOpacity={0.7}
            >
              <Text style={styles.rightLabel}>{rightLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    paddingRight: 12,
  },
  backArrow: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  centerSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default AppHeader;
