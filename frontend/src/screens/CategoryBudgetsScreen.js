import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/common/AppHeader';
import Card from '../components/common/Card';
import BudgetProgressBar from '../components/charts/BudgetProgressBar';

const CategoryBudgetsScreen = ({ navigation }) => {
  const { categories, expenses, updateCategory } = useApp();

  const getCategorySpent = (categoryId) => {
    return expenses
      .filter((e) => e.categoryId === categoryId)
      .reduce((sum, e) => sum + (e.amount || 0), 0);
  };

  const getCategoryColor = (categoryColor) => {
    const colorMap = {
      '#3563E9': COLORS.primary,
      '#14B8A6': COLORS.teal,
      '#8B5CF6': COLORS.purple,
      '#EC4899': COLORS.pink,
      '#06B6D4': COLORS.cyan,
      '#F59E0B': COLORS.amber,
    };
    return colorMap[categoryColor] || COLORS.primary;
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Category Budgets"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {categories.length > 0 ? (
          categories.map((category) => {
            const spent = getCategorySpent(category.id);
            const budgetLimit = category.budget || 5000;
            const color = getCategoryColor(category.color);

            return (
              <Card key={category.id} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <Text style={styles.categoryBudgetLabel}>
                    ₹ {budgetLimit.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <BudgetProgressBar
                    label={category.name}
                    current={spent}
                    max={budgetLimit}
                    color={color}
                  />
                </View>

                <View style={styles.categoryStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Spent</Text>
                    <Text style={styles.statValue}>
                      ₹ {spent.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Remaining</Text>
                    <Text
                      style={[
                        styles.statValue,
                        (budgetLimit - spent) < 0 &&
                          styles.statValueNegative,
                      ]}
                    >
                      ₹ {Math.max(0, budgetLimit - spent).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Usage</Text>
                    <Text
                      style={[
                        styles.statValue,
                        (spent / budgetLimit) * 100 > 100 &&
                          styles.statValueNegative,
                      ]}
                    >
                      {((spent / budgetLimit) * 100).toFixed(0)}%
                    </Text>
                  </View>
                </View>

                {spent > budgetLimit && (
                  <View style={styles.warningBanner}>
                    <Text style={styles.warningIcon}>⚠️</Text>
                    <Text style={styles.warningText}>
                      Budget exceeded by ₹ {(spent - budgetLimit).toFixed(2)}
                    </Text>
                  </View>
                )}

                {(spent / budgetLimit) * 100 > 80 &&
                  spent <= budgetLimit && (
                    <View style={styles.cautionBanner}>
                      <Text style={styles.cautionIcon}>⚡</Text>
                      <Text style={styles.cautionText}>
                        {Math.round(100 - (spent / budgetLimit) * 100)}% of
                        budget remaining
                      </Text>
                    </View>
                  )}
              </Card>
            );
          })
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No categories found. Create categories in Category Management.
            </Text>
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
    paddingTop: 16,
  },
  categoryCard: {
    marginBottom: 16,
    paddingVertical: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  categoryBudgetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: COLORS.bg,
    borderRadius: 8,
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statValueNegative: {
    color: COLORS.danger,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  warningIcon: {
    fontSize: 16,
  },
  warningText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '500',
    flex: 1,
  },
  cautionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  cautionIcon: {
    fontSize: 16,
  },
  cautionText: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '500',
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default CategoryBudgetsScreen;
