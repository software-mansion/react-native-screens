import React from 'react';
import { View, Button, LayoutChangeEvent, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

type StackParamList = {
  Home: undefined;
  Modal: undefined;
  Modal2: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Home'>) {
  return (
    // In original repro SafeAreaView from `react-native` has been used here.
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Modal" onPress={() => navigation.navigate('Modal')} />
    </View>
  );
}

function ModalScreen() {
  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    console.log('Modal width:', width);
  };
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
        backgroundColor: 'green',
      }}
      onLayout={onLayout}>
      <ScrollView style={{ alignSelf: 'center', width: 600 }}>
        <View
          style={{
            width: 600,
            height: 400,
            backgroundColor: 'purple',
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            width: 600,
            height: 400,
            backgroundColor: 'purple',
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            width: 600,
            height: 400,
            backgroundColor: 'purple',
            alignSelf: 'center',
          }}
        />
      </ScrollView>
    </View>
  );
}

function ModalScreen2() {
  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    console.log('Modal width:', width);
  };
  return (
    <View style={{ flex: 1, backgroundColor: 'green' }} onLayout={onLayout}>
      <View style={{ flex: 1, overflow: 'hidden', elevation: 4 }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              maxWidth: 600,
              alignSelf: 'center',
              width: '100%',
              paddingHorizontal: 16,
              flex: 1,
            }}>
            <View
              style={{
                width: 600,
                height: 400,
                backgroundColor: 'purple',
                alignSelf: 'center',
              }}
            />
            <View
              style={{
                width: 600,
                height: 400,
                backgroundColor: 'purple',
                alignSelf: 'center',
              }}
            />
            <View
              style={{
                width: 600,
                height: 400,
                backgroundColor: 'purple',
                alignSelf: 'center',
              }}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Modal"
          component={ModalScreen2}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="Modal2"
          component={ModalScreen}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
