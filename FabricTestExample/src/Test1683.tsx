// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {View, StyleSheet, Button, useColorScheme} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  Theme,
} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import React, {createContext, useContext, useState} from 'react';

const RootStack = createNativeStackNavigator();

const ThemeContext = createContext({
  theme: DefaultTheme,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTheme: (theme: Theme) => {},
});

const SearchBarContext = createContext({
  theme: 'default',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTheme: (theme: 'default' | 'black') => {},
});

const HomeScreen = () => {
  const sbThemeContext = useContext(SearchBarContext);
  const {theme, setTheme} = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Button
        title="Toggle theme"
        onPress={() => {
          console.log('Button pressed');
          setTheme(theme === DefaultTheme ? DarkTheme : DefaultTheme);
        }}
      />
      <Button
        title="Toggle SearchBar theme"
        onPress={() => {
          const newTheme =
            sbThemeContext.theme === 'black' ? 'default' : 'black';
          console.log(`SearchBar theme set to ${newTheme}`);
          sbThemeContext.setTheme(newTheme);
        }}
      />
    </View>
  );
};

const Navigator = () => {
  const sbThemeContext = useContext(SearchBarContext);
  const {theme} = useContext(ThemeContext);
  // const scheme = useColorScheme();
  return (
    <NavigationContainer
      // theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
      theme={theme}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            searchBar: {
              textColor: 'rgb(255, 0, 0)',
              theme: sbThemeContext.theme,
              // barTintColor: 'rgb(0, 255, 0)',
              // tintColor: 'rgb(0, 255, 0)',
            },
            // headerSearchBarOptions: {},
            // searchBar: {
            //   style: 'default',
            // },
            // statusBarStyle: 'light',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const [theme, setTheme] = useState(DefaultTheme);
  const [sbTheme, setSbTheme] = useState('default');
  return (
    <ThemeContext.Provider value={{theme: theme, setTheme: setTheme}}>
      <SearchBarContext.Provider value={{theme: sbTheme, setTheme: setSbTheme}}>
        <Navigator />
      </SearchBarContext.Provider>
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
