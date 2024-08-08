import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button } from '../shared';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';

interface RouteProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const MainScreen = ({ navigation }: RouteProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'moccasin' }}>
    <Button
      title="Push 2 screens at once"
      onPress={() => {
        navigation.navigate('Detail');
        navigation.navigate('Detail2');
      }}
    />
    <Button
      title="Open nested stack"
      onPress={() => {
        navigation.navigate('NestedStack');
      }}
    />
  </View>
);

const NestedMainScreen = ({ navigation }: RouteProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'moccasin' }}>
    <Button
      title="Go to detail"
      onPress={() => {
        navigation.navigate('Detail');
        navigation.navigate('Detail2');
      }}
    />
    <Button
      title="Pop stack"
      onPress={() => {
        navigation.goBack();
      }}
    />
  </View>
);


const DetailScreen = ({ navigation }: RouteProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'thistle' }}>
    <Button
      title="Go back"
      onPress={() => navigation.goBack()}
    />
  </View>
);

const DetailScreen2 = ({
  navigation,
}: RouteProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'yellow' }}>
    <Button
      title="Go back"
      onPress={() => navigation.goBack()}
    />
  </View>
);

const NestedStackScreen = (): React.JSX.Element => (
  <NestedStack.Navigator screenOptions={{ headerBackVisible: false }}>
    <NestedStack.Screen name="NestedDetail" component={NestedMainScreen} />
    <Stack.Screen name="Detail" component={DetailScreen} />
    <Stack.Screen name="Detail2" component={DetailScreen2} />
  </NestedStack.Navigator>
)

const Stack = createNativeStackNavigator<ParamListBase>();
const NestedStack = createNativeStackNavigator<ParamListBase>();

const App = (): React.JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerBackVisible: false,
      }}>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ title: 'Simple Native Stack' }}
      />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Detail2" component={DetailScreen2} />
      <Stack.Screen name="NestedStack" component={NestedStackScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});

export default App;
