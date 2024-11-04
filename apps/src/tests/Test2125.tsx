import {
  NavigationAction,
  NavigationContainer,
  ParamListBase,
  useIsFocused,
  usePreventRemove,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

function TestModal({
  navigation,
}: {
  navigation: StackNavigationProp<ParamListBase>;
}) {
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
    <Modal visible={!!pendingAction} transparent>
      <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={styles.content}>
          <Button title={'Go back'} onPress={handlePressConfirm}></Button>
          <Button title={'Cancel'} onPress={handlePressCancel}></Button>
        </View>
      </View>
    </Modal>
  );
}

const SecondScreen = ({
  navigation,
}: {
  navigation: StackNavigationProp<ParamListBase>;
}): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TestModal navigation={navigation} />
      <Text>This is second</Text>
    </View>
  );
};

function HomeScreen({
  navigation,
}: {
  navigation: StackNavigationProp<ParamListBase>;
}) {
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
      <Stack.Navigator initialRouteName="Home">
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
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 25,
  },
});
