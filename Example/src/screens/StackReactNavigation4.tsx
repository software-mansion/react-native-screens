import React from 'react';
import { View, Text, StyleSheet, I18nManager } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { createCompatNavigatorFactory } from '@react-navigation/compat';

// in this example we use compatibility layer to show v4 syntax within v5 project
// but normally with v4 you would use different import
// import createNativeStackNavigator from 'react-native-screens/createNativeStackNavigator';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
// more information about compatibility layer https://reactnavigation.org/docs/compatibility/

import { Button } from '../shared';

class HomeScreen extends React.Component<{ navigation: NavigationStackProp }> {
  render() {
    return (
      <View style={{ ...styles.container, backgroundColor: 'moccasin' }}>
        <Text style={styles.text}>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        <Button
          title="🔙 Back to Examples"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component<{
  navigation: NavigationStackProp;
}> {
  render() {
    const colors = [
      'skyblue',
      'palevioletred',
      'peachpuff',
      'mistyrose',
      'darkseagreen',
      'lavender',
    ];
    return (
      <View
        style={{
          ...styles.container,
          backgroundColor:
            colors[Math.floor(Math.random() * Math.floor(colors.length))],
        }}>
        <Text style={styles.text}>Details Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Details')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}

// we run it with compatibility layer to use react-navigation v5 in the project
// normally in v4 it would be just
// const AppNavigator = createNativeStackNavigator(
const AppNavigator = createCompatNavigatorFactory(createNativeStackNavigator)(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'blue',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      title: 'react-navigation v4',
      headerHideBackButton: true,
      direction: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  text: {
    textAlign: 'center',
  },
});

export default AppNavigator;
