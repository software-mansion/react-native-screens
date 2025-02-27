import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, FlatList, ScrollView, Text, TextInput, View, Platform } from 'react-native';

type ItemData = {
  id: number,
  text: string;
}

type RouteParamList = {
  Home: undefined;
  FormSheet: undefined;
  FormSheetWithFlatList: undefined;
  FormSheetWithScrollView: undefined;
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
      <Button title="Open sheeet" onPress={() => navigation.navigate('FormSheet')} />
      <Button title="Open sheet with FlatList" onPress={() => navigation.navigate('FormSheetWithFlatList')} />
      <Button title="Open sheet with ScrollView" onPress={() => navigation.navigate('FormSheetWithScrollView')} />
    </View>
  );
}

function FormSheet({ navigation }: RouteProps<'FormSheet'>) {
  return (
    // When using `fitToContents` you can't use flex: 1. It is you who must provide
    // the content size - you can't rely on parent size here.
    <View style={{ backgroundColor: 'lightgreen', flex: 1 }}>
      <View style={{ paddingTop: 20 }}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TextInput style={{ marginVertical: 12, paddingVertical: 8, backgroundColor: 'lavender', borderRadius: 24, width: '80%' }} placeholder="Trigger keyboard..." />
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
  );
}

