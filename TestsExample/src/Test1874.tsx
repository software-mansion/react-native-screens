import React from 'react';
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const SETTINGS: Record<
  string,
  {
    emoji: string;
    title: string;
  }
> = {
  Connections: {
    emoji: '📲',
    title: 'Connections',
  },
  LinkedDevices: {
    emoji: '🔗',
    title: 'Linked Devices',
  },
  Procedures: {
    emoji: '📳',
    title: 'Modes and Procedures',
  },
  Sound: {
    emoji: '🎧',
    title: 'Sound and Vibrations',
  },
  Notifications: {
    emoji: '🔔',
    title: 'Notifications',
  },
  Display: {
    emoji: '🖥️',
    title: 'Display',
  },
  Wallpaper: {
    emoji: '🌅',
    title: 'Wallpaper and Styling',
  },
  Themes: {
    emoji: '🏜️',
    title: 'Themes',
  },
  HomeScreen: {
    emoji: '🏠',
    title: 'Home Screen',
  },
  LockScreen: {
    emoji: '🔐',
    title: 'Lock Screen',
  },
  HackerMode: {
    emoji: '🕵',
    title: 'Hacker Mode',
  },
};

function Settings() {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <WelcomeSection />
      {Object.keys(SETTINGS).map(setting => (
        <SettingElement
          emoji={SETTINGS[setting].emoji}
          title={SETTINGS[setting].title}
        />
      ))}
    </ScrollView>
  );
}

function WelcomeSection(): JSX.Element {
  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.settingLabel}>Welcome, Walter!</Text>
      <Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/en/0/03/Walter_White_S5B.png',
          width: 70,
          height: 70,
        }}
        style={styles.welcomeWalter}
      />
    </View>
  );
}

function SettingElement(props: { emoji: string; title: string }): JSX.Element {
  return (
    <View style={styles.settingItem}>
      <Text style={styles.settingLabel}>{props.emoji}</Text>
      <Text style={styles.settingLabel}>{props.title}</Text>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            fullScreenSwipeEnabled: true,
            stackAnimation: 'default',
            customAnimationOnSwipe: true,
            headerLargeTitle: true,
            headerType: 'large',
            // check why this bugs the header x D
            navigationBarColor: 'green',
          }}>
          <Stack.Screen name="First" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

    marginTop: 16,
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'gold',
  },
  welcomeWalter: {
    borderRadius: 50,
  },
  settingItem: {
    flexDirection: 'row',
  },
  settingLabel: {
    fontSize: 20,
  },
});
