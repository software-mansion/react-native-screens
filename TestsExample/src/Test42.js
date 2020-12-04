// connected PRs: #679, #675
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, Text, View, Button} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

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
          name="Profile"
          component={TabNavigator}
          options={{
            screenOrientation: 'landscape',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();

const TabNavigator = (props) => (
  <Tab.Navigator screensEnabled={true}>
    <Tab.Screen name="Tab1" component={Home} />
    <Tab.Screen name="Tab2" component={Inner} />
    <Tab.Screen name="Tab3" component={Home} />
  </Tab.Navigator>
);

const NestedTab = createBottomTabNavigator();

const NestedTabNavigator = (props) => (
  <NestedTab.Navigator screensEnabled={true}>
    <NestedTab.Screen name="Tab1" component={Home} />
  </NestedTab.Navigator>
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
        title="Profile"
        onPress={() => {
          navigation.push('Profile');
        }}
      />
      <Button
        title="status bar style"
        onPress={() => {
          navigation.setOptions({
            screenOrientation: Math.random() > 0.5 ? 'portrait' : 'landscape',
          });
          setYes(!yes);
        }}
      />
    </ScrollView>
  );
}

function Profile({navigation}) {
  const [yes, setYes] = React.useState(true);
  return (
    <ScrollView style={{backgroundColor: 'red'}}>
      <Text>Profile</Text>
      <Button
        title="Home"
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
      <Button
        title="One more Profile"
        onPress={() => {
          navigation.push('Profile');
        }}
      />
      <Button
        title="status bar style"
        onPress={() => {
          navigation.setOptions({
            statusBarHidden: yes,
          });
          setYes(!yes);
        }}
      />
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
