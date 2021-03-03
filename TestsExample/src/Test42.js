// connected PRs: #679, #675
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View, Button, Text} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createNativeStackNavigator();

export default function NativeNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackPresentation: 'modal',
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            screenOrientation: 'portrait_up',
          }}
        />
        <Stack.Screen
          name="NestedNavigator"
          component={NestedNavigator}
          options={{
            screenOrientation: 'landscape',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// change to createStackNavigator to test with stack in the middle
const Tab = createBottomTabNavigator();

const NestedNavigator = (props) => (
  <Tab.Navigator screensEnabled={true}>
    <Tab.Screen name="Screen1" component={Home} />
    <Tab.Screen name="Screen2" component={Inner} />
    <Tab.Screen name="Screen3" component={Home} />
  </Tab.Navigator>
);

const InnerStack = createNativeStackNavigator();

const Inner = (props) => (
  <InnerStack.Navigator
    screenOptions={{
      screenOrientation: 'portrait_down',
    }}>
    <InnerStack.Screen name="DeeperHome" component={Home} />
  </InnerStack.Navigator>
);

function Home({navigation}) {
  const [yes, setYes] = React.useState(true);
  return (
    <ScrollView
      style={{backgroundColor: 'yellow'}}
      contentInsetAdjustmentBehavior="automatic"
      >
      <View style={styles.leftTop} />
      <Button
        title="NestedNavigator"
        onPress={() => {
          navigation.push('NestedNavigator');
        }}
      />
      <Button
        title="Screen2"
        onPress={() => {
          navigation.navigate('Screen2');
        }}
      />
      <Button
        title="Pop one modal"
        onPress={() => {
          navigation.pop();
        }}
      />
      <Button
        title="Randomly change screen orientation"
        onPress={() => {
          navigation.setOptions({
            screenOrientation: Math.random() > 0.5 ? 'portrait' : 'landscape',
          });
          setYes(!yes);
        }}
      />
      <Text>Go to `TabNavigator` and then go to second tab there. Spot the difference between dismissing modal with a swipe and with a `Pop to top` button. </Text> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
