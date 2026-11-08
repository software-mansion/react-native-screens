import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button } from '@apps/shared';

// Android: tap "Push details in 1s" and press Home while the push animation
// is still running, then reopen the app. Details should show
// "transitionEnd: received (1)".

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

  useEffect(
    () =>
      navigation.addListener('transitionEnd', event => {
        if (!event.data.closing) {
          console.log('[Test4941] Details transitionEnd (closing: false)');
          setTransitionEndCount(count => count + 1);
        }
      }),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        transitionEnd:{' '}
        {transitionEndCount > 0
          ? `received (${transitionEndCount})`
          : 'waiting'}
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
