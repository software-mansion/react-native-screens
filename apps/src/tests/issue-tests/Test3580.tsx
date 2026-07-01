import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';

type RouteParamList = {
  Home: undefined;
  FormSheet: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

function Home({ navigation }: StackNavigationProp) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Open FormSheet"
        onPress={() => navigation.navigate('FormSheet')}
      />
    </View>
  );
}

function FormSheet() {
  return (
    <View style={{ padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>
        Android formSheet bottom inset
      </Text>
      <Text>
        On Android the content of a content-sized formSheet used to render under the
        system navigation bar. The row below should sit fully above the nav bar, the
        same way it already does on iOS.
      </Text>
      <View style={{ backgroundColor: '#208AEF', padding: 16, borderRadius: 12 }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>
          Bottom row - must clear the navigation bar
        </Text>
      </View>
    </View>
  );
}

export default function Test3580() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="FormSheet"
          component={FormSheet}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
