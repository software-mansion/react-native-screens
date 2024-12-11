import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

type RouteParamList = {
  Home: undefined;
  FormSheet: undefined;
}

type RouteProps<RouteName extends keyof RouteParamList> = {
  navigation: NativeStackNavigationProp<RouteParamList, RouteName>;
  route: RouteProp<RouteParamList, RouteName>;
}

const Stack = createNativeStackNavigator<RouteParamList>();

function Home({ navigation }: RouteProps<'Home'>) {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightsalmon' }}>
      <Button title="Open FormSheet" onPress={() => navigation.navigate('FormSheet')} />
    </View>
  );
}

function FormSheet({ navigation }: RouteProps<'FormSheet'>) {
  const [showContent, setShowContent] = React.useState(false);

  return (
    <View style={{ backgroundColor: 'lightgreen' }}>
      <View style={{ paddingTop: 20 }}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
      <View style={{ paddingTop: 20 }}>
        <Button title="Toggle content" onPress={() => setShowContent(old => !old)} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TextInput style={{ marginVertical: 12, paddingVertical: 8, backgroundColor: 'lavender', borderRadius: 24, width: '80%' }} placeholder="Trigger keyboard..." />
      </View>
      {showContent && (
        <View style={{ width: '100%', height: 400, backgroundColor: 'pink' }} />
      )}
    </View>
  );
}

//function Footer() {
//  return (
//    <View style={{ height: 64, backgroundColor: 'red' }}>
//      <Text>Footer</Text>
//      <Button title="Just click me" onPress={() => console.log('Footer button clicked')} />
//    </View>
//  );
//}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        statusBarTranslucent: false,
      }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="FormSheet" component={FormSheet} options={{
          presentation: 'formSheet',
          sheetAllowedDetents: 'fitToContents',
          //sheetAllowedDetents: [1.0],
          sheetCornerRadius: 8,
          sheetLargestUndimmedDetentIndex: 'last',
          contentStyle: {
            backgroundColor: 'lightblue',
          },
          //unstable_sheetFooter: Footer,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
