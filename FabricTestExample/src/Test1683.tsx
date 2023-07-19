// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { View, StyleSheet, Button, useColorScheme } from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  Theme,
} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import React, { createContext, useContext, useState } from 'react';

const RootStack = createNativeStackNavigator();

const ThemeContext = createContext({
  theme: DefaultTheme,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTheme: (theme: Theme) => {},
});

const HomeScreen = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Button
        title="Toggle theme"
        onPress={() => {
          console.log('Button pressed');
          setTheme(theme === DefaultTheme ? DarkTheme : DefaultTheme);
        }}
      />
    </View>
  );
};

const Navigator = () => {
  const { theme } = useContext(ThemeContext);
  // const scheme = useColorScheme();
  return (
    <NavigationContainer
      // theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
      theme={theme}
      // theme={DarkTheme}
    >
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            // headerSearchBarOptions: {},
            searchBar: {},
            // statusBarStyle: 'light',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const [theme, setTheme] = useState(DefaultTheme);
  return (
    <ThemeContext.Provider value={{ theme: theme, setTheme: setTheme }}>
      <Navigator />
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
});
