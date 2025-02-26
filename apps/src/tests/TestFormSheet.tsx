import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, FlatList, ScrollView, Text, TextInput, View } from 'react-native';

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
  const [isDynamicContentVisible, setDynamicContentVisible] = React.useState<boolean>(false);

  return (
    <View style={{ backgroundColor: 'lightgreen', flex: 1 }}>
      <View style={{ paddingTop: 20 }}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
        <Button title="Toggle dynamic content" onPress={() => setDynamicContentVisible(old => !old)} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TextInput style={{ marginVertical: 12, paddingVertical: 8, backgroundColor: 'lavender', borderRadius: 24, width: '80%' }} placeholder="Trigger keyboard..." />
      </View>
      {isDynamicContentVisible && (
        <View style={{ backgroundColor: 'red', height: 300, width: '100%' }} />
      )}
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

function FormSheetWithScrollView() {
  const data: ItemData[] = React.useMemo(() => generateData(100), []);
  const renderItem = React.useCallback((item: ItemData) => (
    <View key={item.id.toString()}>
      <Text>
        {item.text}
      </Text>
    </View>
  ), []);
  return (
    <ScrollView nestedScrollEnabled contentInsetAdjustmentBehavior="automatic">
      {data.map(renderItem)}
    </ScrollView>
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
          //sheetAllowedDetents: [0.4, 0.75, 0.9],
          sheetAllowedDetents: 'fitToContents',
          //sheetLargestUndimmedDetentIndex: 1,
          sheetGrabberVisible: true,
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
          sheetAllowedDetents: [0.6, 0.9],
          sheetExpandsWhenScrolledToEdge: false,
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
