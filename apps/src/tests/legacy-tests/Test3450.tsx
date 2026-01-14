import * as React from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable } from 'react-native';
import {
  createStaticNavigation,
  CommonActions,
  NavigationIndependentTree,
  NavigationContainer,
  StackActions,
} from '@react-navigation/native';
import { createStackNavigator, StackAnimationName, StackNavigationOptions } from '@react-navigation/stack';
import { SettingsPicker, SettingsSwitch } from '../../shared';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../../shared/styling/Colors';
import { Button } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

// #region Types

interface StackScreenConfig {
  title: string;
  presentation: Exclude<StackNavigationOptions['presentation'], undefined>;
  animation: StackAnimationName;
  detachPreviousScreen: boolean;
}

interface TabScreenConfig {
  title: string;
  screens: StackScreenConfig[];
}

interface SettableConfigContext<T> {
  config: T;
  setConfig: React.Dispatch<React.SetStateAction<T>>;
}

interface SingleItemConfigProps<T> {
  config: T;
  setItemConfig: (config: T) => void;
}

type TestRoutes = {
  Config: undefined;
  TestStack: undefined;
  TestBottomTabs: undefined;
};

// #region Globals and constants

const STACK_ANIMATION_NAMES: StackAnimationName[] = [
  'default',
  'fade',
  'fade_from_bottom',
  'fade_from_right',
  'none',
  'reveal_from_bottom',
  'scale_from_center',
  'slide_from_bottom',
  'slide_from_right',
  'slide_from_left'
];

const DEFAULT_SCREEN: StackScreenConfig = {
   title: 'Home',
   presentation: 'card',
   detachPreviousScreen: true,
   animation: 'default',
};

const StackConfigContext = React.createContext<SettableConfigContext<StackScreenConfig[]>>({ config: [], setConfig: () => { } });
const BottomTabsConfigContext = React.createContext<SettableConfigContext<TabScreenConfig[]>>({ config: [], setConfig: () => { } });

// #region Test configuration

function applyConfigChange<T>(configList: T[], index: number, config: T) {
  configList = [...configList];
  configList[index] = config
  return configList;
}

function StackScreenConfigItem(props: SingleItemConfigProps<StackScreenConfig>) {
  const { config, setItemConfig } = props;

  return (
    <View style={styles.configItem}>
      <Text style={styles.titleText}>{props.config.title}</Text>
      <SettingsSwitch 
        label='detachPreviousScreen'
        value={props.config.detachPreviousScreen}
        onValueChange={v => setItemConfig({ ...config, detachPreviousScreen: v })}
      />
      <SettingsPicker<StackScreenConfig['presentation']> 
        label='presentation'
        value={config.presentation}
        onValueChange={v => setItemConfig({ ...config, presentation: v })}
        items={['card', 'modal', 'transparentModal']}
      />
      <SettingsPicker<StackAnimationName> 
        label='animation'
        value={config.animation}
        onValueChange={v => setItemConfig({ ...config, animation: v })}
        items={STACK_ANIMATION_NAMES}
      />
    </View>
  )
}

function BottomTabsScreenConfigItem(props: SingleItemConfigProps<TabScreenConfig>) {
  const { config, setItemConfig } = props;

  return (
    <View style={styles.configItem}>
      <Text style={styles.titleText}>{props.config.title}</Text>
      {config.screens.map((stackConfig, i) => (
        <StackScreenConfigItem 
          key={i}
          config={stackConfig}
          setItemConfig={newConfig => setItemConfig({ ...config, screens: applyConfigChange(config.screens, i, newConfig) })}
        />
      ))}
      <Pressable
        style={styles.stackButton}
        onPress={() => {
          setItemConfig({
            ...config,
            screens: [ ...config.screens, { ...DEFAULT_SCREEN, title: `Screen${config.screens.length}` } ],
          })
        }}
      >
        <Text>Add</Text>
      </Pressable>
      <Pressable
        style={styles.stackButton}
        onPress={() => {
          setItemConfig({
            ...config,
            screens: [ ...config.screens.slice(0, -1) ],
          })
        }}
      >
        <Text>Remove</Text>
      </Pressable>
    </View>
  )
}

