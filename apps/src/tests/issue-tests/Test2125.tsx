import {
  NavigationAction,
  NavigationContainer,
  ParamListBase,
  useIsFocused,
  usePreventRemove,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import Colors from '../../shared/styling/Colors';

type StackRouteParamList = {
  Home: undefined;
  SecondScreen: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();

function SecondScreen({ navigation }: StackNavigationProp) {
  const [pendingAction, setPendingAction] = useState<NavigationAction>();

  const isFocused = useIsFocused();

  usePreventRemove(isFocused && !pendingAction, event => {
    setPendingAction(event.data.action);
  });

  const handlePressCancel = useCallback(() => {
    setPendingAction(undefined);
  }, []);

  const handlePressConfirm = useCallback(() => {
    if (pendingAction) {
      navigation.dispatch(pendingAction);
      setPendingAction(undefined);
    }
  }, [navigation, pendingAction]);

  return (
    <View style={styles.container}>
      <Text>This is second</Text>
      <Modal visible={!!pendingAction} transparent>
        <View
          style={[
            styles.container,
            { backgroundColor: Colors.NavyLightTransparent },
          ]}>
          <View style={styles.content}>
            <Button title={'Go back'} onPress={handlePressConfirm} />
            <Button title={'Cancel'} onPress={handlePressCancel} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function HomeScreen({ navigation }: StackNavigationProp) {
  return (
    <View style={styles.container}>
      <Button
        title={'Go To Second Screen'}
        onPress={() => navigation.navigate('SecondScreen')}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SecondScreen" component={SecondScreen} />
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
  content: {
    backgroundColor: Colors.White,
    padding: 25,
    borderRadius: 25,
  },
});
