import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';

type RouteParamList = {
  Home: undefined;
  FormSheet: undefined;
  FormSheetWithFlatList: undefined;
};

type RouteProps<RouteName extends keyof RouteParamList> = {
  navigation: NativeStackNavigationProp<RouteParamList, RouteName>;
  route: RouteProp<RouteParamList, RouteName>;
}

const Stack = createNativeStackNavigator<RouteParamList>();

type ItemData = {
  id: number,
  text: string;
}

const DATA: ItemData[] = Array.from({ length: 1000 }).map((_, index) => ({ id: index, text: `Item no. ${index}` }));

function RenderItem({ item }: { item: ItemData }) {
  return (
    <View>
      <Text>
        {item.text}
      </Text>
    </View>
  );
}

function Home({ navigation }: RouteProps<'Home'>) {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightsalmon' }}>
      <Button title="Open sheeet" onPress={() => navigation.navigate('FormSheet')} />
      <Button title="Open sheet with FlatList" onPress={() => navigation.navigate('FormSheetWithFlatList')} />
    </View>
  );
}

function FormSheet({ navigation }: RouteProps<'FormSheet'>) {
  return (
    <View style={{ backgroundColor: 'lightgreen' }}>
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
  return (
    <FlatList
      data={DATA}
      renderItem={RenderItem}
      keyExtractor={item => item.id.toString()}
    />
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
          //sheetAllowedDetents: [0.4, 0.75, 1.0],
          sheetAllowedDetents: 'fitToContents',
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
