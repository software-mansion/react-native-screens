import React from 'react';
import { Button, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const Stack = createNativeStackNavigator();

function Second(props: Props) {
  return (
    <View>
      <Button
        title="Navigate to First"
        onPress={() => props.navigation.navigate('First')}
      />
    </View>
  );
}

function First(props: Props) {
  return (
    <View>
      <Button
        title="Navigate to Second"
        onPress={() => props.navigation.navigate('Second')}
      />
    </View>
  );
}

const App = (): JSX.Element => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: 'pink',
            },
          }}
          initialRouteName="First">
          <Stack.Screen
            name="Second"
            component={Second}
            options={{
              stackPresentation: 'modal',

              headerLeft: () => <View />,
            }}
          />
          <Stack.Screen name="First" component={First} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
