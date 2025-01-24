import React from 'react';
import { Text, SafeAreaView, Pressable, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

type NavigationProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const NestedStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function ModalScreen({ navigation }: NavigationProps) {
  return <SafeAreaView style={{ backgroundColor: 'green', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Hello from modal screen</Text>
    <Pressable onPress={navigation.goBack}><Text>Go Back</Text></Pressable>
  </SafeAreaView>;
}

function Content({ navigation }: NavigationProps) {
  const showTransparentModal = React.useCallback(() => {
    console.log('showTransparentModal pressed');
    navigation.navigate('ModalScreen');
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Pressable onPress={showTransparentModal}><Text>Open Modal Screen</Text></Pressable>
    </View>
  );
}

function HomeScreen() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="HomeScreen" component={Content} />
      <NestedStack.Screen name="ModalScreen" component={ModalScreen}
        options={{ headerShown: false, presentation: 'transparentModal' }} />
    </NestedStack.Navigator>
  );
}

function OtherScreen({ navigation }: NavigationProps) {
  return (
    <Pressable onPress={navigation.goBack}><Text>
      Go back
    </Text></Pressable>
  );
}


function TabStack() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="HomeTab" component={HomeScreen} />
      <Tabs.Screen name="Other" component={OtherScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <TabStack />
    </NavigationContainer>
  );
}

