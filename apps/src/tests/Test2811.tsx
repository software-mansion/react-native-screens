import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

type StackRouteParamList = {
  Home: undefined;
};

type StackRouteNavProps = {
  navigation: NativeStackNavigationProp<StackRouteParamList>;
};

const Stack = createNativeStackNavigator<StackRouteParamList>();

function Home({ navigation }: StackRouteNavProps) {

  React.useEffect(() => {
    const timerHandle = setTimeout(() => {
      navigation.setOptions({
        headerRight: () => <HeaderSubview size={20} />,
      });
    }, 1500);

    return () => {
      clearTimeout(timerHandle);
    };
  }, [navigation]);

  //React.useEffect(() => {
  //  navigation.setOptions({
  //    headerRight: () => <HeaderSubview size={20} />,
  //  });
  //}, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'seagreen' }}>
      <Text>Home</Text>
    </View>
  );
}

function HeaderSubview({ size }: { size?: number }) {
  const finalSize = size ?? 20;
  return (
    <View style={{ backgroundColor: 'crimson', width: finalSize, height: finalSize, maxHeight: finalSize }} />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{
          //headerRight: () => <HeaderSubview size={20} />,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
