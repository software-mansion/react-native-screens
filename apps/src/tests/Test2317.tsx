import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Button, StyleSheet, Text, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Stack = createNativeStackNavigator();

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="modal"
            component={FullScreenModal}
            options={({}) => ({
              presentation: 'fullScreenModal',
              headerTitle: () => (
                <Text style={{ color: isDarkMode ? Colors.light : Colors.dark }}>
                  Header Title
                </Text>
              )
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const FullScreenModal = ({ navigation }: NativeStackScreenProps<{}>) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.darker : Colors }
      ]}
    >
      <Text style={{ color: Colors.light }}>FullScreenModal</Text>
      <Button title="Go back" onPress={navigation.goBack} />
    </SafeAreaView>
  );
};

const MainScreen = ({
  navigation
}: NativeStackScreenProps<Record<string, object | undefined>>) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }
      ]}
    >
      <Text style={{ color: isDarkMode ? Colors.light : Colors.dark }}>
        Main Screen
      </Text>
      <Button title="Press" onPress={() => navigation.navigate('modal')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;
