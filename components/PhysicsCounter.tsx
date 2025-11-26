import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { clamp, useSharedValue, withDecay } from 'react-native-reanimated';

export default function PhysicsCounter() {
  const count = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      count.value = clamp(count.value - e.velocityY / 20, 0, 1000);
    })
    .onEnd((e) => {
      count.value = withDecay({
        velocity: -e.velocityY / 20,
        clamp: [0, 1000],
      });
    });

  return (
    <View style={styles.section}>
      <Text style={styles.challengeTitle}>Challenge 3: Physics Counter</Text>
      <GestureDetector gesture={pan}>
        <View style={styles.counterBox}>
          <Animated.Text style={styles.counterText}>
            {count.value.toFixed(0)}
          </Animated.Text>
          <Text style={styles.swipeText}>↑↓ Swipe fast to see physics!</Text>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 50, alignItems: 'center' },
  challengeTitle: { fontSize: 22, color: '#00ff9d', fontFamily: 'Inter_700Bold', marginBottom: 20 },
  counterBox: { backgroundColor: '#1a1a1a', padding: 60, borderRadius: 32, borderWidth: 1, borderColor: '#333' },
  counterText: { fontSize: 72, color: '#00ff9d', fontFamily: 'Inter_900Black', textAlign: 'center' },
  swipeText: { fontSize: 16, color: '#aaa', textAlign: 'center', marginTop: 20 },
});