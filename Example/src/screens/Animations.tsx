import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';
import { SettingsPicker, Button } from '../shared';

type StackParamList = {
  Main: undefined;
  Push: undefined;
  Pop: undefined;
  Screen: undefined;
  Modal: undefined;
};

type StackAnimation = Exclude<
  NativeStackNavigationOptions['stackAnimation'],
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
}: MainScreenProps): JSX.Element => {
  useLayoutEffect(() => {
    navigation.setOptions({
      stackAnimation,
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
}: ReplaceScreenProps): JSX.Element => {
  useLayoutEffect(() => {
    navigation.setOptions({
      stackAnimation,
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
}: NavigateScreenProps): JSX.Element => {
  useLayoutEffect(() => {
    navigation.setOptions({
      stackAnimation,
    });
  }, [navigation, stackAnimation]);

  return (
    <View style={{ ...styles.container, backgroundColor: 'pink' }}>
      <Button title="Go back" onPress={() => navigation.navigate('Main')} />
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => {
  const [stackAnimation, setStackAnimation] = useState<StackAnimation>(
    'default'
  );
  return (
    <Stack.Navigator
      screenOptions={{
        headerHideBackButton: true,
        direction: I18nManager.isRTL ? 'rtl' : 'ltr',
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
          replaceAnimation: 'push',
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
          replaceAnimation: 'pop',
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
          stackPresentation: 'modal',
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
    paddingTop: 100,
  },
});

export default App;
