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
  const handlePressCancel = useCallback(() => {
    setPendingAction(undefined);
  }, []);
  const isFocused = useIsFocused();
  const handlePressConfirm = useCallback(
    (action: NavigationAction) => {
      setPendingAction(undefined);
      navigation.dispatch(action);
    },
    [navigation],
  );
  usePreventRemove(isFocused && !pendingAction, event => {
    setPendingAction(event.data.action);
  });

  if (!pendingAction) {
    return null;
  }

  return (
    <Modal
      animationType="none"
      hardwareAccelerated
      transparent
      visible
      onRequestClose={handlePressCancel}>
      <View style={styles.screen}>
        <View>
          <View style={styles.dialog}>
            <View>
              <Button
                title={'Go back'}
                onPress={() => handlePressConfirm(pendingAction)}></Button>
              <Button title={'Cancel'} onPress={handlePressCancel}></Button>
            </View>
          </View>
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
    <>
      <TestModal navigation={navigation} />
      <Text>This is second</Text>
    </>
  );
};

function HomeScreen({
  navigation,
}: {
  navigation: StackNavigationProp<ParamListBase>;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightred',
        justifyContent: 'center',
      }}>
      <Button
        title={'Go To Second Screen'}
        onPress={() => {
          navigation.navigate('SecondScreen');
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name={'SecondScreen'} component={SecondScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: 'white',
    padding: 25,
    elevation: 2,
    width: '100%',
    maxHeight: '100%',
  },
});
