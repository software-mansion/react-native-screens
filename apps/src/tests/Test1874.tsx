import React, { useLayoutEffect, useState } from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
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
  SettingDetails: undefined;
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

function SettingsSwitcher({ navigation }: SettingsScreenProps) {
  const { currentValue: headerType, component: headerTypeSetting } =
    useHeaderOptions('header type', 'large', ['large', 'medium', 'small']);
  const { currentValue: headerTitleAlign, component: headerTitleAlignSetting } =
    useHeaderOptions('title align', 'left', ['left', 'center']);
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
      headerTitleAlign,
      headerHideShadow: hideShadow,
      headerShown,
      headerTranslucent,
      headerType,
    });
  }, [
    navigation,
    headerType,
    backgroundColor,
    textColor,
    hideShadow,
    headerShown,
    headerTranslucent,
    headerTitleAlign,
  ]);

  return (
    <View style={styles.settingSection}>
      {headerTypeSetting}
      {headerTitleAlignSetting}
      {bgColorSetting}
      {textColorSetting}
      {hideShadowSetting}
      {headerShownSetting}
      {headerTranslucentSetting}
    </View>
  );
}

function Settings({ navigation }: SettingsScreenProps) {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <WelcomeSection />
      <SettingsSwitcher navigation={navigation} />
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
  const navigation = useNavigation();

  return (
    <>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate('SettingDetails')}>
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

function SettingDetail({ navigation }: SettingsScreenProps): JSX.Element {
  return (
    <View style={styles.settingDetail}>
      <Text style={styles.settingDetailLabel}>I am the detail screen!</Text>
      <SettingsSwitcher navigation={navigation} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
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
            headerRight: navigationWalter,
          }}>
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{
              headerTitle: 'Settings',
              headerType: 'medium',
            }}
          />
          <Stack.Screen
            name="SettingDetails"
            component={SettingDetail}
            options={{
              headerTitle: 'Setting Details',
              headerType: 'small',
            }}
          />
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
  settingDetail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  settingDetailLabel: {
    fontSize: 30,
    marginBottom: 16,
  },
});
