import * as React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{gestureEnabled: true}}>
          <Stack.Screen
            name="First"
            component={First}
            options={{
              gestureEnabled: true,
              headerTranslucent: true,
              searchBar: {
                placeholder: 'Interesting places...',
                obscureBackground: false,
                hideWhenScrolling: false,
              },
            }}
          />
          <Stack.Screen
            name="Second"
            component={Second}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <ScrollView
      style={{
        backgroundColor: '#000',
        flex: 1,
      }}
      contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView>
        <Button
          title="Tap me for second screen"
          onPress={() => {
            navigation.push('Second');
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{backgroundColor: '#777', flex: 1, justifyContent: 'center'}}>
      <Button
        title="Tap me to go back"
        onPress={() => {
          navigation.pop();
        }}
      />
      <Button
        title="Open this screen again"
        onPress={() => navigation.push('Second')}
      />
    </View>
  );
}
