import React, {useLayoutEffect} from 'react';
import {Button, View} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {NavigationContainer, RouteProp} from '@react-navigation/native';

type StackParamList = {
  Details: {index: number};
};
interface DetailsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Details'>;
  route: RouteProp<StackParamList, 'Details'>;
}

const DetailsScreen = ({
  navigation,
  route,
}: DetailsScreenProps): JSX.Element => {
  const index = route.params?.index ? route.params?.index : 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Details screen #${index}`,
    });
  }, [navigation]);

  return (
    <View>
      <Button
        title={`More details ${index}`}
        onPress={() => navigation.push('Details', {index: index + 1})}
      />
    </View>
  );
};

const Stack = createNativeStackNavigator();

const App = (): JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
