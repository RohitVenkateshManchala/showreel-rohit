import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const GITHUB_USERNAME = 'RohitVenkateshManchala';

export default function ProjectScreen() {
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollY = useSharedValue(0);

    useEffect(() => {
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`)
            .then(res => res.json())
            .then(data => {
                console.log(data,"Datatatatat");
                
                setRepos(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            })
    }, []);

    const memoizedRepos = useMemo(() => repos, [repos]);

   if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00ff9d" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Projects</Text>
      <FlatList
        data={memoizedRepos}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <ProjectCard repo={item} index={index} scrollY={scrollY} />
        )}
      />
    </SafeAreaView>
  );
}

function ProjectCard({ repo, index, scrollY }: any) {
  const animatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(scrollY.value, [0, 1000], [0, index % 2 === 0 ? 3 : -3]);
    return {
      transform: [{ rotateZ: `${rotateZ}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => Linking.openURL(repo.html_url)}
        style={styles.cardInner}
      >
        <View style={styles.headerRow}>
          <Text style={styles.repoName}>{repo.name}</Text>
          <Text style={styles.stars}>⭐ {repo.stargazers_count}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {repo.description || 'No description'}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.language}>{repo.language || 'Unknown'}</Text>
          <Text style={styles.updated}>
            Updated {new Date(repo.updated_at).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 40 },
    header: { fontSize: 32, color: '#fff', fontFamily: 'Inter_900Black', textAlign: 'center', marginBottom: 20 },
    card: { marginHorizontal: 20, marginVertical: 10 },
    cardInner: {
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    repoName: { fontSize: 20, color: '#fff', fontFamily: 'Inter_700Bold' },
    stars: { fontSize: 18, color: '#ffd700' },
    description: { fontSize: 16, color: '#aaa', marginTop: 8 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    language: { fontSize: 14, color: '#00ff9d' },
    updated: { fontSize: 14, color: '#888' },
});