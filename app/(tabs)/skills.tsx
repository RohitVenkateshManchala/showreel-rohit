// app/+(tabs)/skills.tsx
import React, { useEffect } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width / 3.8;
const STROKE_WIDTH = 14;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const skills = [
  { name: 'React Native', percent: 94, color: '#00ff9d' },
  { name: 'Reanimated 3', percent: 92, color: '#ff00c8' },
  { name: 'TypeScript', percent: 90, color: '#007acc' },
  { name: 'Zustand', percent: 80, color: '#ffd700' },
  { name: 'Testing', percent: 75, color: '#ff6b6b' },
];

export default function SkillsScreen() {
  const [selected, setSelected] = React.useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Superpowers</Text>
      <View style={styles.grid}>
        {skills.map((skill, index) => (
          <SkillRing key={index} skill={skill} index={index} onPress={() => setSelected(index)} />
        ))}
      </View>

      <DetailModal
        visible={selected !== null}
        skill={selected !== null ? skills[selected] : null}
        onClose={() => setSelected(null)}
      />
    </SafeAreaView>
  );
}

function SkillRing({ skill, index, onPress }: any) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(index * 150, withSpring(1));
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - CIRCUMFERENCE * (skill.percent / 100) * progress.value,
  }));

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.ringContainer}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke="#333"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <AnimatedCircle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke={skill.color}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
        />
      </Svg>
      <View style={styles.label}>
        <Text style={styles.percent}>{skill.percent}%</Text>
        <Text style={styles.name}>{skill.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

function DetailModal({ visible, skill, onClose }: any) {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) scale.value = withSpring(1);
    else scale.value = withSpring(0);
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  if (!skill) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View style={[styles.modal, animatedStyle]}>
          <Text style={styles.modalTitle}>{skill.name}</Text>
          <Text style={styles.modalPercent}>{skill.percent}% Mastery</Text>
          <Text style={styles.modalProof}>
            Built drag-to-dismiss cards, CI/CD pipelines, live on App Store
          </Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 40 },
  header: { fontSize: 32, color: '#fff', fontFamily: 'Inter_900Black', textAlign: 'center', marginBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 30 },
  ringContainer: { alignItems: 'center' },
  label: { position: 'absolute', alignItems: 'center', top: '38%' },
  percent: { fontSize: 28, color: '#fff', fontFamily: 'Inter_700Bold' },
  name: { fontSize: 14, color: '#aaa', marginTop: 30 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#1a1a1a', padding: 32, borderRadius: 28, alignItems: 'center', width: width * 0.85, borderWidth: 1, borderColor:'#444' },
  modalTitle: { fontSize: 36, color: '#fff', fontFamily: 'Inter_900Black' },
  modalPercent: { fontSize: 64, color: '#00ff9d', fontFamily: 'Inter_700Bold', marginVertical: 12 },
  modalProof: { fontSize: 18, color: '#aaa', textAlign: 'center', lineHeight: 26 },
  closeBtn: { marginTop: 32, backgroundColor: '#00ff9d', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 999 },
  closeText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
});