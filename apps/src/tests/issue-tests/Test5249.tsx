import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button } from '@apps/shared';

// iOS 26+: both Details screens request `scrollEdgeEffects.top: 'hidden'` under
// a transparent header, and their colored content starts behind the navigation
// bar. "Push details" renders the ScrollView in the first commit. "Push details
// after loading" renders a spinner first and the ScrollView 1 s later, as a
// screen with loading or suspended content does.
//
// Expected: in both cases the colored bands stay fully visible behind the
// navigation bar, at rest and while scrolling.
// Bug: after loading, the top edge keeps the `automatic` effect (the hard edge
// on iOS 27; with Reduce Transparency on, an opaque strip) because the effect
// was applied before the ScrollView existed and is never retried.

type ParamList = {
  Home: undefined;
  Details: { delayMs: number };
};

const Stack = createNativeStackNavigator<ParamList>();

const COLORS = ['#e63946', '#f4a261', '#2a9d8f', '#457b9d', '#8338ec'];

function HomeScreen({ navigation }: NativeStackScreenProps<ParamList, 'Home'>) {
  return (
    <View style={styles.home}>
      <Button
        title="Push details"
        onPress={() => navigation.navigate('Details', { delayMs: 0 })}
      />
      <Button
        title="Push details after loading"
        onPress={() => navigation.navigate('Details', { delayMs: 1000 })}
      />
    </View>
  );
}

function DetailsScreen({
  route,
}: NativeStackScreenProps<ParamList, 'Details'>) {
  const { delayMs } = route.params;
  const [loaded, setLoaded] = useState(delayMs === 0);

  useEffect(() => {
    if (loaded) {
      return;
    }
    const timeout = setTimeout(() => setLoaded(true), delayMs);
    return () => clearTimeout(timeout);
  }, [delayMs, loaded]);

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="never">
      {Array.from({ length: 20 }, (_, index) => (
        <View
          key={index}
          style={[
            styles.band,
            { backgroundColor: COLORS[index % COLORS.length] },
          ]}>
          <Text style={styles.bandText}>Band {index + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default function Test5249() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({
            title: route.params.delayMs === 0 ? 'Immediate' : 'After loading',
            headerTransparent: true,
            scrollEdgeEffects: { top: 'hidden' },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  band: {
    height: 120,
    justifyContent: 'flex-end',
    padding: 12,
  },
  bandText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});
