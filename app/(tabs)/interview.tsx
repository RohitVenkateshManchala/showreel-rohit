import DragChallenge from '@/components/DragChallenge';
import ParallaxChallenge from '@/components/ParallaxChallenge';
import PhysicsCounter from '@/components/PhysicsCounter';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function InterviewScreen() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.header}>Live Interview Challenges</Text>
                <Text style={styles.subtitle}>Tap & play with my Reanimated 3 skills</Text>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                    <DragChallenge />
                    <ParallaxChallenge />
                    <PhysicsCounter />
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 30 },
    header: { fontSize: 34, color: '#fff', fontFamily: 'Inter_900Black', textAlign: 'center' },
    subtitle: { fontSize: 18, color: '#00ff9d', textAlign: 'center', marginTop: 10, marginBottom: 30 },
});

