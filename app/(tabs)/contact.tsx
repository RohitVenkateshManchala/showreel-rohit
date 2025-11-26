import * as Linking from 'expo-linking';
import React, { useEffect } from 'react';
import {
    Dimensions,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ContactScreen() {
    const op1 = useSharedValue(0);
    const op2 = useSharedValue(0);
    const op3 = useSharedValue(0);
    const op4 = useSharedValue(0);

    useEffect(() => {
        op1.value = withDelay(200, withSpring(1));
        op2.value = withDelay(600, withSpring(1));
        op3.value = withDelay(1000, withSpring(1));
        op4.value = withDelay(1400, withSpring(1));
    }, []);

    const s1 = useAnimatedStyle(() => ({ opacity: op1.value, transform: [{ translateY: withSpring(0) }] }));
    const s2 = useAnimatedStyle(() => ({ opacity: op2.value, transform: [{ translateY: withSpring(0) }] }));
    const s3 = useAnimatedStyle(() => ({ opacity: op3.value, transform: [{ translateY: withSpring(0) }] }));
    const s4 = useAnimatedStyle(() => ({ opacity: op4.value, transform: [{ translateY: withSpring(0) }] }));

    const shareApp = async () => {
        try {
            await Share.share({
                message: `Check out Rohit's React Native portfolio → https://github.com/RohitVenkateshManchala/showreel-rohit`,
                url: 'https://github.com/RohitVenkateshManchala/showreel-rohit',
            })
        } catch (error) { }
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>My Journey</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
                <Animated.View style={[styles.timelineItem, s1]}>
                    <View style={styles.dot} />
                    <View style={styles.timelineCard}>
                        <Text style={styles.year}>2023–2025</Text>
                        <Text style={styles.title}>React Native Engineer @ Startup</Text>
                        <Text style={styles.desc}>Shipped 5+ production apps • Led mobile team</Text>
                    </View>
                </Animated.View>
                <Animated.View style={[styles.timelineItem, s2]}>
                    <View style={styles.dot} />
                    <View style={styles.timelineCard}>
                        <Text style={styles.year}>Nov 2025</Text>
                        <Text style={styles.title}>ShowReel RN — This App</Text>
                        <Text style={styles.desc}>Built in 21 days • Reanimated 3 • Live GitHub • AI ready</Text>
                    </View>
                </Animated.View>
                <Animated.View style={[styles.hireSection, s3]}>
                    <Text style={styles.hireTitle}>Available for Hire</Text>
                    <Text style={styles.hireSubtitle}>Senior React Native • ₹30L+ • Immediate joiner</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL('https://wa.me/9198xxxxxxxxxx')}>
                            <Text style={styles.btnText}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL('mailto:rohit@example.com')}>
                            <Text style={styles.btnText}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL('https://linkedin.com/in/yourprofile')}>
                            <Text style={styles.btnText}>LinkedIn</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.shareBtn} onPress={shareApp}>
                        <Text style={styles.shareText}>Share My Portfolio</Text>
                    </TouchableOpacity>

                    <Animated.View style={[styles.qrContainer, s4]}>
                        <Text style={styles.qrText}>Scan to install ShowReel</Text>
                        <QRCode value="https://github.com/RohitVenkateshManchala/showreel-rohit" size={160} color="#fff" backgroundColor="#0a0a0a" />
                    </Animated.View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 30 },
    header: { fontSize: 34, color: '#fff', fontFamily: 'Inter_900Black', textAlign: 'center', marginBottom: 30 },
    timelineItem: { flexDirection: 'row', marginHorizontal: 30, marginVertical: 20 },
    dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#00ff9d', marginRight: 20, marginTop: 6 },
    timelineCard: { flex: 1, backgroundColor: '#1a1a1a', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
    year: { fontSize: 18, color: '#00ff9d', fontFamily: 'Inter_700Bold' },
    title: { fontSize: 20, color: '#fff', fontFamily: 'Inter_700Bold', marginTop: 4 },
    desc: { fontSize: 16, color: '#aaa', marginTop: 6 },
    hireSection: { marginTop: 40, alignItems: 'center' },
    hireTitle: { fontSize: 36, color: '#00ff9d', fontFamily: 'Inter_900Black' },
    hireSubtitle: { fontSize: 18, color: '#aaa', marginTop: 8 },
    buttonRow: { flexDirection: 'row', gap: 16, marginTop: 30 },
    btn: { backgroundColor: '#00ff9d', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 999 },
    btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
    shareBtn: { marginTop: 20, backgroundColor: '#333', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 999 },
    shareText: { color: '#fff', fontWeight: 'bold' },
    qrContainer: { marginTop: 40, alignItems: 'center' },
    qrText: { color: '#aaa', marginBottom: 16, fontSize: 16 },
});