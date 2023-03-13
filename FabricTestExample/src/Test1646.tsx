import {NavigationContainer, useRoute} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import * as React from 'react';
import {Button, View} from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          // headerBackTitle: 'NavHeader',
          // disableBackButtonMenu: true,
        }}>
        <Stack.Screen
          name="Screen"
          component={Screen}
          options={({route}: any) => ({title: route.params?.title ?? 'Hello'})}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Screen({navigation}: any) {
  const route = useRoute<any>();
  const count = route.params?.count ?? 0;

  // React.useEffect(() => {
  //   navigation.setOptions({headerBackTitleVisible: count % 2 === 0});
  // }, [count, navigation]);

  // React.useEffect(() => {
  //   navigation.setOptions({headerBackTitle: `Custom ${count}`})
  // }, [count, navigation]);

  return (
    <View>
      <Button
        onPress={() =>
          navigation.push(route.name, {
            title: `Hello ${count + 1}`,
            count: count + 1,
          })
        }
        title="Push a route"
      />
    </View>
  );
}
