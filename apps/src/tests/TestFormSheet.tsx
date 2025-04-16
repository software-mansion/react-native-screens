import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, FlatList, ScrollView, Text, TextInput, View } from 'react-native';
import PressableWithFeedback from '../shared/PressableWithFeedback';

import {
  ReanimatedScreenProvider,
  useReanimatedSheetTranslation,
} from 'react-native-screens/reanimated';
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';

type ItemData = {
  id: number,
  text: string;
}

type RouteParamList = {
  Home: undefined;
  Second: undefined;
  FormSheet: undefined;
  SecondFormSheet: undefined;
  FormSheetWithFlatList: undefined;
  FormSheetWithScrollView: undefined;
};

type RouteProps<RouteName extends keyof RouteParamList> = {
  navigation: NativeStackNavigationProp<RouteParamList, RouteName>;
  route: RouteProp<RouteParamList, RouteName>;
}

const TranslationContext = React.createContext<{ y: SharedValue<number>, setY: (value: number) => void } | undefined>(undefined);


const Stack = createNativeStackNavigator<RouteParamList>();

function generateData(count: number): ItemData[] {
  return Array.from({ length: count }).map((_, index) => ({ id: index, text: `Item no. ${index}` }));
}

function Home({ navigation }: RouteProps<'Home'>) {
  const context = React.useContext(TranslationContext)

  const translateY = useDerivedValue(() => {
    return context?.y.value ?? 0
  })

  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -translateY.value }
    ]
  }))

  return (
    <View style={{ flex: 1, backgroundColor: 'lightsalmon' }}>
      <Button title="Open sheet" onPress={() => navigation.navigate('FormSheet')} />
      <Button title="Open Second" onPress={() => navigation.navigate('Second')} />
      <Button title="Open sheet with FlatList" onPress={() => navigation.navigate('FormSheetWithFlatList')} />
      <Button title="Open sheet with ScrollView" onPress={() => navigation.navigate('FormSheetWithScrollView')} />
      <PressableWithFeedback>
        <View style={{ alignItems: 'center', height: 40, justifyContent: 'center' }}>
          <Text>Pressable</Text>
        </View>
      </PressableWithFeedback>
      <Animated.View style={[{ position: 'absolute', right: 16, bottom: 50, width: 64, height: 64, borderRadius: 32, backgroundColor: 'red' }, circleStyle]} />
    </View>
  );
}

function Second({ navigation }: RouteProps<'Second'>) {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function FormSheet({ navigation }: RouteProps<'FormSheet'>) {
  const context = React.useContext(TranslationContext)
  const translation = useReanimatedSheetTranslation()

  useDerivedValue(() => {
    context?.setY(translation.value)
  })

  return (
    // When using `fitToContents` you can't use flex: 1. It is you who must provide
    // the content size - you can't rely on parent size here.
    <View style={{ backgroundColor: 'lightgreen', flex: 1 }}>
      <View style={{ paddingTop: 20 }}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
        <Button title="Open Second" onPress={() => navigation.navigate('Second')} />
        <Button title="Open SecondFormSheet" onPress={() => navigation.navigate('SecondFormSheet')} />
        <PressableWithFeedback>
          <View style={{ alignItems: 'center', height: 40, justifyContent: 'center' }}>
            <Text>Pressable</Text>
          </View>
        </PressableWithFeedback>
      </View>
      <View style={{ alignItems: 'center' }}>
        <TextInput style={{ marginVertical: 12, paddingVertical: 8, backgroundColor: 'lavender', borderRadius: 24, width: '80%' }} placeholder="Trigger keyboard..." />
      </View>
    </View>
  );
}

function SecondFormSheet({ navigation }: RouteProps<'SecondFormSheet'>) {
  return (
    // When using `fitToContents` you can't use flex: 1. It is you who must provide
    // the content size - you can't rely on parent size here.
    <View style={{ backgroundColor: 'lightgreen', flex: undefined }}>
      <View style={{ paddingTop: 20 }}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
        <Button title="Open Second" onPress={() => navigation.navigate('Second')} />
        <Button title="Pop to top" onPress={() => navigation.popToTop()} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TextInput style={{ marginVertical: 12, paddingVertical: 8, backgroundColor: 'lavender', borderRadius: 24, width: '80%' }} placeholder="Trigger keyboard..." />
      </View>
      <View style={{ backgroundColor: 'green', height: 500 }}>
        <Text>Additional content</Text>
      </View>
    </View>
  );
}


function FormSheetWithFlatList({ }: RouteProps<'FormSheetWithFlatList'>) {
  const renderItem = React.useCallback(({ item }: { item: ItemData }) => (
    <View>
      <Text>
        {item.text}
      </Text>
    </View>
  ), []);

  const data: ItemData[] = React.useMemo(() => generateData(1000), []);
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );
}

