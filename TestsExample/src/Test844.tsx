import React, {useEffect, useRef} from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const defaultOptions = {
  headerHideShadow: true,
  headerTintColor: 'red',
  headerStyle: {
    backgroundColor: '#f0f0f0',
  },
  contentStyle: {
    backgroundColor: '#f0f0f0',
  },
};

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

function Main({navigation}: Props) {
  const times = useRef(8);
  const id = useRef<any>(0);

  useEffect(() => {
    id.current = setInterval(() => {
      if (times.current) {
        navigation.navigate('modal-stack');
        setTimeout(() => navigation.goBack(), 500);
        times.current--;
      } else {
        clearInterval(id.current);
      }
    }, 1500);
    return () => clearInterval(id.current);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Button
        title="modal"
        onPress={() => navigation.navigate('modal-stack')}
      />
    </View>
  );
}

const Modal = ({navigation}: Props) => (
  <View style={styles.container}>
    <Button title="back" onPress={() => navigation.goBack()} />
  </View>
);

const ModalStack = createNativeStackNavigator();

const ModalNavigator = () => (
  <ModalStack.Navigator
    screenOptions={{...defaultOptions, headerTitle: 'modal'}}>
    <ModalStack.Screen
      name="modal"
      component={Modal}
      options={{
        // eslint-disable-next-line react/display-name
        headerLeft: () => <Text>cancel</Text>,
      }}
    />
  </ModalStack.Navigator>
);

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={defaultOptions}>
        <Stack.Screen
          name="main"
          component={Main}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="modal-stack"
          component={ModalNavigator}
          options={{
            headerShown: false,
            stackPresentation: 'containedModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
