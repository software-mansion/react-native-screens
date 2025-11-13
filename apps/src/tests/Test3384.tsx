import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React from 'react'
import { BottomTabsContainer } from '../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, Button, Text, View } from 'react-native';

function ModalScreen() {
  return <Text>Modal</Text>
}

function Tab1() {
  const navigation = useNavigation()

  return <View>
    <Text>Tab 1</Text>
    <Button title='Open Modal' onPress={() => navigation.navigate('Modal' as never)} />
  </View>
}

function Tab2() {
  return <View>
    <Text>Tab 2</Text>
  </View>
}

function BottomTabs() {
  return <BottomTabsContainer 
    onNativeFocusChange={() => Alert.alert("Native focus change called")} 
    tabConfigs={[{
      component: Tab1,
      tabScreenProps: { tabKey: 'tab1', title: 'Tab 1' }
    }, {
      component: Tab2,
      tabScreenProps: { tabKey: 'tab2', title: 'Tab 2' }
    }]} 
    />
}

const Stack = createNativeStackNavigator();

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='BottomTabs'
          component={BottomTabs}
          options={{ title: 'Test3384' }}
        />
        <Stack.Screen
          name='Modal'
          component={ModalScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;