import React from 'react';
import { Button, Modal, SafeAreaView, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();


function TabScreens({ navigation }): React.JSX.Element {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name='A' component={HomeScreen} />
      <Tabs.Screen name='B' component={TabHomeScreen} />
    </Tabs.Navigator>
  );
}

function TabHomeScreen({ navigation }): React.JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightcoral', justifyContent: 'center', }}>
      <Text>Where do you where do you go, my lovely, oh oh oh oh</Text>
      <Button title='Show owned transparentModal (outer navigator)' onPress={() => { navigation.navigate('TransparentModal') }} />
      <Button title='Show owned modal (outer navigator)' onPress={() => { navigation.navigate('Modal') }} />
    </View>
  )
}


function HomeScreen({ navigation }): React.JSX.Element {
  const [toggle, setToggle] = React.useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: 'lightseagreen', justifyContent: 'center', }}>
      <Text>Where do you where do you go, my lovely, oh oh oh oh</Text>
      <Button title='Show owned transparentModal' onPress={() => { navigation.navigate('TransparentModal') }} />
      <Button title='Show owned modal' onPress={() => { navigation.navigate('Modal') }} />
      <Button title='Show tabs' onPress={() => { navigation.navigate('Tabs') }} />
      <Button title='Show foreign modal' onPress={() => { setToggle(old => !old) }} />
      <Modal
        visible={toggle}
        onRequestClose={() => setToggle(false)}
        presentationStyle='formSheet'
        animationType='slide'
      >
        <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
          <Text>Hello I'm a foreign modal</Text>
          <Button title='Close foreign modal' onPress={() => { setToggle(false) }} />
        </View>
      </Modal>
    </View>
  )
}

function ModalScreen({ navigation }): React.JSX.Element {
  const [toggle2, setToggle2] = React.useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: 'lightcoral', opacity: 0.4 }}>
      <Text>Where do you where do you go, my lovely, oh oh oh oh</Text>
      <Button title='Go back' onPress={() => { navigation.goBack() }} />
      <View style={{ width: '100%', height: 50, backgroundColor: 'red' }} />
      <Button title='Push another Modal' onPress={() => { navigation.push('Modal') }} />
      <Button title='Push foreign modal(inside Screen Component)' onPress={() => { navigation.push('ForeignModal')}} />
      <Button title='Push foreign modal' onPress={() => { setToggle2(old => !old )}} />
        <Modal
            visible={toggle2}
            onRequestClose={() => setToggle2(false)}
            presentationStyle='formSheet'
            animationType='slide'
        >
            <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
                <Text>Hello I'm a foreign modal</Text>
                <Button title='Close foreign modal' onPress={() => { setToggle2(false) }} />
            </View>
        </Modal>
    </View>
  )
}

function ForeignModal({ navigation }): React.JSX.Element | null {
    const [toggle, setToggle] = React.useState(false);
    return (
        <Modal
            visible={toggle}
            onRequestClose={() => setToggle(false)}
            presentationStyle='formSheet'
            animationType='slide'
        >
            <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
                <Text>Hello I'm a foreign modal</Text>
                <Button title='Close foreign modal' onPress={() => { setToggle(false) }} />
            </View>
        </Modal>
    )
}


const TestScreen = ({ navigation }): React.JSX.Element => {
  return (
    <SafeAreaView>
      <Button
        title={
          'Click me and drag around a bit and I should log something still'
        }
        onPress={() => {
          console.log(Date.now());
        }}
      />
      <Button
        title={'Navigate to modal'}
        onPress={() => {
          navigation.navigate('Test2');
        }}
      />
    </SafeAreaView>
  );
};

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Tabs'>
        <Stack.Screen name='Tabs' component={TabScreens} options={{ headerShown: false }} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="TransparentModal"
          component={ModalScreen}
          options={{
            presentation: 'transparentModal',
          }}
        />
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={{
            presentation: 'modal',
            headerShown: true,
          }}
        />
        <Stack.Screen name={"ForeignModal"} component={ForeignModal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
