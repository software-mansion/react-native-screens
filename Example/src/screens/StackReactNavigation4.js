import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {enableScreens} from 'react-native-screens';
import {createCompatNavigatorFactory} from '@react-navigation/compat';

// in this example we use compatibility layer to show v4 syntax within v5 project
// but normally with v4 you would use different import
// import createNativeStackNavigator from 'react-native-screens/createNativeStackNavigator';	
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
// more information about compatibility layer https://reactnavigation.org/docs/compatibility/

import {Button} from '../shared';

enableScreens()

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
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

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
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

// we run it with compatibilty layer to use react-navigation v5 in project
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
    },
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  text: {
    textAlign: 'center',
  }
});

export default AppNavigator;