const StickyHeader = React.forwardRef<View, { children?: React.ReactNode, collapsable?: boolean }>((props, ref: React.LegacyRef<View>) => {
  return (
    <View ref={ref} style={{ width: '100%', height: 150, backgroundColor: 'red' }} collapsable={props.collapsable ?? true}>
      {props.children}
    </View>
  );
});

function FormSheetWithScrollView() {
  const headerRef = React.useRef<View>(null);
  const [isExtraContentVisible, setExtraContentVisible] = React.useState(false);

  const data: ItemData[] = React.useMemo(() => generateData(150), []);
  const renderItem = React.useCallback((item: ItemData) => (
    <View key={item.id.toString()}>
      <Text>
        {item.text}
      </Text>
    </View>
  ), []);

  return (
    <>
      <StickyHeader ref={headerRef} collapsable={false} >
        <Button title="Toggle extra content" onPress={() => setExtraContentVisible(old => !old)} />
      </StickyHeader>
      <ScrollView nestedScrollEnabled contentInsetAdjustmentBehavior="automatic">
        {data.map(renderItem)}
        {isExtraContentVisible && (
          data.slice(0, 40).map(renderItem)
        )}
      </ScrollView>
    </>
  );
}

// @ts-ignore // uncomment the usage down below if needed
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FormSheetFooter() {
  return (
    <View style={{ height: 64, backgroundColor: 'red' }}>
      <Text>Footer</Text>
      <Button title="Just click me" onPress={() => console.log('Footer button clicked')} />
    </View>
  );
}

export default function App() {
  const translationY = useSharedValue(0)
  const setY = (value: number) => {
    'worklet'
    translationY.value = value
  }

  return (
    <ReanimatedScreenProvider>
      <TranslationContext.Provider value={{ y: translationY, setY }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Second" component={Second} />
            <Stack.Screen name="FormSheet" component={FormSheet} options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.4, 0.75],
              //sheetAllowedDetents: 'fitToContents',
              sheetLargestUndimmedDetentIndex: 'none',
              sheetCornerRadius: 8,
              headerShown: false,
              contentStyle: {
                backgroundColor: 'lightblue',
              },
              //unstable_sheetFooter: FormSheetFooter,
            }} />
            <Stack.Screen name="SecondFormSheet" component={SecondFormSheet} options={{
              presentation: 'formSheet',
              //sheetAllowedDetents: [0.4, 0.75],
              sheetAllowedDetents: 'fitToContents',
              sheetLargestUndimmedDetentIndex: 'none',
              sheetCornerRadius: 8,
              headerShown: false,
              contentStyle: {
                backgroundColor: 'lightblue',
              },
              //unstable_sheetFooter: FormSheetFooter,
            }} />
            <Stack.Screen name="FormSheetWithFlatList" component={FormSheetWithFlatList} options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [1.0],
              sheetCornerRadius: 8,
              headerShown: false,
              contentStyle: {
                backgroundColor: 'lightblue',
              },
            }} />
            <Stack.Screen name="FormSheetWithScrollView" component={FormSheetWithScrollView} options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.6],
              sheetExpandsWhenScrolledToEdge: false,
              sheetGrabberVisible: true,
              sheetCornerRadius: 8,
              headerShown: false,
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

