import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type StackParamList = {
  Home: undefined;
  Details: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Home'>) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Open Modal"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}
function DetailScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Details'>) {
  return (
    <View style={styles.container}>
      <Text>DetailScreen</Text>
      <Button title={'Bo Back'} onPress={navigation.goBack} />
    </View>
  );
}

export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              headerSearchBarOptions: {
                autoCapitalize: 'none',
                placement: 'stacked',
                hideWhenScrolling: false,
                shouldShowHintSearchIcon: false,
                hideNavigationBar: true,
                tintColor: 'blue',
                textColor: 'black',
                hintTextColor: 'black',
                headerIconColor: 'black',
              },
            }}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
