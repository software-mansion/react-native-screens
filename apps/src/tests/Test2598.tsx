import React from 'react';
import { NavigationContainer, NavigationIndependentTree, ParamListBase, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Modal, Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

const NestedStack = createNativeStackNavigator();

type RouteNavigationProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
}

function Home({ navigation }: RouteNavigationProp) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Show ModalOwned" onPress={() => navigation.navigate('ModalOwned')} />
    </View>
  );
}

function NestedHome({ navigation, route }: RouteNavigationProp) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>NestedHome</Text>
      <Button title="Hide modal" onPress={() => route.params?.hideModalCallback?.()} />
    </View>
  );
}


function IndependentContainer({ hideModalCallback }: {
  hideModalCallback: () => void;
}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <NavigationIndependentTree>
        <NavigationContainer>
          <NestedStack.Navigator>
            <NestedStack.Screen name="NestedHome" component={NestedHome} initialParams={ hideModalCallback }/>
          </NestedStack.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </View>
  );
}

function ModalOwned() {
  const [isModalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Modal screen</Text>
      <Button title="Show foreign modal" onPress={() => setModalVisible(true)} />
      <Modal visible={isModalVisible}  style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} animationType="slide" presentationStyle="pageSheet">
        <IndependentContainer hideModalCallback={() => setModalVisible(false)}/>
      </Modal>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ statusBarTranslucent: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ModalOwned" component={ModalOwned} options={{
          presentation: 'modal',
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
