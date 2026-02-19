/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ScrollView, Button, Platform, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { SettingsPicker, ToastProvider, useToast } from '../../shared';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

type NavigatorProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
  stackAnimation: StackAnimation;
  setStackAnimation: (value: StackAnimation) => void;
};

type StackAnimation = Exclude<
  NativeStackNavigationOptions['animation'],
  undefined
>;

const Stack = createNativeStackNavigator();
const NestedStack = createNativeStackNavigator();

function Deeper({ navigation, stackAnimation }: NavigatorProps) {
  const toast = useToast();

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: stackAnimation,
    });
  }, [navigation, stackAnimation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Deeper | transitionStart | ${
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
        message: `Deeper | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Deeper transitionStart ' +
            (data.closing ? 'closing' : 'opening'),
        );
      },
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Deeper transitionEnd ' +
          (data.closing ? 'closing' : 'opening'),
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <NestedStack.Navigator
      screenOptions={{
        headerShown: true,
        animation: stackAnimation,
      }}>
      <NestedStack.Screen name="Privacy" component={Privacy} />
      <NestedStack.Screen name="Another" component={Another} />
    </NestedStack.Navigator>
  );
}

export default function NativeNavigation() {
  const [stackAnimation, setStackAnimation] =
    useState<StackAnimation>('default');

  return (
    <NavigationContainer>
      <ToastProvider>
        <Stack.Navigator
          screenOptions={{
            animation: stackAnimation,
          }}>
          <Stack.Screen name="Status">
            {({ navigation }) => (
              <Status
                navigation={navigation}
                stackAnimation={stackAnimation}
                setStackAnimation={setStackAnimation}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Deeper">
            {({ navigation }) => (
              <Deeper
                navigation={navigation}
                stackAnimation={stackAnimation}
                setStackAnimation={setStackAnimation}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </ToastProvider>
    </NavigationContainer>
  );
}

function Status({
  navigation,
  stackAnimation,
  setStackAnimation,
}: NavigatorProps) {
  const toast = useToast();

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: stackAnimation,
    });
  }, [navigation, stackAnimation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Status | transitionStart | ${
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
        message: `Status | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Status transitionStart ' +
            (data.closing ? 'closing' : 'opening'),
        );
      },
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Status transitionEnd ' +
          (data.closing ? 'closing' : 'opening'),
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView>
      <SettingsPicker<StackAnimation>
        testID="Test593-stack-animation-picker"
        label="Stack animation"
        value={stackAnimation}
        onValueChange={setStackAnimation}
        items={['default', 'none']}
      />
      <Button
        title="Click"
        onPress={() => navigation.navigate('Deeper')}
        testID="status-button-go-to-deeper"
      />
    </ScrollView>
  );
}

function Privacy({ navigation }: Props) {
  const toast = useToast();

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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Privacy transitionStart ' +
            (data.closing ? 'closing' : 'opening'),
        );
      },
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Privacy transitionEnd ' +
          (data.closing ? 'closing' : 'opening'),
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,0,0,0.2)' }}>
      <Button
        title="Click"
        onPress={() => navigation.navigate('Another')}
        testID="privacy-button-go-to-another"
      />
    </View>
  );
}

function Another({ navigation }: Props) {
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Another | transitionStart | ${
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
        message: `Another | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Another transitionStart ' +
            (data.closing ? 'closing' : 'opening'),
        );
      },
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Another transitionEnd ' +
          (data.closing ? 'closing' : 'opening'),
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <Button title="Click" onPress={() => navigation.navigate('Another')} />
    </View>
  );
}
