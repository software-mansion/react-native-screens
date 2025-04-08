import * as React from 'react';
import { Button, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
// Cases:
import DefaultHeader from './cases/DefaultHeader';
import CustomBackTitle from './cases/CustomBackTitle';
import CustomBackLongTitle from './cases/CustomBackLongTitle';

const Stack = createNativeStackNavigator();

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: 'yellow', justifyContent: 'center' }}>
      <Button
        title="DefaultHeader"
        onPress={() => navigation.navigate('DefaultHeader')}
      />
      <Button
        title="CustomBackTitle"
        onPress={() => navigation.navigate('CustomBackTitle')}
      />
      <Button
        title="CustomBackLongTitle"
        onPress={() => navigation.navigate('CustomBackLongTitle')}
      />
      <Button
        title="Go back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="DefaultHeader" component={DefaultHeader} />
        <Stack.Screen name="CustomBackTitle" component={CustomBackTitle} />
        <Stack.Screen name="CustomBackLongTitle" component={CustomBackLongTitle} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
