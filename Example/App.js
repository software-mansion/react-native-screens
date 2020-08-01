import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';

import Stack from './stack';
import NativeStack from './nativeStack';
import Tabs from './tabs';
import Navigation from './navigation';
import NativeNavigation from './nativeNavigation';
import NavigationTabsAndStack from './navigationTabsAndStack';

enableScreens();

const SCREENS = {
  Stack: { Screen: Stack, title: 'Screen container based stack' },
  NativeStack: { Screen: NativeStack, title: 'Native stack example' },
  Tabs: { Screen: Tabs, title: 'Tabs example' },
  NativeNavigation: {
    Screen: NativeNavigation,
    title: 'Native stack bindings for RNN',
  },
  Navigation: {
    Screen: Navigation,
    title: 'React Navigation with screen enabled',
  },
  NavigationTabsAndStack: {
    Screen: NavigationTabsAndStack,
    title: 'React Navigation Tabs + Stack',
  },
};

class MainScreen extends React.Component {
  static navigationOptions = {
    title: '📱 React Native Screens Examples',
  };
  render() {
    const data = Object.keys(SCREENS).map((key) => ({ key }));
    return (
      <FlatList
        style={styles.list}
        data={data}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={(props) => (
          <MainScreenItem
            {...props}
            onPressItem={({ key }) => this.props.navigation.navigate(key)}
          />
        )}
      />
    );
  }
}

const ItemSeparator = () => <View style={styles.separator} />;

class MainScreenItem extends React.Component {
  _onPress = () => this.props.onPressItem(this.props.item);
  render() {
    const { key } = this.props.item;
    return (
      <TouchableHighlight onPress={this._onPress}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{SCREENS[key].title || key}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const MainScreenStack = createStackNavigator();

const ExampleApp = () => (
  <NavigationContainer>
    <MainScreenStack.Navigator>
      <MainScreenStack.Screen name="Main" component={MainScreen} />
      {Object.keys(SCREENS).map((name) => {
        const { Screen, title } = SCREENS[name];
        return (
          <MainScreenStack.Screen
            key={name}
            name={name}
            component={Screen}
            options={{ title }}
          />
        );
      })}
    </MainScreenStack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#EFEFF4',
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBE0',
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ExampleApp;
