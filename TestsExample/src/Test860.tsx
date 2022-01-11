import React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {ScrollView, Button, Text} from 'react-native';
import {createNativeStackNavigator, NativeStackNavigationProp, NativeStackNavigationOptions} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {createStackNavigator} from '@react-navigation/stack';

const Stack = createNativeStackNavigator();

export default function NativeNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackPresentation: 'push',
          stackAnimation: 'slide_from_right',
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            statusBarColor: 'rgba(0,0,255,0.25)',
            statusBarAnimation: 'slide',
            statusBarStyle: 'dark',
            statusBarTranslucent: true,
            statusBarHidden: false,
            navigationBarColor: 'green',
            navigationBarHidden: false,
          }}
        />
        <Stack.Screen
          name="NestedNavigator"
          component={NestedNavigator}
          options={{
            statusBarColor: 'red',
            statusBarAnimation: 'slide',
            statusBarStyle: 'dark',
            statusBarHidden: true,
            statusBarTranslucent: true,
            headerTopInsetEnabled: false,
            navigationBarColor: 'blue',
            navigationBarHidden: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// change to createStackNavigator to test with stack in the middle
const Tab = createBottomTabNavigator();

const NestedNavigator = () => (
  <Tab.Navigator screenOptions={{           
    //  statusBarColor: 'purple',
    //  statusBarStyle: 'light',
  }}>
    <Tab.Screen name="Screen1" component={Home} />
    <Tab.Screen name="Screen2" component={Inner} />
    <Tab.Screen name="Screen3" component={Home}
      options={{
        // statusBarColor: 'powderblue', 
        // statusBarStyle: 'dark',
      }}
      />
  </Tab.Navigator>
);

const InnerStack = createNativeStackNavigator();

const Inner = () => (
  <InnerStack.Navigator
    screenOptions={{
      statusBarColor: 'pink',
      statusBarAnimation: 'none',
      statusBarStyle: 'auto',
      headerTopInsetEnabled: false,
      navigationBarColor: 'pink',
      // headerShown: false,
    }}>
    <InnerStack.Screen name="DeeperHome" component={Home} />
  </InnerStack.Navigator>
);

function Home({navigation}: {navigation: NativeStackNavigationProp<ParamListBase>}) {
  const [statusBarColor, setStatusBarColor] = React.useState('mediumseagreen');
  const [statusBarStyle, setStatusBarStyle] = React.useState<NativeStackNavigationOptions['statusBarStyle']>('dark');
  const [statusBarHidden, setStatusBarHidden] = React.useState(false);
  const [statusBarTranslucent, setStatusBarTranslucent] = React.useState(true);
  const [statusBarAnimation, setStatusBarAnimation] = React.useState<NativeStackNavigationOptions['statusBarAnimation']>('slide');
  const [navigationBarColor, setNavigationBarColor] = React.useState('green');
  const [navigationBarHidden, setNavigationBarHidden] = React.useState(false);
  const [headerTopInsetEnabled, setHeaderTopInsetEnabled] = React.useState(false);

  return (
    <ScrollView
      style={{backgroundColor: 'yellow'}}
      contentInsetAdjustmentBehavior="automatic"
      >
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
        title="Change status bar color"
        onPress={() => {
          navigation.setOptions({
            statusBarColor,
          });
          setStatusBarColor(statusBarColor === 'mediumseagreen' ? 'rgba(255,128,128,0.5)' : 'mediumseagreen');
        }}
      />
      <Button
        title="Change status bar color in parent native-stack"
        onPress={() => {
          navigation.dangerouslyGetParent()?.dangerouslyGetParent()?.setOptions({
            statusBarColor,
          });
          setStatusBarColor(statusBarColor === 'mediumseagreen' ? 'orange' : 'mediumseagreen');
        }}
      />
      <Button
        title="Change status bar style"
        onPress={() => {
          navigation.setOptions({
            statusBarStyle,
          });
          setStatusBarStyle(statusBarStyle === 'light' ? 'dark' : 'light');
        }}
      />
      <Button
        title="Change status bar hidden"
        onPress={() => {
          navigation.setOptions({
            statusBarHidden,
          });
          setStatusBarHidden(!statusBarHidden);
        }}
      />
      <Button
        title="Change status bar top inset"
        onPress={() => {
          navigation.setOptions({
            headerTopInsetEnabled,
          });
          setHeaderTopInsetEnabled(!headerTopInsetEnabled);
        }}
      />
            <Button
        title="Change status bar translucent"
        onPress={() => {
          navigation.setOptions({
            statusBarTranslucent,
          });
          setStatusBarTranslucent(!statusBarTranslucent);
        }}
      />
            <Button
        title="Change status bar animation"
        onPress={() => {
          navigation.setOptions({
            statusBarAnimation,
          });
          setStatusBarAnimation(statusBarAnimation === 'none' ? 'slide' : 'none');
        }}
      />
      <Button
        title="Change navigation bar color"
        onPress={() => {
          navigation.setOptions({
            navigationBarColor,
          });
          setNavigationBarColor(navigationBarColor === 'green' ? 'powderblue' : 'green');
        }}
      />
      <Button
        title="Change navigation bar hidden"
        onPress={() => {
          navigation.setOptions({
            navigationBarHidden,
          });
          setNavigationBarHidden(!navigationBarHidden);
        }}
      />
      <Text>Go to `TabNavigator` and then go to second tab there. Spot the difference between dismissing modal with a swipe and with a `Pop to top` button. </Text> 
    </ScrollView>
  );
}
