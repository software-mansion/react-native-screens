import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

enableScreens();

class DetailsScreen extends React.Component {
  componentDidMount() {
    this.props.navigation.setOptions({
      title: `Details screen #${this.getIndex()}`,
    });
  }

  getIndex() {
    const { params } = this.props.route;
    return params && params.index ? params.index : 0;
  }

  render() {
    const index = this.getIndex();
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title={`More details ${index}`}
          onPress={() =>
            this.props.navigation.push('Details', {
              index: index + 1,
            })
          }
        />
      </View>
    );
  }
}

const createStack = () => {
  const Stack = createStackNavigator();

  return () => (
    <Stack.Navigator>
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};
const AStack = createStack();
const BStack = createStack();
const CStack = createStack();
const DStack = createStack();

const Tab = createBottomTabNavigator();

const NavigationTabsAndStack = () => (
  <Tab.Navigator>
    <Tab.Screen name="A" component={AStack} />
    <Tab.Screen name="B" component={BStack} />
    <Tab.Screen name="C" component={CStack} />
    <Tab.Screen name="D" component={DStack} />
  </Tab.Navigator>
);

export default NavigationTabsAndStack;
