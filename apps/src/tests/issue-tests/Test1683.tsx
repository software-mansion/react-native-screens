import { View, StyleSheet, Button } from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useContext, useState } from 'react';

const RootStack = createNativeStackNavigator();

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: DefaultTheme,
  setTheme: () => {},
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
            headerSearchBarOptions: {
              // Added in https://github.com/software-mansion/react-native-screens/pull/3186
              // to preserve test's original search bar configuration.
              placement: 'stacked',
            },
            // statusBarStyle: 'light',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const [theme, setTheme] = useState<Theme>(DefaultTheme);
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
