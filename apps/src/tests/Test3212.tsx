import { NavigationContainer, NavigationIndependentTree, NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { View, Button, ScrollView, Text } from "react-native";
import { ScrollEdgeEffect } from "react-native-screens";
import { SettingsPicker } from "../shared";
import { useMemo, useState } from "react";
import { BottomTabsContainer } from "../shared/gamma/containers/bottom-tabs/BottomTabsContainer";

interface ScrollEdgeEffects {
  bottom: ScrollEdgeEffect,
  top: ScrollEdgeEffect,
  left: ScrollEdgeEffect,
  right: ScrollEdgeEffect,
}

function ScrollViewTemplate() {
  const emoji = ['😎', '🍏', '👀', '🤖', '👾', '👨‍💻'];

  return (
    <ScrollView>
      <Text style={{ fontSize: 21 }}>
        {Array.from({ length: 1000 }).map(_ => emoji[Math.floor(Math.random() * emoji.length)])}
      </Text>
    </ScrollView>
  );
}

interface ConfigProps {
  scrollEdgeEffects: ScrollEdgeEffects,
  setScrollEdgeEffects: (effects: ScrollEdgeEffects) => void,
  navigating?: boolean
}

const SCROLL_EDGE_EFFECT_OPTIONS: ScrollEdgeEffect[] = ['automatic', 'hard', 'soft', 'hidden'];

function Config(props: ConfigProps) {
  const { scrollEdgeEffects, setScrollEdgeEffects, navigating = false } = props;
  let navigation: NavigationProp<{ Test: undefined }>;
  if (navigating) {
    navigation = useNavigation();
  }

  return <>
    <Text style={{ margin: 8, fontSize: 24 }}>scrollEdgeEffects:</Text>
    <SettingsPicker
      label="bottom"
      value={scrollEdgeEffects.bottom}
      items={SCROLL_EDGE_EFFECT_OPTIONS}
      onValueChange={value =>
        setScrollEdgeEffects({...scrollEdgeEffects, bottom: value})
      }
    />
    <SettingsPicker
      label="top"
      value={scrollEdgeEffects.top}
      items={['automatic', 'hard', 'soft', 'hidden']}
      onValueChange={value =>
        setScrollEdgeEffects({...scrollEdgeEffects, top: value})
      }
    />
    <SettingsPicker
      label="left"
      value={scrollEdgeEffects.left}
      items={['automatic', 'hard', 'soft', 'hidden']}
      onValueChange={value =>
        setScrollEdgeEffects({...scrollEdgeEffects, left: value})
      }
    />
    <SettingsPicker
      label="right"
      value={scrollEdgeEffects.right}
      items={['automatic', 'hard', 'soft', 'hidden']}
      onValueChange={value =>
        setScrollEdgeEffects({...scrollEdgeEffects, right: value})
      }
    />
    { navigating && <Button title="Go" onPress={() => navigation.navigate('Test')} /> }
  </>
}

function StackTemplate() {
  const Stack = createNativeStackNavigator();
  const [scrollEdgeEffects, setScrollEdgeEffects] = useState<ScrollEdgeEffects>({
    bottom: 'automatic',
    top: 'automatic',
    left: 'automatic',
    right: 'automatic',
  });

  const ConfigComponent = useMemo(
    () => () => <Config scrollEdgeEffects={scrollEdgeEffects} setScrollEdgeEffects={setScrollEdgeEffects} navigating />,
    [scrollEdgeEffects],
  );

  return <NavigationIndependentTree>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        autoHideHomeIndicator: true,
      }}>
        <Stack.Screen name="Config" component={ConfigComponent} />
        <Stack.Screen name="Test" component={ScrollViewTemplate} options={{ scrollEdgeEffects, headerSearchBarOptions: {}, headerTransparent: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  </NavigationIndependentTree>
  }

function BottomTabsTemplate() {
  const [scrollEdgeEffects, setScrollEdgeEffects] = useState<ScrollEdgeEffects>({
    bottom: 'automatic',
    top: 'automatic',
    left: 'automatic',
    right: 'automatic',
  });

  const ConfigComponent = useMemo(
    () => () => (
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <Config scrollEdgeEffects={scrollEdgeEffects} setScrollEdgeEffects={setScrollEdgeEffects} navigating />
      </ScrollView>
    ),
    [scrollEdgeEffects],
  );

  return <NavigationIndependentTree>
    <NavigationContainer>
      <BottomTabsContainer
        tabConfigs={[
          { component: ConfigComponent, tabScreenProps: { tabKey: 'config', title: 'Config' } },
          { component: ScrollViewTemplate, tabScreenProps: { tabKey: 'stack', title: 'Scroll', scrollEdgeEffects } },
        ]}
      />
    </NavigationContainer>
  </NavigationIndependentTree>
}

function StackInStackTemplate() {
  const Stack = createNativeStackNavigator();
  const [scrollEdgeEffects, setScrollEdgeEffects] = useState<ScrollEdgeEffects>({
    bottom: 'automatic',
    top: 'automatic',
    left: 'automatic',
    right: 'automatic',
  });

  const ConfigComponent = useMemo(
    () => () => <Config scrollEdgeEffects={scrollEdgeEffects} setScrollEdgeEffects={setScrollEdgeEffects} navigating />,
    [scrollEdgeEffects],
  );

  return <NavigationContainer>
    <Stack.Navigator screenOptions={{
      autoHideHomeIndicator: true,
    }}>
        <Stack.Screen name="Config" component={ConfigComponent} />
        <Stack.Screen name="Test" component={StackTemplate} options={{ scrollEdgeEffects, headerTransparent: true }} />
    </Stack.Navigator>
  </NavigationContainer>
}

function StackInBottomTabsTemplate() {
  const [scrollEdgeEffects, setScrollEdgeEffects] = useState<ScrollEdgeEffects>({
    bottom: 'automatic',
    top: 'automatic',
    left: 'automatic',
    right: 'automatic',
  });

  const ConfigComponent = useMemo(
    () => () => (
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <Config scrollEdgeEffects={scrollEdgeEffects} setScrollEdgeEffects={setScrollEdgeEffects} />
      </ScrollView>
    ),
    [scrollEdgeEffects],
  );

  return <NavigationContainer>
    <BottomTabsContainer
      tabConfigs={[
        { component: ConfigComponent, tabScreenProps: { tabKey: 'config', title: 'Config' } },
        { component: StackTemplate, tabScreenProps: { tabKey: 'stack', title: 'Stack', scrollEdgeEffects } },
      ]}
    />
  </NavigationContainer>
}

function BottomTabsInStackTemplate() {
  const Stack = createNativeStackNavigator();
  const [scrollEdgeEffects, setScrollEdgeEffects] = useState<ScrollEdgeEffects>({
    bottom: 'automatic',
    top: 'automatic',
    left: 'automatic',
    right: 'automatic',
  });

  const ConfigComponent = useMemo(
    () => () => <Config scrollEdgeEffects={scrollEdgeEffects} setScrollEdgeEffects={setScrollEdgeEffects} navigating />,
    [scrollEdgeEffects],
  );

  return <NavigationContainer>
      <Stack.Navigator screenOptions={{
        autoHideHomeIndicator: true,
      }}>
        <Stack.Screen name="Config" component={ConfigComponent} />
        <Stack.Screen name="Test" component={BottomTabsTemplate} options={{ scrollEdgeEffects, headerSearchBarOptions: {}, headerTransparent: true }} />
      </Stack.Navigator>
    </NavigationContainer>
}

export default function Test3212() {
  const [environment, setEnvironment] = useState('select');

  switch (environment) {
    case 'select':
      return <View style={{ marginTop: 100 }}>
        <Button title='Stack' onPress={() => setEnvironment('Stack')}/>
        <Button title='BottomTabs' onPress={() => setEnvironment('BottomTabs')}/>
        <Button title='Stack in Stack' onPress={() => setEnvironment('StackInStack')}/>
        <Button title='Stack in BottomTabs' onPress={() => setEnvironment('StackInBottomTabs')}/>
        <Button title='BottomTabs in Stack' onPress={() => setEnvironment('BottomTabsInStack')}/>
      </View>
    case 'Stack':
      return <StackTemplate />;
    case 'BottomTabs':
      return <BottomTabsTemplate />;
    case 'StackInStack':
      return <StackInStackTemplate />;
    case 'StackInBottomTabs':
      return <StackInBottomTabsTemplate />;
    case 'BottomTabsInStack':
      return <BottomTabsInStackTemplate />;
  }

}