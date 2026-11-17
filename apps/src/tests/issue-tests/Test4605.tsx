import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button } from '@apps/shared';

type SheetBackgroundEffect = NonNullable<
  NativeStackNavigationOptions['sheetBackgroundEffect']
>;

type ParamList = {
  Home: undefined;
  Sheet: undefined;
};

const EFFECTS: SheetBackgroundEffect[] = ['automatic', 'color'];
const OPAQUE_BACKGROUND = '#000000';
const TRANSLUCENT_BACKGROUND = '#ff00ff40';

const Stack = createNativeStackNavigator<ParamList>();

function Home({ navigation }: NativeStackScreenProps<ParamList, 'Home'>) {
  return (
    <View style={styles.home}>
      <Button
        title="Open form sheet"
        onPress={() => navigation.navigate('Sheet')}
      />
    </View>
  );
}

function Sheet({ navigation }: NativeStackScreenProps<ParamList, 'Sheet'>) {
  const [effectIndex, setEffectIndex] = useState(0);
  const [opaque, setOpaque] = useState(true);

  const effect = EFFECTS[effectIndex];
  const backgroundColor = opaque ? OPAQUE_BACKGROUND : TRANSLUCENT_BACKGROUND;
  const textColor = opaque ? '#ffffff' : '#000000';

  useLayoutEffect(() => {
    navigation.setOptions({
      sheetBackgroundEffect: effect,
      contentStyle: { backgroundColor },
    });
  }, [navigation, effect, backgroundColor]);

  return (
    <View style={styles.sheetContent}>
      <Text style={{ color: textColor }}>sheetBackgroundEffect: {effect}</Text>
      <Text style={{ color: textColor }}>
        backgroundColor: {backgroundColor}
      </Text>
      <Button
        title="Next effect"
        onPress={() => setEffectIndex(i => (i + 1) % EFFECTS.length)}
      />
      <Button
        title={opaque ? 'Translucent background' : 'Opaque background'}
        onPress={() => setOpaque(value => !value)}
      />
      <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function Test4605() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Sheet"
          component={Sheet}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.5],
            headerShown: false,
            contentStyle: { backgroundColor: OPAQUE_BACKGROUND },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: 'lightsalmon',
    justifyContent: 'center',
  },
  sheetContent: {
    paddingTop: 40,
    gap: 12,
    alignItems: 'center',
  },
});
