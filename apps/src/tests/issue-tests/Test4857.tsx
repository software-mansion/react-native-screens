import React, { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

const COMBINATIONS = {
  ExpandExpand: { initial: 0, first: 300, second: 360 },
  ExpandShrink: { initial: 0, first: 300, second: 200 },
  ShrinkShrink: { initial: 300, first: 100, second: 0 },
  ShrinkExpand: { initial: 300, first: 0, second: 150 },
} as const;

type Combination = keyof typeof COMBINATIONS;
type Trigger = 'OnOpen' | 'OnPress';
type SheetRoute = `${Combination}${Trigger}`;

type ParamList = { Home: undefined } & Record<SheetRoute, undefined>;

const Stack = createNativeStackNavigator<ParamList>();

const SHEET_ROUTES = (['OnOpen', 'OnPress'] as const).flatMap(trigger =>
  (Object.keys(COMBINATIONS) as Combination[]).map(combination => ({
    name: `${combination}${trigger}` as SheetRoute,
    title: `${combination.replace(/([a-z])([A-Z])/g, '$1 -> $2')} | ${
      trigger === 'OnOpen' ? 'on open' : 'on press'
    }`,
    combination,
    trigger,
  })),
);

function Home({ navigation }: NativeStackScreenProps<ParamList, 'Home'>) {
  return (
    <View style={styles.home}>
      {SHEET_ROUTES.map(({ name, title }) => (
        <Button
          key={name}
          title={title}
          onPress={() => navigation.navigate(name)}
        />
      ))}
    </View>
  );
}

function Sheet({
  navigation,
  route,
}: NativeStackScreenProps<ParamList, SheetRoute>) {
  const { title, combination, trigger } = SHEET_ROUTES.find(
    ({ name }) => name === route.name,
  )!;
  const { initial, first, second } = COMBINATIONS[combination];
  const [blockHeight, setBlockHeight] = useState<number>(initial);

  const run = useCallback(() => {
    setBlockHeight(first);
    requestAnimationFrame(() => setBlockHeight(second));
  }, [first, second]);

  useEffect(() => {
    if (trigger !== 'OnOpen') {
      return;
    }
    // Content changes during the enter transition are applied without the resize animation.
    return navigation.addListener('transitionEnd', event => {
      if (!event.data.closing) {
        run();
      }
    });
  }, [navigation, trigger, run]);

  return (
    <View style={styles.sheet} testID="sheet">
      <Text style={styles.caption}>
        {title}: block {blockHeight}
      </Text>
      {trigger === 'OnPress' && (
        <View style={styles.row}>
          <Button title="Run" onPress={run} />
          <Button title="Reset" onPress={() => setBlockHeight(initial)} />
        </View>
      )}
      {blockHeight > 0 && (
        <View style={[styles.block, { height: blockHeight }]} testID="block" />
      )}
      <View style={styles.bottomMarker} testID="bottom-marker">
        <Text style={styles.bold}>BOTTOM</Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Group
          screenOptions={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: 'fitToContents',
          }}>
          {SHEET_ROUTES.map(({ name }) => (
            <Stack.Screen key={name} name={name} component={Sheet} />
          ))}
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  sheet: {
    padding: 24,
    paddingBottom: 32,
    gap: 16,
    backgroundColor: 'white',
  },
  caption: {
    fontFamily: 'monospace',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  block: {
    backgroundColor: '#cfe8ff',
  },
  bottomMarker: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffadad',
  },
  bold: {
    fontWeight: 'bold',
  },
});
