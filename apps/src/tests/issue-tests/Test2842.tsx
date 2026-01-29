import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { styles } from '../../shared/styles';
import { Button, Text, View } from 'react-native';
import { Rectangle } from '../../shared/Rectangle';
import PressableWithFeedback from '../../shared/PressableWithFeedback';
import { ToastProvider, useToast } from '../../shared';

interface StackParamList extends ParamListBase {
  Home: undefined;
  Modal: undefined;
}

interface StackNavigationProps {
  navigation: NativeStackNavigationProp<StackParamList>;
}

const Stack = createNativeStackNavigator<StackParamList>();

function Home({ navigation }: StackNavigationProps) {
  return (
    <View style={[styles.flexContainer, { backgroundColor: 'darkorange' }]}>
      <Text>Home</Text>
      <Button title="Open modal" onPress={() => navigation.navigate('Modal')} testID="home-button-open-modal" />
    </View>
  );
}

function Modal({ navigation }: StackNavigationProps) {
  return (
    <View style={[styles.flexContainer, { backgroundColor: 'lightblue' }]}>
      <Text>Modal</Text>
      <Button title="Close modal" onPress={() => navigation.pop()} testID="modal-button-close" />
    </View>
  );
}

function HeaderRight() {
  const toast = useToast();

  return (
    <PressableWithFeedback
      onPress={() => {
        toast.push({ backgroundColor: 'blue', message: 'onPress' });
      }}
      onPressIn={() => {
        toast.push({ backgroundColor: 'blue', message: 'onPressIn' });
      }}
      onPressOut={() => {
        toast.push({ backgroundColor: 'blue', message: 'onPressOut' });
      }}
    >
      <Rectangle width={128} height={36} color={'lightgreen'} style={{ borderRadius: 16 }} testID="subview-headerright" />
    </PressableWithFeedback>
  );
}

function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Modal" component={Modal} options={{
            presentation: 'modal',
            headerRight: HeaderRight,
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

export default App;
