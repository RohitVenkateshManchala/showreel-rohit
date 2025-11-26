import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.4;

const images = [
  'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
  'https://images.unsplash.com/photo-1545239351-1141cdc85e8a?w=800',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
];

export default function ParallaxChallenge() {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View style={styles.section}>
      <Text style={styles.challengeTitle}>Challenge 2: Parallax Carousel</Text>
      <Animated.FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH];
          const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], 'clamp');
          const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], 'clamp');

          return (
            <View style={{ width: ITEM_WIDTH, paddingHorizontal: 12 }}>
              <Animated.Image
                source={{ uri: item }}
                style={[styles.image, { transform: [{ scale }], opacity }]}
                resizeMode="cover"
              />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 50 },
  challengeTitle: { fontSize: 22, color: '#00ff9d', fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 20 },
  image: { width: '100%', height: ITEM_HEIGHT, borderRadius: 24 },
});