import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants/colors';

const BarChart = ({ data = [], color = COLORS.primary, title }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value || 0));
  const maxBarHeight = 120;
  const isScrollable = data.length > 7;

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <ScrollView
        horizontal={isScrollable}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={isScrollable}
        style={styles.scrollView}
      >
        <View style={styles.chartContainer}>
          {data.map((item, index) => {
            const barHeight =
              maxValue > 0
                ? (item.value / maxValue) * maxBarHeight
                : 0;

            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>
                    {item.value}
                  </Text>
                </View>
                <View style={styles.barColumn}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={styles.label}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  scrollView: {
    flexGrow: 0,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    gap: 8,
  },
  barWrapper: {
    alignItems: 'center',
    width: 56,
    gap: 4,
  },
  valueContainer: {
    minHeight: 20,
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  barColumn: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyState: {
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default BarChart;
