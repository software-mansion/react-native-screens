import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import ConfigWrapperContext, {
  type Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';
import {
  BottomTabsContainer,
  type TabConfiguration,
} from '../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import {
  ColorValue,
  Pressable,
  PressableProps,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SettingsPicker, SettingsSwitch } from '../shared';
import Colors from '../shared/styling/Colors';
import PressableWithFeedback from '../shared/PressableWithFeedback';
import { TabBarMinimizeBehavior } from 'react-native-screens';
import { BottomTabsAccessoryEnvironment } from 'react-native-screens/components/bottom-tabs/BottomTabsAccessory.types';
import { NavigationContainer } from '@react-navigation/native';

type BottomAccessoryConfig = {
  shown: boolean;
  backgroundColor: ColorValue;
  shouldAdaptToEnvironment: boolean;
  tabBarMinimizeBehavior: TabBarMinimizeBehavior;
};

type BottomAccessoryContextInterface = {
  config: BottomAccessoryConfig;
  setConfig: Dispatch<SetStateAction<BottomAccessoryConfig>>;
};

const DEFAULT_BOTTOM_ACCESSORY_CONFIG: BottomAccessoryConfig = {
  shown: true,
  backgroundColor: 'transparent',
  shouldAdaptToEnvironment: true,
  tabBarMinimizeBehavior: 'onScrollDown',
};

const BottomAccessoryContext =
  createContext<BottomAccessoryContextInterface | null>(null);

const useBottomAccessoryContext = () => {
  const bottomAccessoryContext = useContext(BottomAccessoryContext);

  if (!bottomAccessoryContext) {
    throw new Error(
      'useBottomAccessoryContext has to be used within <BottomAccessoryContext.Provider>',
    );
  }

  return bottomAccessoryContext;
};

function Config() {
  const { config, setConfig } = useBottomAccessoryContext();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 5 }}>
      <SettingsSwitch
        label="shown"
        value={config.shown}
        onValueChange={value => setConfig({ ...config, shown: value })}
      />
      <SettingsPicker<string>
        label="backgroundColor"
        value={String(config.backgroundColor)}
        onValueChange={value =>
          setConfig({
            ...config,
            backgroundColor: value,
          })
        }
        items={['transparent', Colors.NavyLightTransparent, Colors.BlueLight80]}
      />
      <SettingsSwitch
        label="shouldAdaptToEnvironment"
        value={config.shouldAdaptToEnvironment}
        onValueChange={value =>
          setConfig({ ...config, shouldAdaptToEnvironment: value })
        }
      />
      <SettingsPicker<TabBarMinimizeBehavior>
        label="tabBarMinimizeBehavior"
        value={config.tabBarMinimizeBehavior}
        onValueChange={value =>
          setConfig({
            ...config,
            tabBarMinimizeBehavior: value,
          })
        }
        items={['automatic', 'onScrollDown', 'onScrollUp', 'never']}
      />
    </ScrollView>
  );
}

function TestScreen() {
  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        height: 'auto',
        gap: 15,
        paddingHorizontal: 30,
      }}>
      {[...Array(50).keys()].map(index => (
        <PressableWithFeedback
          key={index + 1}
          onPress={() => console.log(`Pressed #${index + 1}`)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          <Text>Pressable #{index + 1}</Text>
        </PressableWithFeedback>
      ))}
    </ScrollView>
  );
}

const TAB_CONFIGS: TabConfiguration[] = [
  {
    tabScreenProps: {
      tabKey: 'Tab1',
      title: 'Config',
      icon: {
        ios: {
          type: 'sfSymbol',
          name: 'gear',
        },
      },
    },
    component: Config,
  },
  {
    tabScreenProps: {
      tabKey: 'Tab2',
      title: 'Test',
      icon: {
        ios: {
          type: 'sfSymbol',
          name: 'rectangle.stack',
        },
      },
    },
    component: TestScreen,
  },
];

function getBottomAccessory(
  environment: BottomTabsAccessoryEnvironment,
  config: BottomAccessoryConfig,
) {
  const pressableStyle: PressableProps['style'] = ({ pressed }) => ({
    shadowColor: '#000',
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowOpacity: pressed ? 0.9 : 0.0,
    shadowRadius: 2,
    transform: pressed ? [{ scale: 1.1 }] : [],
  });
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
        },
      ]}>
      <View style={styles.left}>
        <View style={styles.cover} />
        <View style={styles.data}>
          <Text style={styles.title} numberOfLines={1}>
            Never Gonna Give You Up
          </Text>
          <Text style={styles.author}>Rick Astley</Text>
        </View>
      </View>

      <View style={styles.right}>
        {(environment === 'regular' || !config.shouldAdaptToEnvironment) && (
          <Pressable
            onPress={() => console.log('You know the rules and so do I')}
            style={pressableStyle}>
            <Text style={{ fontSize: 28 }}>♫</Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => console.log("We're no strangers to love")}
          style={pressableStyle}>
          <Text style={{ fontSize: 30 }}>▶</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Tabs() {
  const [config, setConfig] = React.useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );

  const { config: bottomAccessoryConfig } = useBottomAccessoryContext();

  return (
    <ConfigWrapperContext.Provider
      value={{
        config,
        setConfig,
      }}>
      <BottomTabsContainer
        tabConfigs={TAB_CONFIGS}
        tabBarMinimizeBehavior={bottomAccessoryConfig.tabBarMinimizeBehavior}
        tabAccessory={
          bottomAccessoryConfig.shown
            ? environment =>
                getBottomAccessory(environment, bottomAccessoryConfig)
            : undefined
        }
      />
    </ConfigWrapperContext.Provider>
  );
}

function App() {
  const [bottomAccessoryConfig, setBottomAccessoryConfig] =
    useState<BottomAccessoryConfig>(DEFAULT_BOTTOM_ACCESSORY_CONFIG);

  return (
    <NavigationContainer>
      <BottomAccessoryContext.Provider
        value={{
          config: bottomAccessoryConfig,
          setConfig: setBottomAccessoryConfig,
        }}>
        <Tabs />
      </BottomAccessoryContext.Provider>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
  },
  cover: { backgroundColor: 'pink', width: 30, height: 30 },
  data: { flex: 1, paddingRight: 5 },
  title: { fontWeight: 'bold' },
  author: { fontSize: 10, color: 'gray' },
  right: {
    flex: 0,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingRight: 10,
  },
});
