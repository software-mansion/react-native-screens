import React, {useState, useLayoutEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {SettingsPicker, Button} from '../shared';

enableScreens();

type StackParamList = {
  Main: undefined;
  Push: undefined;
  Pop: undefined;
  Screen: undefined;
  Modal: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({navigation}: MainScreenProps): JSX.Element => {
  const [stackAnimation, setStackAnimation] = useState('default');

  useLayoutEffect(() => {
    navigation.setOptions({
      stackAnimation,
    });
  }, [navigation, stackAnimation]);

  return (
    <View style={styles.container}>
      <SettingsPicker
        label="Stack animation"
        value={stackAnimation}
        onValueChange={setStackAnimation}
        items={[
          'default',
          'fade',
          'flip',
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
}

const ReplaceScreen = ({navigation}: ReplaceScreenProps): JSX.Element => (
  <View style={styles.container}>
    <Button title="Go back" onPress={() => navigation.replace('Main')} />
  </View>
);

interface NavigateScreenProps {
  navigation: NativeStackNavigationProp<StackParamList>;
}

const NavigateScreen = ({navigation}: NavigateScreenProps): JSX.Element => (
  <View style={styles.container}>
    <Button title="Go back" onPress={() => navigation.navigate('Main')} />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      statusBarStyle: 'dark',
    }}>
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{title: 'Animations'}}
    />
    <Stack.Screen
      name="Push"
      component={ReplaceScreen}
      options={{
        replaceAnimation: 'push',
      }}
    />
    <Stack.Screen
      name="Pop"
      component={ReplaceScreen}
      options={{
        replaceAnimation: 'pop',
      }}
    />
    <Stack.Screen
      name="Modal"
      component={NavigateScreen}
      options={{
        stackPresentation: 'modal',
      }}
    />
    <Stack.Screen name="Screen" component={NavigateScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
});

export default App;