function Config(props: { navigation: NativeStackNavigationProp<TestRoutes> }) {
  const { config: stackConfig, setConfig: setStackConfig } = React.useContext(StackConfigContext);
  const { config: bottomTabsConfig, setConfig: setBottomTabsConfig } = React.useContext(BottomTabsConfigContext);
  const [ scenario, setScenario ] = React.useState<'stack' | 'tabs'>('stack');
  
  return (
    <ScrollView style={styles.configList}>
      <SafeAreaView>
        <SettingsPicker<'stack' | 'tabs'>
          label='Scenario'
          value={scenario}
          onValueChange={s => setScenario(s)}
          items={['stack', 'tabs']}
        />
        {scenario === 'stack' && (<>
          {stackConfig.map((config, i) => (
            <StackScreenConfigItem 
              key={i}
              config={config}
              setItemConfig={newConfig => setStackConfig(applyConfigChange(stackConfig, i, newConfig))}
            />
          ))}
          <Pressable style={styles.stackButton} onPress={() => {setStackConfig([...stackConfig, { ...DEFAULT_SCREEN, title: `Screen${stackConfig.length}` }])}}>
            <Text>Add</Text>
          </Pressable>
          <Pressable style={styles.stackButton} onPress={() => setStackConfig([...stackConfig.slice(0, -1)])}>
            <Text>Remove</Text>
          </Pressable>
          <Pressable style={styles.stackButton} onPress={() => props.navigation.navigate('TestStack')}>
            <Text>Test</Text>
          </Pressable>
        </>)}
        {scenario === 'tabs' && (<>
          {bottomTabsConfig.map((config, i) => (
            <BottomTabsScreenConfigItem 
              key={i}
              config={config}
              setItemConfig={newConfig => setBottomTabsConfig(applyConfigChange(bottomTabsConfig, i, newConfig))}
            />
          ))}
          <Pressable style={styles.tabsButton} onPress={() => {setBottomTabsConfig([...bottomTabsConfig, { title: `Tab${stackConfig.length}`, screens: [{ ...DEFAULT_SCREEN }] }])}}>
            <Text>Add</Text>
          </Pressable>
          <Pressable style={styles.tabsButton} onPress={() => setBottomTabsConfig([...bottomTabsConfig.slice(0, -1)])}>
            <Text>Remove</Text>
          </Pressable>
          <Pressable style={styles.tabsButton} onPress={() => props.navigation.navigate('TestBottomTabs')}>
            <Text>Test</Text>
          </Pressable>
        </>)}
      </SafeAreaView>
    </ScrollView>
  )
}

// #region Test routes

function TestScreen(props: { nextScreen: string | undefined, isFirst: boolean }) {
  return (
    <View style={{ padding: 8, gap: 8 }}>
      { props.nextScreen && <Button screen={props.nextScreen}>Go to {props.nextScreen}</Button> }
      { !props.isFirst && <Button action={CommonActions.goBack()}>Go back</Button> }
      { !props.isFirst && <Button action={StackActions.pop(2)}>Pop 2</Button> }
    </View>
  )
}

function TestStack( props: { configList: StackScreenConfig[] }) {
  const JSStack = createStackNavigator({
    detachInactiveScreens: true,
    screens: Object.fromEntries(props.configList.map((config, i) => [
      config.title,
      {
        screen: () => <TestScreen nextScreen={ props.configList.at(i + 1)?.title } isFirst={i === 0} />,
        options: {
          presentation: config.presentation,
          detachPreviousScreen: config.detachPreviousScreen,
          animation: config.animation,
          gestureEnabled: true,
        },
      },
    ]))
  });

  const Navigation = createStaticNavigation(JSStack);

  return (
    <NavigationIndependentTree>
      <Navigation />
    </NavigationIndependentTree>
  )
}

function TestBottomTabs( props: { configList: TabScreenConfig[] }) {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator detachInactiveScreens={true}>
      {props.configList.map(config => (
        <Tab.Screen
          name={config.title}
          options={{ headerShown: false }}
          component={() => <TestStack configList={config.screens} />}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function App() {
  const [stackScreenConfig, setStackScreenConfig] = React.useState<StackScreenConfig[]>([
    { ...DEFAULT_SCREEN }
  ]);
  const [tabScreenConfig, setTabScreenConfig] = React.useState<TabScreenConfig[]>([
    {
      title: 'HomeTab',
      screens: [ { ...DEFAULT_SCREEN } ]
    }
  ]);

  const Stack = createNativeStackNavigator<TestRoutes>();

  return (
    <StackConfigContext.Provider value={{
      config: stackScreenConfig,
      setConfig: setStackScreenConfig,
    }}>
      <BottomTabsConfigContext.Provider value={{
        config: tabScreenConfig,
        setConfig: setTabScreenConfig,
      }}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name='Config'
                component={Config}
              />
              <Stack.Screen
                name='TestStack'
                component={() => <TestStack configList={stackScreenConfig} />}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name='TestBottomTabs'
                component={() => <TestBottomTabs configList={tabScreenConfig} />}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NavigationIndependentTree>
      </BottomTabsConfigContext.Provider>
    </StackConfigContext.Provider>
  )
}

const styles = StyleSheet.create({
  configList: {
    padding: 8,
  },
  configItem: {
    flex: 1,
    borderStyle: 'solid',
    borderRadius: 16,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    margin: 4,
  },
  titleText: {
    fontSize: 18,
    textAlign: 'center',
  },
  stackButton: {
    borderRadius: 16,
    fontWeight: 'bold',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BlueDark100,
    margin: 4,
    padding: 8,
  },
  tabsButton: {
    borderRadius: 16,
    fontWeight: 'bold',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GreenDark100,
    margin: 4,
    padding: 8,
  }
});
