import React, {useEffect} from 'react';
import {View, StyleSheet, I18nManager, Text, Alert} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import {Button, ToastProvider, useToast} from '../shared';

type StackParamList = {
  Main: undefined;
  Next: undefined;
  NavigationEvents: undefined;
  NativeEvents: undefined;
  Events: undefined;
  Home: undefined;
  Details: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({navigation}: MainScreenProps): JSX.Element => (
  <View style={{...styles.container, backgroundColor: 'aliceblue'}}>
    <Button
      title="focus and blur"
      onPress={() => navigation.navigate('NavigationEvents')}
    />
    <Button
      title="transitionStart and transitionEnd"
      onPress={() => navigation.navigate('NativeEvents')}
    />
    <Button
      title="Simple example"
      onPress={() => navigation.navigate('Events')}
    />
    <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
  </View>
);

interface ScreensEventsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'NativeEvents'>;
}

const ScreensEventsScreen = ({
  navigation,
}: ScreensEventsScreenProps): JSX.Element => {
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionStart', ({data}) => {
      toast.push({
        message: `transitionStart: ${data.closing ? 'closing' : 'opening'}`,
        backgroundColor: 'orange',
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({data}) => {
      toast.push({
        message: `transitionEnd: ${data.closing ? 'closing' : 'opening'}`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{...styles.container, backgroundColor: 'lavenderblush'}}>
      <Button
        title="Navigate to next screen"
        onPress={() => navigation.navigate('Next')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

interface NavigationEventsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'NavigationEvents'>;
}

const NavigationEventsScreen = ({
  navigation,
}: NavigationEventsScreenProps): JSX.Element => {
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionStart', ({data}) => {
      toast.push({
        message: `transitionStart: ${data.closing ? 'closing' : 'opening'}`,
        backgroundColor: 'orange',
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({data}) => {
      toast.push({
        message: `transitionEnd: ${data.closing ? 'closing' : 'opening'}`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      toast.push({
        message: 'focus',
        backgroundColor: 'darkviolet',
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      toast.push({
        message: 'blur',
        backgroundColor: 'indianred',
      });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{...styles.container, backgroundColor: 'lavenderblush'}}>
      <Button
        title="Navigate to next screen"
        onPress={() => navigation.navigate('Next')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const NextScreen = (): JSX.Element => (
  <View style={styles.container}>
    <Text style={styles.text}>Go back using native ways</Text>
  </View>
);

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Home'>;
}

const HomeScreen = ({navigation}: HomeScreenProps): JSX.Element => (
  <View style={styles.container}>
    <Button
      title="Go to details"
      onPress={() => navigation.navigate('Details')}
    />
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

interface DetailsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Details'>;
}

const DetailsScreen = ({navigation}: DetailsScreenProps): JSX.Element => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      Alert.alert('You went to details screen.');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      Alert.alert('You left the details screen.');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const NativeStack = createNativeStackNavigator<StackParamList>();
const NavigationStack = createStackNavigator<StackParamList>();
const EventsStack = createNativeStackNavigator<StackParamList>();

const NativeNavigator = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen name="NativeEvents" component={ScreensEventsScreen} />
    <NativeStack.Screen name="Next" component={NextScreen} />
  </NativeStack.Navigator>
);

const NavigationNavigator = () => (
  <NavigationStack.Navigator>
    <NativeStack.Screen
      name="NavigationEvents"
      component={NavigationEventsScreen}
    />
    <NavigationStack.Screen name="Next" component={NextScreen} />
  </NavigationStack.Navigator>
);

const EventsNavigator = () => (
  <EventsStack.Navigator>
    <NativeStack.Screen name="Home" component={HomeScreen} />
    <NativeStack.Screen name="Details" component={DetailsScreen} />
  </EventsStack.Navigator>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <ToastProvider>
    <Stack.Navigator
      screenOptions={{
        direction: I18nManager.isRTL ? 'rtl' : 'ltr',
        headerShown: false,
      }}>
      <NavigationStack.Screen
        name="Main"
        component={MainScreen}
        options={{title: 'Simple Native Stack'}}
      />
      <Stack.Screen name="NativeEvents" component={NativeNavigator} />
      <Stack.Screen name="NavigationEvents" component={NavigationNavigator} />
      <Stack.Screen name="Events" component={EventsNavigator} />
    </Stack.Navigator>
  </ToastProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  text: {
    textAlign: 'center',
    color: 'black',
  },
});

export default App;
