import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const ITEMS = ['Reanimated 3', 'TypeScript', 'Zustand', 'Expo Router', 'Gesture Handler'];

export default function DragChallenge() {
  const [items, setItems] = useState(ITEMS);

  const swapItems = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];
    setItems(newItems);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.challengeTitle}>Challenge 1: Drag to Reorder</Text>
      {items.map((item, index) => (
        <ListItem key={item} item={item} index={index} items={items} onSwap={swapItems} />
      ))}
    </View>
  );
}

function ListItem({ item, index, items, onSwap }: any) {
  const translateY = useSharedValue(0);
  const context = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: translateY.value !== 0 ? 100 : 0,
    elevation: translateY.value !== 0 ? 10 : 0,
  }));

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = context.value + event.translationY;

      // Simple reorder logic
      const newIndex = Math.floor((translateY.value + 60) / 80);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex));
      if (clampedIndex !== index) {
        runOnJS(onSwap)(index, clampedIndex);
      }
    })
    .onEnd(() => {
      translateY.value = withSpring(0);
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.listItem, animatedStyle]}>
        <Text style={styles.listText}>{item}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 50 },
  challengeTitle: { fontSize: 22, color: '#00ff9d', fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 20 },
  listItem: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    marginHorizontal: 30,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  listText: { fontSize: 18, color: '#fff', fontFamily: 'Inter_700Bold' },
});