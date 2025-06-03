import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';

type StackRouteParamList = {
  Home: undefined;
  Second: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();

function Second({ navigation }: StackNavigationProp) {
  return (
    <View>
      <Text>Second screen</Text>
      <Button
        onPress={() => {
          navigation.push('Second');
        }}
        title="Click me"
      />
    </View>
  );
}

function Home({ navigation }: StackNavigationProp) {



  return (
    <View style={[{ flex: 1, gap: 15 }]}>
      <Button
        onPress={() => {
          console.log(new Date());
          navigation.push('Second');
          setInterval(() => {
            console.log(new Date());
            navigation.push('Second');
            console.log("after push");
          }, 1000);



          // console.log('Pushing 1');
          // navigation.push('Second');
          // setTimeout(() => {
          //   console.log('Pushing 2');
          //   navigation.push('Second');
          // }, 1000);
          // setTimeout(() => {
          //   console.log('Pushing 3');
          //   navigation.push('Second');
          // }, 2000);
          // setTimeout(() => {
          //   console.log('Pushing 4');
          //   navigation.push('Second');
          // }, 3000);
          // setTimeout(() => {
          //   console.log('Pushing 5');
          //   navigation.push('Second');
          // }, 4000);
        }}
        title="Click me"
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ freezeOnBlur: false }} />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
