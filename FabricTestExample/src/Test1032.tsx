/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Alert, Button, Switch, Text, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [gestureEnabled, setGestureEnable] = React.useState(false);
  return (
    <View style={{ flex: 1, paddingBottom: 200 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ gestureEnabled }}>
          <Stack.Screen name="Top" component={First} />
          <Stack.Screen name="Top1" component={Second} />
        </Stack.Navigator>
      </NavigationContainer>
      <View>
        <Text>Gesture enabled</Text>
        <Switch value={gestureEnabled} onValueChange={setGestureEnable} />
      </View>
    </View>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{ backgroundColor: '#FFF' }}>
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.push('Top1')}
      />
    </View>
  );
}

function Second() {
  return (
    <View style={{ backgroundColor: '#FFF' }}>
      <Button
        title="Swipe back to see if button click triggers"
        onPress={() => Alert.alert('Click detected')}
      />
    </View>
  );
}
