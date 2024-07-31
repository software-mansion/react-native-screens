import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SearchBarProps } from 'react-native-screens';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title="Details" onPress={() => navigation.navigate('Details')} />
      <Button
        title="Details2"
        onPress={() => navigation.navigate('Details2')}
      />
    </View>
  );
}
function DetailScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>DetailScreen</Text>
      <Button title={'go back'} onPress={navigation.goBack} />
    </View>
  );
}

function App(): React.JSX.Element {
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
              } as SearchBarProps,
            }}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Group
            screenOptions={{
              headerShown: false,
              presentation: 'transparentModal',
            }}>
            <Stack.Screen name="Details" component={DetailScreen} />
          </Stack.Group>

          <Stack.Screen
            options={{
              presentation: 'modal',
            }}
            name="Details2"
            component={DetailScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    minHeight: 300,
    alignItems: 'center',
  },
});
