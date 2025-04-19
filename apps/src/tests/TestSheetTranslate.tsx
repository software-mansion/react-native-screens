import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, TextInput, View, useWindowDimensions } from 'react-native';
import { ReanimatedScreenProvider, useReanimatedSheetTranslation } from 'react-native-screens/reanimated';
import Animated, { SharedValue, WithSpringConfig, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';

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
      <Animated.View style={[{ position: 'absolute', right: 16, bottom: 50, width: 64, height: 64, borderRadius: 32, backgroundColor: 'red' }, circleStyle]} />
    </View>
  );
}

function FormSheet({ navigation }: RouteProps<'FormSheet'>) {
  const dimentions = useWindowDimensions();
  const contextY = React.useContext(TranslationContext)
  const translation = useReanimatedSheetTranslation()

  useDerivedValue(() => {
    if (!contextY) return
    contextY.value = -(dimentions.height - translation.value)
  })

  const goBack = () => {
    navigation.goBack()
    if (contextY) {
      // Reanimated doesn't get fired when dismissed programmatically even if native is firing it.
      // I guess due to the component being unmounted early?
      contextY.value = withSpring(0, SPRING_CONFIG);
    }
  }

  return (
    // When using `fitToContents` you can't use flex: 1. It is you who must provide
    // the content size - you can't rely on parent size here.
    <View style={{ backgroundColor: 'lightgreen', flex: 1 }}>
      <View style={{ paddingTop: 20 }}>
        <Button title="Go back" onPress={goBack} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TextInput style={{ marginVertical: 12, paddingVertical: 8, backgroundColor: 'lavender', borderRadius: 24, width: '80%' }} placeholder="Trigger keyboard..." />
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
              sheetAllowedDetents: [0.4, 0.75],
              sheetLargestUndimmedDetentIndex: 'none',
              sheetCornerRadius: 8,
              headerShown: false,
              gestureEnabled: false,
              contentStyle: {
                backgroundColor: 'lightblue',
              },
            }} />
          </Stack.Navigator>
        </NavigationContainer>
      </TranslationContext.Provider>
    </ReanimatedScreenProvider>
  );
}
