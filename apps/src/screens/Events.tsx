import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, SettingsPicker, ToastProvider, useToast } from '../shared';

type StackParamList = {
  Main: undefined;
  Chats: undefined;
  Privacy: undefined;
  Options: undefined;
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
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Main | transitionStart | ${
            data.closing ? 'closing' : 'opening'
          }`,
          backgroundColor: 'orange',
        });
      },
    );

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      toast.push({
        message: `Main | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: stackAnimation,
    });
  }, [navigation, stackAnimation]);

  return (
    <View style={{ ...styles.container, backgroundColor: 'aliceblue' }}>
      <SettingsPicker<StackAnimation>
        testID="events-stack-animation-picker"
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
        testID="events-go-to-chats"
        title="Go to chats"
        onPress={() => navigation.navigate('Chats')}
      />
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </View>
  );
};

interface ChatsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
  stackAnimation: StackAnimation;
}

const ChatsScreen = ({
  navigation,
  stackAnimation,
}: ChatsScreenProps): React.JSX.Element => {
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      toast.push({
        message: `Chats | beforeRemove`,
        backgroundColor: 'red',
      });
    });

    return unsubscribe;
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Chats | transitionStart | ${
            data.closing ? 'closing' : 'opening'
          }`,
          backgroundColor: 'orange',
        });
      },
    );

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      toast.push({
        message: `Chats | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: stackAnimation,
    });
  }, [navigation, stackAnimation]);

  return (
    <NestedStack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackVisible: false,
      }}>
      <NestedStack.Screen name="Privacy" component={PrivacyScreen} />
      <NestedStack.Screen name="Options" component={OptionsScreen} />
    </NestedStack.Navigator>
  );
};

interface PrivacyScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const PrivacyScreen = ({
  navigation,
}: PrivacyScreenProps): React.JSX.Element => {
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      toast.push({
        message: `Privacy | beforeRemove`,
        backgroundColor: 'red',
      });
    });

    return unsubscribe;
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Privacy | transitionStart | ${
            data.closing ? 'closing' : 'opening'
          }`,
          backgroundColor: 'orange',
        });
      },
    );

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      toast.push({
        message: `Privacy | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ ...styles.container, backgroundColor: 'honeydew' }}>
      <Button
        testID="simple-native-stack-go-to-detail"
        title="Go to options"
        onPress={() => navigation.navigate('Options')}
      />
    </View>
  );
};

interface OptionsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const OptionsScreen = ({
  navigation,
}: OptionsScreenProps): React.JSX.Element => {
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      toast.push({
        message: `Options | beforeRemove`,
        backgroundColor: 'red',
      });
    });

    return unsubscribe;
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Options | transitionStart | ${
            data.closing ? 'closing' : 'opening'
          }`,
          backgroundColor: 'orange',
        });
      },
    );

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      toast.push({
        message: `Options | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ ...styles.container, backgroundColor: 'moccasin' }}>
      <Button onPress={() => navigation.goBack()} title="Go back" />
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();
const NestedStack = createNativeStackNavigator<StackParamList>();

const App = (): React.JSX.Element => {
  const [stackAnimation, setStackAnimation] =
    useState<StackAnimation>('default');

  return (
    <ToastProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          options={{ title: 'Events', headerBackVisible: true }}>
          {({ navigation }) => (
            <MainScreen
              navigation={navigation}
              stackAnimation={stackAnimation}
              setStackAnimation={setStackAnimation}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Chats">
          {({ navigation }) => (
            <ChatsScreen
              navigation={navigation}
              stackAnimation={stackAnimation}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </ToastProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});

export default App;
