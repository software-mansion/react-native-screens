import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import React, {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {useEffect} from 'react';

const Stack = createNativeStackNavigator();

type NavigationProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

type ListElementProps = {
  id: number;
};

function ListElement(props: ListElementProps) {
  return (
    <View style={styles.container}>
      <Text>{props.id}</Text>
    </View>
  );
}

function First(props: NavigationProps) {
  const handlePress = function () {
    props.navigation.navigate('Second');
  };

  // useEffect(() => {
  //   const intervalHandle = setInterval(() => {
  //     handlePress();
  //   }, 1000);
  //
  //   return () => {
  //     clearInterval(intervalHandle);
  //   };
  // }, []);

  return (
    <View>
      <Button title="Navigate to the second screen" onPress={handlePress} />
    </View>
  );
}

function Second(props: NavigationProps) {
  const handlePress = function () {
    props.navigation.navigate('First');
  };

  // useEffect(() => {
  //   const intervalHandle = setInterval(() => {
  //     handlePress();
  //   }, 1000);
  //
  //   return () => {
  //     clearInterval(intervalHandle);
  //   };
  // }, []);

  return (
    // <View>
    //   <Button title="Navigate to the first screen" onPress={handlePress} />
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
      {[...Array(100).keys()].map(i => (
        <ListElement key={i} id={i} />
      ))}
    </ScrollView>
    // </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="First">
        <Stack.Screen
          name="First"
          component={First}
          options={{
            fullScreenGestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            fullScreenGestureEnabled: true,
            headerLargeTitle: true,
            headerTitle: 'omega',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
