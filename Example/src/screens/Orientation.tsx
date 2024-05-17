import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, I18nManager } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, SettingsPicker } from '../shared';

type StackParamList = {
  First: undefined;
  Second: undefined;
};

type ScreenOrientation = Exclude<
  NativeStackNavigationOptions['orientation'],
  undefined
>;

interface FirstScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'First'>;
}

const FirstScreen = ({ navigation }: FirstScreenProps): React.JSX.Element => {
  const [screenOrientation, setScreenOrientation] =
    useState<ScreenOrientation>('default');

  useLayoutEffect(() => {
    navigation.setOptions({
      orientation: screenOrientation,
    });
  }, [navigation, screenOrientation]);

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: 'aliceblue' }}>
      <ScrollView>
        <SettingsPicker<ScreenOrientation>
          style={styles.margin}
          label="Screen orientation"
          value={screenOrientation}
          onValueChange={setScreenOrientation}
          items={[
            'default',
            'all',
            'portrait',
            'portrait_up',
            'portrait_down',
            'landscape',
            'landscape_left',
            'landscape_right',
          ]}
        />
        <Button
          title="New screen"
          onPress={() => navigation.navigate('Second')}
        />
        <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
      </ScrollView>
    </SafeAreaView>
  );
};

interface SecondScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Second'>;
}

const SecondScreen = ({ navigation }: SecondScreenProps): React.JSX.Element => (
  <SafeAreaView style={{ ...styles.container, backgroundColor: 'honeydew' }}>
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </SafeAreaView>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): React.JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerBackVisible: false,
    }}>
    <Stack.Screen
      name="First"
      component={FirstScreen}
      options={{ title: 'Orientation' }}
    />
    <Stack.Screen name="Second" component={SecondScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  margin: {
    marginTop: 15,
  },
});

export default App;
