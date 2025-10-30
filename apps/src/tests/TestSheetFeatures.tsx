import { NavigationContainer, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, Button, View, StyleSheet, TextInput, Platform, ScrollView } from 'react-native';
import { ReanimatedScreenProvider, useReanimatedSheetTranslation } from 'react-native-screens/reanimated';

import Animated, {
  useAnimatedReaction,
  SharedValue,
  WithSpringConfig,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

const FOOTER_HEIGHT = 60;

const SPRING_CONFIG: WithSpringConfig = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
}

type RouteParamList = {
  Home: undefined;
  FormSheet: undefined;
};

const Stack = createNativeStackNavigator<RouteParamList>();

const TranslationContext = React.createContext<SharedValue<number> | undefined>(undefined);

type RouteProps<RouteName extends keyof RouteParamList> = {
  navigation: NativeStackNavigationProp<RouteParamList, RouteName>;
  route: RouteProp<RouteParamList, RouteName>;
}

function Home({ navigation }: RouteProps<'Home'>) {
  const translateY = React.useContext(TranslationContext);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY?.value ?? 0 }
    ]
  }));

  return (
    <View style={{ flex: 1, backgroundColor: 'lightsalmon' }}>
      <Button title="Open sheet" onPress={() => navigation.navigate('FormSheet')} />
      <Animated.View style={[styles.circle, circleStyle]} />
    </View>
  );
}

function FormSheetFooter() {
  return (
    <View style={styles.footer} />
  );
}

function FormSheet({ navigation }: RouteProps<'FormSheet'>) {
  const [currentDetentIndex, setCurrentDetentIndex] = useState(0)
  const frame = useSafeAreaFrame();
  const contextY = React.useContext(TranslationContext)
  const translation = useReanimatedSheetTranslation()

  useAnimatedReaction(() => translation.value, () => {
    if (!contextY) return
    contextY.value = -(frame.height - translation.value)
  })

  // Reanimated doesn't get fired when dismissed even if native is firing it.
  // I guess due to the component being unmounted early in react-navigation?
  useFocusEffect(useCallback(() => {
    return () => {
      if (!contextY) return;
      contextY.value = Platform.OS === 'android' ?
        withTiming(0, { duration: 350 }) :
        withSpring(0, SPRING_CONFIG);
    }
  }, []))

  useEffect(() => {
    navigation.setOptions({
      sheetInitialDetentIndex: currentDetentIndex,
    })
  }, [currentDetentIndex])

  useEffect(() => {
    const unsubscribe = navigation.addListener('sheetDetentChange', ({ data }) => {
      if (data.stable) {
        setCurrentDetentIndex(data.index);
      }
    })

    return unsubscribe
  }, [])

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      nestedScrollEnabled
      contentInsetAdjustmentBehavior="automatic"
    >
      <TextInput style={styles.input} placeholderTextColor="gray" placeholder="Trigger keyboard..."/>
      <View>
        <Button title="Expand" onPress={() => setCurrentDetentIndex(1)} />
        <Button title="Collapse" onPress={() => setCurrentDetentIndex(0)} />
        <Button title="Dismiss" onPress={() => navigation.goBack()} />
      </View>
      {Array.from({ length: 40 }, (_, i) => (
        <View key={i} style={styles.item}>
          <Text style={{ color: 'gray' }}>{i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default function App() {
  const translationY = useSharedValue(0)

  return (
    <ReanimatedScreenProvider>
      <TranslationContext.Provider value={translationY}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="FormSheet" component={FormSheet} options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.3, 0.5, 0.8],
              // sheetAllowedDetents: [0.9997],
              // sheetAllowedDetents: 'fitToContents',
              sheetLargestUndimmedDetentIndex: 'none',
              sheetCornerRadius: 16,
              headerShown: false,
              // sheetDismissible: false,
              unstable_sheetFooter: FormSheetFooter,
            }} />
          </Stack.Navigator>
        </NavigationContainer>
      </TranslationContext.Provider>
    </ReanimatedScreenProvider>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    right: 16,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
    paddingBottom: FOOTER_HEIGHT + 12,
  },
  item: {
    backgroundColor: 'lavender',
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: 'lavender',
    borderRadius: 16,
  },
  footer: {
    height: FOOTER_HEIGHT,
    alignItems: 'center',
    backgroundColor: 'gray',
    justifyContent: 'center',
  }
})