// connected PRs: #679, #675
import React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {ScrollView, View, Button} from 'react-native';
import {createNativeStackNavigator, NativeStackNavigationProp} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackPresentation: "modal",
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            statusBarStyle: 'dark',
          }}
        />
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{
            statusBarStyle: 'dark',
          }}
        />
        <Stack.Screen
          name="Home2"
          component={Home}
          options={{
            statusBarStyle: 'light',
            stackPresentation: "fullScreenModal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Tab1" component={Home} />
    <Tab.Screen name="Tab2" component={Inner} />
    <Tab.Screen name="Tab3" component={Home} />
  </Tab.Navigator>
);

const InnerStack = createNativeStackNavigator();

const Inner = () => (
  <InnerStack.Navigator
    screenOptions={{
      statusBarStyle: 'dark',
    }}>
    <InnerStack.Screen name="DeeperHome" component={Home} />
  </InnerStack.Navigator>
);

function Home({navigation}: Props) {
  const [yes, setYes] = React.useState(true);
  return (
    <ScrollView
      style={{backgroundColor: 'rgba(255,255,0,0.5)'}}
      contentInsetAdjustmentBehavior="automatic"
      >
      <View />
      <Button
        title="TabNavigator"
        onPress={() => {
          navigation.push('TabNavigator');
        }}
      />
      <Button
        title="Home2"
        onPress={() => {
          navigation.push('Home2');
        }}
      />
      <Button
        title="status bar style"
        onPress={() => {
          navigation.setOptions({
            statusBarStyle: yes ? 'light' : 'dark',
          });
          setYes(!yes);
        }}
      />
      <Button
        title="Change title"
        onPress={() => {
          navigation.setOptions({
            title: yes ? 'Home' : 'NotHome',
          });
          setYes(!yes);
        }}
      />
      <Button
        title="Pop one modal"
        onPress={() => {
          navigation.pop();
        }}
      />
    </ScrollView>
  );
}
