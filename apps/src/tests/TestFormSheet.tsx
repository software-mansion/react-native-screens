import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, FlatList, ScrollView, Text, TextInput, View } from 'react-native';
import PressableWithFeedback from '../shared/PressableWithFeedback';
import { Spacer } from '../shared';
import { type SheetCommands } from '../../../src/types';

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
  GlossyFormSheet: undefined;
};

type RouteProps<RouteName extends keyof RouteParamList> = {
  navigation: NativeStackNavigationProp<RouteParamList, RouteName>;
  route: RouteProp<RouteParamList, RouteName>;
}

const Stack = createNativeStackNavigator<RouteParamList>();

function generateData(count: number): ItemData[] {
  return Array.from({ length: count }).map((_, index) => ({ id: index, text: `Item no. ${index}` }));
}

function Home({ navigation }: RouteProps<'Home'>) {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightsalmon' }}>
      <Button title="Open sheet" onPress={() => navigation.navigate('FormSheet')} />
      <Button title="Open Second" onPress={() => navigation.navigate('Second')} />
      <Button title="Open sheet with FlatList" onPress={() => navigation.navigate('FormSheetWithFlatList')} />
      <Button title="Open sheet with ScrollView" onPress={() => navigation.navigate('FormSheetWithScrollView')} />
      <Button title="Open glossy form sheet" onPress={() => navigation.navigate('GlossyFormSheet')} />
      <PressableWithFeedback>
        <View style={{ alignItems: 'center', height: 40, justifyContent: 'center' }}>
          <Text>Pressable</Text>
        </View>
      </PressableWithFeedback>
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
  const sheetRef = React.useRef<SheetCommands>(null);

  React.useEffect(() => {
    navigation.setOptions({ sheetRef });
  }, [navigation]);

  return (
    // When using `fitToContents` you can't use flex: 1. It is you who must provide
    // the content size - you can't rely on parent size here.
    <View style={{ backgroundColor: 'lightgreen', flex: 1 }}>
      <View style={{ paddingTop: 20 }}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
        <Button title="Set Detent 0" onPress={() => sheetRef.current?.setDetent(0)} />
        <Button title="Set Detent 1" onPress={() => sheetRef.current?.setDetent(1)} />
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

function GlossyFormSheet({ navigation }: RouteProps<'GlossyFormSheet'>) {
  return (
    // When using `fitToContents` you can't use flex: 1. It is you who must provide
    // the content size - you can't rely on parent size here.
    <View>
      <Spacer space={50} />
      <PressableWithFeedback>
        <View
          style={{
            alignItems: 'center',
            height: 40,
            justifyContent: 'center',
          }}>
          <Text>Pressable</Text>
        </View>
      </PressableWithFeedback>
      <Spacer space={50} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
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
  return (
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
        <Stack.Screen name='GlossyFormSheet' component={GlossyFormSheet} options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.3, 0.5, 0.8],
          //sheetAllowedDetents: 'fitToContents',
          headerShown: false,
          contentStyle: {
            backgroundColor: '#ff00ff40',
          },
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

