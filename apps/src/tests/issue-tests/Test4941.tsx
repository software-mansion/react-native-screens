import React, { useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button } from '@apps/shared';

// Android: tap "Push details" and press Home while Details slides in, then
// reopen the app. "Push details in 1s" starts the push 1 s after the tap:
// press Home only after Details starts to slide in. JS timers stop in the
// background, so an earlier Home press delays the push until the app is
// reopened. The run counts only if Details shows "Home pressed during the
// push: yes". Details should then show "transitionEnd: received (1)".

type ParamList = {
  Home: undefined;
  Details: undefined;
};

const Stack = createNativeStackNavigator<ParamList>();

function HomeScreen({ navigation }: NativeStackScreenProps<ParamList, 'Home'>) {
  return (
    <View style={styles.container}>
      <Button
        title="Push details"
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title="Push details in 1s"
        onPress={() => setTimeout(() => navigation.navigate('Details'), 1000)}
      />
    </View>
  );
}

function DetailsScreen({
  navigation,
}: NativeStackScreenProps<ParamList, 'Details'>) {
  const [transitionEndCount, setTransitionEndCount] = useState(0);
  const [backgroundedDuringPush, setBackgroundedDuringPush] = useState(false);
  const transitionEndedRef = useRef(false);

  useEffect(
    () =>
      navigation.addListener('transitionEnd', event => {
        if (!event.data.closing) {
          console.log('[Test4941] Details transitionEnd (closing: false)');
          transitionEndedRef.current = true;
          setTransitionEndCount(count => count + 1);
        }
      }),
    [navigation],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'background' && !transitionEndedRef.current) {
        setBackgroundedDuringPush(true);
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        transitionEnd:{' '}
        {transitionEndCount > 0
          ? `received (${transitionEndCount})`
          : 'waiting'}
      </Text>
      <Text style={styles.text}>
        Home pressed during the push: {backgroundedDuringPush ? 'yes' : 'no'}
      </Text>
    </View>
  );
}

export default function Test4941() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    fontSize: 20,
  },
});
