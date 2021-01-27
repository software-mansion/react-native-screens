import React, {useState} from 'react';
import {
  View,
  Button,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const HomeScreen = ({navigation}) => (
  <ScrollView>
    <View style={styles.screen}>
      <Button
        onPress={() => navigation.navigate('modalScreen')}
        title="Open modal"
      />
      <Button
        onPress={() => navigation.navigate('nestedScreen')}
        title="Open nested screen"
      />
    </View>
  </ScrollView>
);

const ModalScreen = ({navigation}) => (
  <View style={styles.screen}>
    <Button
      onPress={() => navigation.navigate('modalNestedScreen')}
      title="Open nested screen"
    />
  </View>
);

const NestedScreen = () => {
  const [count, setCount] = useState(0);
  return (
    <View>
      <TouchableHighlight
        underlayColor="#DEDEDE"
        style={styles.touchable}
        onPress={() => setCount(count + 1)}>
        <Text>{`Press count: ${count}`}</Text>
      </TouchableHighlight>
      <Text>Change nested stacks to "normal" stack navigators to spot buggy behavior in native-stack's modal if fix in RNGH (#1323) not applied</Text>
    </View>
  );
};

const NestedStack = createNativeStackNavigator();

const HomeStack = () => (
  <NestedStack.Navigator>
    <NestedStack.Screen
      name="home"
      component={HomeScreen}
    />
    <NestedStack.Screen
      name="nestedScreen"
      component={NestedScreen}
    />
  </NestedStack.Navigator>
);

const ModalStack = ({navigation}) => (
  <NestedStack.Navigator>
    <NestedStack.Screen
      name="modalScreen"
      component={ModalScreen}
    />
    <NestedStack.Screen
      name="modalNestedScreen"
      component={NestedScreen}
    />
  </NestedStack.Navigator>
);

const MainStack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <MainStack.Navigator
        screenOptions={{
          stackPresentation: 'modal',
        }}>
        <MainStack.Screen
          name="home"
          component={HomeStack}
        />
        <MainStack.Screen name="modalScreen" component={ModalStack} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
  },
  touchable: {
    padding: 24,
  },
});

export default App;
