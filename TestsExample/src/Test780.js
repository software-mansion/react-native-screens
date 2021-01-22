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
import {enableScreens} from 'react-native-screens';
import {NavigationContainer} from '@react-navigation/native';

enableScreens();

const Stack = createNativeStackNavigator();

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
    </View>
  );
};

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="home"
      options={{
        title: 'Home',
        headerLargeTitle: true,
        headerStyle: {
          headerLargeTitle: true,
        },
      }}
      component={HomeScreen}
    />
    <Stack.Screen
      name="nestedScreen"
      options={{title: 'Nested'}}
      component={NestedScreen}
    />
  </Stack.Navigator>
);

const ModalStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="modalScreen"
      options={{title: 'Modal', statusBarStyle: 'light'}}
      component={ModalScreen}
    />
    <Stack.Screen
      name="modalNestedScreen"
      options={{title: 'Nested', statusBarStyle: 'light'}}
      component={NestedScreen}
    />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode="none"
        screenOptions={{
          stackPresentation: 'modal',
        }}>
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
          }}
          component={HomeStack}
        />
        <Stack.Screen
          name="nestedScreen"
          options={{title: 'Nested'}}
          component={NestedScreen}
        />
        <Stack.Screen name="modalScreen" component={ModalStack} />
      </Stack.Navigator>
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
