import React from 'react';
import { View, Modal, Button, TouchableWithoutFeedback } from 'react-native';

import { NavigationContainer, ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';

type NavProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const Stack = createNativeStackNavigator();

function BlueScreen({ navigation }: NavProp): React.JSX.Element {
  return (
    <View style={{ backgroundColor: 'blue', flex: 1 }}>
      <Button
        title="Navigate to RedScreen"
        onPress={() => {
          navigation.navigate('red');
        }}
      />
    </View>
  );
}

function RedScreen({ navigation }: NavProp): React.JSX.Element {
  return (
    <View style={{ backgroundColor: 'red', flex: 1 }}>
      <Button
        title="Navigate to BlueScreen"
        onPress={() => {
          navigation.navigate('blue');
        }}
      />
    </View>
  );
}

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="blue" component={BlueScreen} />
        <Stack.Screen name="red" component={RedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
