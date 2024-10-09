import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { SettingsPicker, Button } from '../shared';

type StackParamList = {
  Main: undefined;
  Push: undefined;
  Pop: undefined;
  Screen: undefined;
  Modal: undefined;
};

type StackAnimation = Exclude<
  NativeStackNavigationOptions['animation'],
  undefined
>;

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
  stackAnimation: StackAnimation;
  setStackAnimation: (value: StackAnimation) => void;
}

const MainScreen = ({
  navigation,
  stackAnimation,
  setStackAnimation,
}: MainScreenProps): React.JSX.Element => {
  useLayoutEffect(() => {
    navigation.setOptions({
      animation: stackAnimation,
    });
  }, [navigation, stackAnimation]);

  return (
    <View style={{ ...styles.container, backgroundColor: 'lightsteelblue' }}>
      <SettingsPicker<StackAnimation>
        label="Stack animation"
        value={stackAnimation}
        onValueChange={setStackAnimation}
        items={[
          'default',
          'fade',
          'fade_from_bottom',
          'flip',
          'simple_push',
          'slide_from_bottom',
          'slide_from_right',
          'slide_from_left',
          'ios_from_right',
          'ios_from_left',
          'none',
        ]}
      />
      <Button
        title="Replace with pop animation"
        onPress={() => navigation.replace('Pop')}
      />
      <Button
        title="Replace with push animation"
        onPress={() => navigation.replace('Push')}
      />
      <Button
        title="New screen"
        onPress={() => navigation.navigate('Screen')}
      />
      <Button title="Open modal" onPress={() => navigation.navigate('Modal')} />
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </View>
  );
};

interface ReplaceScreenProps {
  navigation: NativeStackNavigationProp<StackParamList>;
  stackAnimation: StackAnimation;
}

const ReplaceScreen = ({
  navigation,
  stackAnimation,
}: ReplaceScreenProps): React.JSX.Element => {
  useLayoutEffect(() => {
    navigation.setOptions({
      animation: stackAnimation,
    });
  }, [navigation, stackAnimation]);

  return (
    <View style={{ ...styles.container, backgroundColor: 'wheat' }}>
      <Button title="Go back" onPress={() => navigation.replace('Main')} />
    </View>
  );
};

interface NavigateScreenProps {
  navigation: NativeStackNavigationProp<StackParamList>;
  stackAnimation: StackAnimation;
}

const NavigateScreen = ({
  navigation,
  stackAnimation,
}: NavigateScreenProps): React.JSX.Element => {
  useLayoutEffect(() => {
    navigation.setOptions({
      animation: stackAnimation,
    });
  }, [navigation, stackAnimation]);

  return (
    <View style={{ ...styles.container, backgroundColor: 'pink' }}>
      <Button title="Go back" onPress={() => navigation.popTo('Main')} />
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): React.JSX.Element => {
  const [stackAnimation, setStackAnimation] =
    useState<StackAnimation>('default');
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackVisible: false,
      }}>
      <Stack.Screen name="Main" options={{ title: 'Animations' }}>
        {({ navigation }) => (
          <MainScreen
            navigation={navigation}
            stackAnimation={stackAnimation}
            setStackAnimation={setStackAnimation}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Push"
        options={{
          animationTypeForReplace: 'push',
        }}>
        {({ navigation }) => (
          <ReplaceScreen
            navigation={navigation}
            stackAnimation={stackAnimation}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Pop"
        options={{
          animationTypeForReplace: 'pop',
        }}>
        {({ navigation }) => (
          <ReplaceScreen
            navigation={navigation}
            stackAnimation={stackAnimation}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Modal"
        options={{
          presentation: 'modal',
        }}>
        {({ navigation }) => (
          <NavigateScreen
            navigation={navigation}
            stackAnimation={stackAnimation}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Screen">
        {({ navigation }) => (
          <NavigateScreen
            navigation={navigation}
            stackAnimation={stackAnimation}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});

export default App;
