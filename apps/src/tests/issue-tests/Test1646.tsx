import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import { Button, View } from 'react-native';

type StackParamList = {
  Screen: { title?: string; count?: number } | undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          // headerBackTitle: 'NavHeader',
          // disableBackButtonMenu: true,
        }}>
        <Stack.Screen
          name="Screen"
          component={Screen}
          options={({ route }) => ({
            title: route.params?.title ?? 'Hello',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Screen({
  navigation,
  route,
}: NativeStackScreenProps<StackParamList, 'Screen'>) {
  const count = route.params?.count ?? 0;

  // React.useEffect(() => {
  //   navigation.setOptions({headerBackButtonDisplayMode: count % 2 === 0 ? 'default' : 'minimal'});
  // }, [count, navigation]);

  // React.useEffect(() => {
  //   navigation.setOptions({headerBackTitle: `Custom ${count}`})
  // }, [count, navigation]);

  return (
    <View>
      <Button
        onPress={() =>
          navigation.push('Screen', {
            title: `Hello ${count + 1}`,
            count: count + 1,
          })
        }
        title="Push a route"
      />
    </View>
  );
}
