import React, { useState, useEffect } from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import PressableWithFeedback from '../../shared/PressableWithFeedback';
import { ScrollView, View } from 'react-native';
import Colors from '../../shared/styling/Colors';
import { SettingsPicker, SettingsSwitch } from '../../shared';

type RouteParamList = {
  Home: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator();

interface Configuration {
  size: 'sm' | 'md' | 'lg';
  hidesSharedBackground: boolean;
  hitSlop: '0' | '10' | '30';
  pressRetentionOffset: '0' | '20' | '50';
}

function getPressableFromConfig(config: Configuration) {
  return (
    <PressableWithFeedback
      key={
        config.size +
        '_' +
        config.hidesSharedBackground +
        '_' +
        config.hitSlop +
        '_' +
        config.pressRetentionOffset
      }
      hitSlop={Number(config.hitSlop)}
      pressRetentionOffset={Number(config.pressRetentionOffset)}>
      <View
        style={{
          width: config.size === 'sm' ? 10 : config.size === 'md' ? 36 : 80,
          height: config.size === 'sm' ? 10 : config.size === 'md' ? 36 : 40,
        }}
      />
    </PressableWithFeedback>
  );
}

function Screen({ navigation }: StackNavigationProp) {
  const [config, setConfig] = useState<Configuration>({
    size: 'sm',
    hidesSharedBackground: true,
    hitSlop: '0',
    pressRetentionOffset: '0',
  });

  useEffect(() => {
    navigation.setOptions({
      unstable_headerLeftItems: () => [
        {
          type: 'custom',
          element: getPressableFromConfig(config),
          hidesSharedBackground: config.hidesSharedBackground,
        },
      ],
      unstable_headerRightItems: () => [
        {
          type: 'custom',
          element: getPressableFromConfig(config),
          hidesSharedBackground: config.hidesSharedBackground,
        },
      ],
    });
  }, [config, navigation]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 5 }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 200,
          backgroundColor: Colors.BlueLight60,
        }}>
        {getPressableFromConfig(config)}
      </View>
      <SettingsSwitch
        label="hidesSharedBackground"
        value={config.hidesSharedBackground}
        onValueChange={value =>
          setConfig({ ...config, hidesSharedBackground: value })
        }
      />
      <SettingsPicker<Configuration['size']>
        label="size"
        value={config.size}
        onValueChange={value =>
          setConfig({
            ...config,
            size: value,
          })
        }
        items={['sm', 'md', 'lg']}
      />
      <SettingsPicker<Configuration['hitSlop']>
        label="hitSlop"
        value={config.hitSlop}
        onValueChange={value =>
          setConfig({
            ...config,
            hitSlop: value,
          })
        }
        items={['0', '10', '30']}
      />
      <SettingsPicker<Configuration['pressRetentionOffset']>
        label="pressRetentionOffset"
        value={config.pressRetentionOffset}
        onValueChange={value =>
          setConfig({
            ...config,
            pressRetentionOffset: value,
          })
        }
        items={['0', '20', '50']}
      />
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Screen}
          options={{ title: 'Test Pressables' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
