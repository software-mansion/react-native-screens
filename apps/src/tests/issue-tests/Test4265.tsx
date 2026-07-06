import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { SafeAreaView } from 'react-native-screens/experimental';

const TILE_SIZE = Math.floor((Dimensions.get('window').width - 24) / 2);

function ImageGrid({ seed }: { seed: number }) {
  const images = Array.from({ length: 30 }, (_, i) => ({
    key: `${seed}-${i}`,
    uri: `https://picsum.photos/seed/${seed * 100 + i}/400/400`,
  }));

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {images.map(img => (
        <Image key={img.key} source={{ uri: img.uri }} style={styles.image} />
      ))}
    </ScrollView>
  );
}

function HomeTab() {
  return (
    <View style={styles.screen}>
      <SafeAreaView edges={{ top: true, bottom: true }}>
        <Text style={styles.description}>
          Recycled bitmap crash reproduction.{'\n\n'}
          Tab icons are loaded via imageSource URLs (picsum.photos) which route
          through ImageLoader.kt / Fresco on Android.{'\n\n'}
          Scroll through the images below to fill Fresco's memory cache. Once
          the cache evicts the small tab-icon bitmaps, the next tab bar redraw
          crashes with "Canvas: trying to use a recycled bitmap".{'\n\n'}
          Switch between tabs and scroll to accelerate eviction.
        </Text>
        <ImageGrid seed={1} />
      </SafeAreaView>
    </View>
  );
}

function SearchTab() {
  return (
    <View style={styles.screen}>
      <SafeAreaView edges={{ top: true, bottom: true }}>
        <ImageGrid seed={2} />
      </SafeAreaView>
    </View>
  );
}

function ProfileTab() {
  return (
    <View style={styles.screen}>
      <SafeAreaView edges={{ top: true, bottom: true }}>
        <ImageGrid seed={3} />
      </SafeAreaView>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Home',
    Component: HomeTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Home',
      ios: {
        icon: { type: 'sfSymbol', name: 'house' },
        selectedIcon: { type: 'sfSymbol', name: 'house.fill' },
      },
      android: {
        icon: {
          type: 'imageSource',
          imageSource: { uri: 'https://picsum.photos/seed/icon1/48/48' },
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: { uri: 'https://picsum.photos/seed/icon1s/48/48' },
        },
      },
    },
  },
  {
    name: 'Search',
    Component: SearchTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Search',
      ios: {
        icon: { type: 'sfSymbol', name: 'magnifyingglass' },
      },
      android: {
        icon: {
          type: 'imageSource',
          imageSource: { uri: 'https://picsum.photos/seed/icon2/48/48' },
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: { uri: 'https://picsum.photos/seed/icon2s/48/48' },
        },
      },
    },
  },
  {
    name: 'Profile',
    Component: ProfileTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Profile',
      ios: {
        icon: { type: 'sfSymbol', name: 'person' },
        selectedIcon: { type: 'sfSymbol', name: 'person.fill' },
      },
      android: {
        icon: {
          type: 'imageSource',
          imageSource: { uri: 'https://picsum.photos/seed/icon3/48/48' },
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: { uri: 'https://picsum.photos/seed/icon3s/48/48' },
        },
      },
    },
  },
];

export default function Test0000() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  description: {
    padding: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
  },
  image: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
});
