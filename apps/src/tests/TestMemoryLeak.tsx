import React from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, ColorValue, ScrollView, Text, View } from "react-native";

type HomeParams = {
  backgroundColor: ColorValue;
  forward: boolean;
}

type StackParamList = {
  Home: HomeParams;
  SecondHome: HomeParams;
  ThirdHome: HomeParams;
};

type BaseRouteProps = {
  navigation: NativeStackNavigationProp<StackParamList>;
  route: RouteProp<StackParamList>;
}

const Stack = createNativeStackNavigator<StackParamList>();

function Home({ navigation, route }: BaseRouteProps): React.JSX.Element {
  const params = route.params;

  React.useEffect(() => {
    setTimeout(() => {
      if (!params.forward) {
        navigation.popTo('Home', { backgroundColor: 'lightsalmon', forward: true });
      } else if (route.name === 'Home') {
        navigation.push('SecondHome', { backgroundColor: 'seagreen', forward: true });
      } else if (route.name === 'SecondHome') {
        navigation.push('ThirdHome', { backgroundColor: 'lightblue', forward: false });
      }
    }, 1000)
  })

  return (
    <View style={{ flex: 1, backgroundColor: params.backgroundColor ?? 'red' }}>
      <ScrollView>
      {[...Array(100).keys()].map((index) => {
        return (
          <Text key={index.toString()}>{index}</Text>
        );
      })}
      </ScrollView>
    </View>
  );
}


function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} initialParams={{ backgroundColor: 'lightsalmon', forward: true }} />
        <Stack.Screen name="SecondHome" component={Home} initialParams={{ backgroundColor: 'goldenrod', forward: true }} />
        <Stack.Screen name="ThirdHome" component={Home} initialParams={{ backgroundColor: 'lightblue', forward: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
