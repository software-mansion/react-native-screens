import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View, Button, Platform } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationProp } from 'react-native-screens/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const Stack = createNativeStackNavigator();
const NestedStack = createNativeStackNavigator();

function Deeper({ navigation }: Props) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Deeper transitionStart ' +
            (data.closing ? 'closing' : 'opening')
        );
      }
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Deeper transitionEnd ' +
          (data.closing ? 'closing' : 'opening')
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <NestedStack.Navigator screenOptions={{ headerShown: true, stackAnimation: 'slide_from_bottom' }}>
      <NestedStack.Screen name="Privacy" component={Privacy} />
      <NestedStack.Screen name="Another" component={Another} />
    </NestedStack.Navigator>
  );
}

export default function NativeNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{stackAnimation: 'slide_from_bottom'}}>
        <Stack.Screen name="Status" component={Status} />
        <Stack.Screen name="Deeper" component={Deeper} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Status({ navigation }: Props) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Status transitionStart ' +
            (data.closing ? 'closing' : 'opening')
        );
      }
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Status transitionEnd ' +
          (data.closing ? 'closing' : 'opening')
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView>
      <Button title="Click" onPress={() => navigation.navigate('Deeper')} />
    </ScrollView>
  );
}

function Privacy({ navigation }: Props) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Privacy transitionStart ' +
            (data.closing ? 'closing' : 'opening')
        );
      }
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Privacy transitionEnd ' +
          (data.closing ? 'closing' : 'opening')
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,0,0,0.2)' }}>
      <Button title="Click" onPress={() => navigation.navigate('Another')} />
    </View>
  );
}

function Another({ navigation }: Props) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Another transitionStart ' +
            (data.closing ? 'closing' : 'opening')
        );
      }
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Another transitionEnd ' +
          (data.closing ? 'closing' : 'opening')
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,0,0,0.2)' }}>
      <Button title="Click" onPress={() => navigation.navigate('Another')} />
    </View>
  );
}
