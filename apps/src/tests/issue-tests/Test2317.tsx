import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Button, StyleSheet, Text, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Colors, DarkColors, LightColors } from '../../shared/styling/Colors';

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
                <Text
                  style={{
                    color: isDarkMode ? Colors.NavyLight80 : Colors.NavyDark80,
                  }}>
                  Header Title
                </Text>
              ),
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
        {
          backgroundColor: isDarkMode
            ? DarkColors.background
            : LightColors.background,
        },
      ]}>
      <Text style={{ color: Colors.PurpleDark140 }}>FullScreenModal</Text>
      <Button title="Go back" onPress={navigation.goBack} />
    </SafeAreaView>
  );
};

const MainScreen = ({
  navigation,
}: NativeStackScreenProps<Record<string, object | undefined>>) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? DarkColors.background
            : LightColors.background,
        },
      ]}>
      <Text style={{ color: isDarkMode ? Colors.OffWhite : Colors.OffNavy }}>
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
    alignItems: 'center',
  },
});

export default App;
