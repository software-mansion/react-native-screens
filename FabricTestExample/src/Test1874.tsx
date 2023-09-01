import React, { useLayoutEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

interface SettingProps {
  emoji: string;
  title: string;
}

const CONNECTION_SETTINGS: Record<string, SettingProps> = {
  Connections: {
    emoji: '📲',
    title: 'Connections',
  },
  LinkedDevices: {
    emoji: '🔗',
    title: 'Linked Devices',
  },
};

const MEDIA_SETTINGS: Record<string, SettingProps> = {
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
};

const SCREEN_SETTINGS: Record<string, SettingProps> = {
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

type StackParamList = {
  Settings: undefined;
};

interface SettingsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Settings'>;
}

function useHeaderOptions(
  label: string,
  defaultValue: string | number | boolean,
  valuesList: Array<string | number | boolean>,
) {
  const [currentValue, setCurrentValue] = useState<any>(defaultValue);

  const component = (
    <TouchableOpacity
      style={{ padding: 8 }}
      onPress={() => {
        let nextValue = valuesList[0];
        if (valuesList.indexOf(currentValue) < valuesList.length - 1) {
          nextValue = valuesList[valuesList.indexOf(currentValue) + 1];
        }

        setCurrentValue(nextValue);
      }}>
      <Text>
        {label}: {currentValue.toString()}
      </Text>
    </TouchableOpacity>
  );
  return { currentValue, component };
}

function Settings({ navigation }: SettingsScreenProps) {
  const { currentValue: backgroundColor, component: bgColorSetting } =
    useHeaderOptions('background color', 'white', [
      'white',
      'green',
      'red',
      'yellow',
    ]);
  const { currentValue: textColor, component: textColorSetting } =
    useHeaderOptions('text color', 'black', [
      'black',
      'pink',
      'purple',
      'magenta',
    ]);
  const { currentValue: hideShadow, component: hideShadowSetting } =
    useHeaderOptions('hide shadow', false, [false, true]);
  const { currentValue: headerShown, component: headerShownSetting } =
    useHeaderOptions('header shown', true, [true, false]);
  const {
    currentValue: headerTranslucent,
    component: headerTranslucentSetting,
  } = useHeaderOptions('header translucent', false, [false, true]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor },
      headerTitleStyle: { color: textColor },
      headerHideShadow: hideShadow,
      headerShown,
      headerTranslucent,
    });
  }, [
    navigation,
    backgroundColor,
    textColor,
    hideShadow,
    headerShown,
    headerTranslucent,
  ]);

  return (
    <ScrollView nestedScrollEnabled={true}>
      <WelcomeSection />
      <View style={styles.settingSection}>
        {bgColorSetting}
        {textColorSetting}
        {hideShadowSetting}
        {headerShownSetting}
        {headerTranslucentSetting}
      </View>
      <View style={styles.settingSection}>
        {Object.values(CONNECTION_SETTINGS).map((setting, i) => (
          <SettingElement
            key={i}
            emoji={setting.emoji}
            title={setting.title}
            isLast={i === Object.keys(CONNECTION_SETTINGS).length - 1}
          />
        ))}
      </View>
      <View style={styles.settingSection}>
        {Object.values(MEDIA_SETTINGS).map((setting, i) => (
          <SettingElement
            key={i}
            emoji={setting.emoji}
            title={setting.title}
            isLast={i === Object.keys(MEDIA_SETTINGS).length - 1}
          />
        ))}
      </View>
      <View style={styles.settingSection}>
        {Object.values(SCREEN_SETTINGS).map((setting, i) => (
          <SettingElement
            key={i}
            emoji={setting.emoji}
            title={setting.title}
            isLast={i === Object.keys(SCREEN_SETTINGS).length - 1}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function WelcomeSection(): JSX.Element {
  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.settingLabel}>Welcome, Walter!</Text>
      <Walter size={70} />
    </View>
  );
}

function SettingElement({
  emoji,
  title,
  isLast,
}: {
  emoji: string;
  title: string;
  isLast: boolean;
}): JSX.Element {
  return (
    <>
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingLabel}>{emoji}</Text>
        <Text style={styles.settingLabel}>{title}</Text>
      </TouchableOpacity>
      {!isLast && (
        <View style={{ alignItems: 'center' }}>
          <View style={styles.settingSeparator} />
        </View>
      )}
    </>
  );
}

const Walter = ({ size }: { size: number }): JSX.Element => (
  <Image
    source={{
      uri: 'https://upload.wikimedia.org/wikipedia/en/0/03/Walter_White_S5B.png',
      width: size,
      height: size,
    }}
    style={styles.welcomeWalter}
  />
);

export default function App() {
  const navigationWalter = () => <Walter size={32} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerLargeTitle: true, // fallback for iOS
            headerType: 'large',
            headerRight: navigationWalter,
          }}>
          <Stack.Screen name="Settings" component={Settings} />
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
  settingSection: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'thistle',
  },
  settingItem: {
    flexDirection: 'row',
  },
  settingSeparator: {
    width: '75%',
    height: 1,
    backgroundColor: 'black',
    marginVertical: 16,
  },
  settingLabel: {
    fontSize: 20,
    marginRight: 16,
  },
});
