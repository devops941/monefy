import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const Toast = ({ message }) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (message) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [message, opacity]);

  if (!message) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 8,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.card,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.card,
    flex: 1,
  },
});

export default Toast;
