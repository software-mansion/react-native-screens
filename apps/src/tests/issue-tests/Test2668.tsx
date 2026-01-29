import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Modal, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function Home({ navigation }: { navigation: NativeStackNavigationProp<ParamListBase> }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>1. Open owned modal</Text>
      <Button title="Show modal" onPress={() => navigation.navigate('Modal')} />
    </View>
  );
}

function Second({ navigation }: { navigation: NativeStackNavigationProp<ParamListBase> }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>4. This should be presented modally without any glitches</Text>
      <Button title="PopTo Home" onPress={() => {
        navigation.popTo('Home');
      }} />
    </View>
  );
}

function ModalScreen({ navigation }: { navigation: NativeStackNavigationProp<ParamListBase> }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <View style={{ flex: 1 }}>
      <Text>2. Click "ShowModal" to open foreign modal</Text>
      <Button title="Show modal" onPress={() => setModalVisible(true)} />
      <Button title="PopTo Second" onPress={() => {
        //setModalVisible(false);
        //navigation.popTo('Second');
        navigation.navigate('Second');
      }} />
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center' }}>
          <Text>3. Dismiss foreign modal and present owned one in single transaction</Text>
          <Button title="Hide modal and navigate" onPress={() => {
            setModalVisible(false);
            navigation.navigate('Second');
          }} />
        </View>
      </Modal>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Modal" component={ModalScreen} options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="Second" component={Second} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
