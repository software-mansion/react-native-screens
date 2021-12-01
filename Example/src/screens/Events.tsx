import React, { useEffect } from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import { Button, ToastProvider, useToast } from '../shared';

type StackParamList = {
  Main: undefined;
  Chats: undefined;
  Privacy: undefined;
  Options: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => {
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
      }
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

  return (
    <View style={{ ...styles.container, backgroundColor: 'aliceblue' }}>
      <Button
        testID="simple-native-stack-go-to-detail"
        title="Go to chats"
        onPress={() => navigation.navigate('Chats')}
      />
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </View>
  );
};

interface ChatsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const ChatsScreen = ({ navigation }: ChatsScreenProps): JSX.Element => {
  const toast = useToast();

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
      }
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
  return (
    <NestedStack.Navigator
      screenOptions={{
        headerShown: true,
        nativeBackButtonDismissalEnabled: true,
        headerTopInsetEnabled: false,
        headerHideBackButton: true,
        // stackAnimation: 'default',
      }}>
      <NestedStack.Screen name="Privacy" component={PrivacyScreen} />
      <NestedStack.Screen name="Options" component={OptionsScreen} />
    </NestedStack.Navigator>
  );
};

const PrivacyScreen = ({ navigation }: MainScreenProps): JSX.Element => {
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
      }
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

const OptionsScreen = ({ navigation }: MainScreenProps): JSX.Element => {
  const toast = useToast();

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
      }
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

const App = (): JSX.Element => (
  <ToastProvider>
    <Stack.Navigator
      screenOptions={{
        direction: I18nManager.isRTL ? 'rtl' : 'ltr',
        // stackAnimation: 'default',
      }}>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ title: 'Events', headerHideBackButton: true }}
      />
      <Stack.Screen name="Chats" component={ChatsScreen} />
    </Stack.Navigator>
  </ToastProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
});

export default App;
