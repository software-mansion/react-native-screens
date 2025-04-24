import { NavigationContainer, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { Button, View, useWindowDimensions, StyleSheet, TextInput } from 'react-native';
import { ReanimatedScreenProvider, useReanimatedSheetTranslation } from 'react-native-screens/reanimated';
import Animated, { useAnimatedReaction, SharedValue, WithSpringConfig, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

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
    <View style={{ height: 64, backgroundColor: 'lavender' }}>
      <Button title="Just click me" onPress={() => console.log('Footer button clicked')} />
    </View>
  );
}

function FormSheet({ navigation }: RouteProps<'FormSheet'>) {
  const dimentions = useWindowDimensions();
  const contextY = React.useContext(TranslationContext)
  const translation = useReanimatedSheetTranslation()

  useAnimatedReaction(() => translation.value, () => {
    if (!contextY) return
    contextY.value = -(dimentions.height - translation.value)
  })

  // Reanimated doesn't get fired when dismissed even if native is firing it.
  // I guess due to the component being unmounted early in react-navigation?
  useFocusEffect(useCallback(() => {
    return () => {
      if (!contextY) return;
      contextY.value = withSpring(0, SPRING_CONFIG);
    }
  }, []))

  return (
    // When using `fitToContents` you can't use flex: 1. It is you who must provide
    // the content size - you can't rely on parent size here.
    <View style={{ flex: 1 }}>
      <View style={styles.inputWrapper}>
        <TextInput style={styles.input} placeholder="Trigger keyboard..."/>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Expand" onPress={() => navigation.setOptions({ sheetInitialDetentIndex: 2 })} />
        <Button title="Collapse" onPress={() => navigation.setOptions({ sheetInitialDetentIndex: 0 })} />
        <Button title="Dismiss" onPress={() => navigation.goBack()} />
      </View>
    </View>
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
              sheetAllowedDetents: [0.4, 0.6, 1],
              sheetLargestUndimmedDetentIndex: 'none',
              sheetCornerRadius: 16,
              headerShown: false,
              // gestureEnabled: false,
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
  inputWrapper: {
    padding: 12,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: 'lavender',
    borderRadius: 16,
  }
})