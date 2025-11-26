import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const op1 = useSharedValue(0), y1 = useSharedValue(50);
  const op2 = useSharedValue(0), y2 = useSharedValue(50);
  const op3 = useSharedValue(0), y3 = useSharedValue(50);
  const op4 = useSharedValue(0), y4 = useSharedValue(50);
  const op5 = useSharedValue(0), y5 = useSharedValue(50);

  useEffect(() => {
    op1.value = withDelay(200, withTiming(1, { duration: 800 }));
    y1.value = withDelay(200, withSpring(0));
    op2.value = withDelay(600, withTiming(1, { duration: 800 }));
    y2.value = withDelay(600, withSpring(0));
    op3.value = withDelay(1000, withTiming(1, { duration: 800 }));
    y3.value = withDelay(1000, withSpring(0));
    op4.value = withDelay(1400, withTiming(1, { duration: 800 }));
    y4.value = withDelay(1400, withSpring(0));
    op5.value = withDelay(1800, withTiming(1, { duration: 800 }));
    y5.value = withDelay(1800, withSpring(0));
  }, []);

  const s1 = useAnimatedStyle(() => ({ opacity: op1.value, transform: [{ translateY: y1.value }] }));
  const s2 = useAnimatedStyle(() => ({ opacity: op2.value, transform: [{ translateY: y2.value }] }));
  const s3 = useAnimatedStyle(() => ({ opacity: op3.value, transform: [{ translateY: y3.value }] }));
  const s4 = useAnimatedStyle(() => ({ opacity: op4.value, transform: [{ translateY: y4.value }] }));
  const s5 = useAnimatedStyle(() => ({ opacity: op5.value, transform: [{ translateY: y5.value }] }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.hero}>
        <View style={styles.card}>
          <Animated.Text style={[styles.greeting, s1]}>Hey, I'm</Animated.Text>
          <Animated.Text style={[styles.name, s2]}>ROHIT</Animated.Text>
          <Animated.Text style={[styles.title, s3]}>Senior React Native Engineer</Animated.Text>
          <Animated.Text style={[styles.tagline, s4]}>
            I build butter-smooth 60 fps apps{'\n'}with Reanimated 3 & ship daily
          </Animated.Text>
          <Animated.View style={[styles.pills, s5]}>
            <View style={styles.pill}><Text style={styles.pillText}>Available now</Text></View>
            <View style={[styles.pill, { backgroundColor: '#ffd700' }]}><Text style={styles.pillText}>₹30L+ target</Text></View>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  card: { backgroundColor: 'rgba(30,30,30,0.9)', padding: 44, borderRadius: 36, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  greeting: { fontSize: 28, color: '#888', fontFamily: 'Inter_400Regular' },
  name: { fontSize: 76, color: '#fff', fontFamily: 'Inter_900Black', letterSpacing: -2, marginTop: 8 },
  title: { fontSize: 26, color: '#00ff9d', fontFamily: 'Inter_700Bold', marginTop: 8 },
  tagline: { fontSize: 19, color: '#aaa', textAlign: 'center', lineHeight: 30, marginTop: 28, fontFamily: 'Inter_400Regular' },
  pills: { flexDirection: 'row', gap: 16, marginTop: 40 },
  pill: { backgroundColor: '#00ff9d', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  pillText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});