import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { Button, ScrollView, Text, View } from 'react-native';

type NavigationParamsList = {
  Home: undefined,
  ScrollView: undefined,
}

type StackNavigationProps = NavigationProp<NavigationParamsList>;

export default function TestScrollViewHorizontal() {
  const Stack = createNativeStackNavigator<NavigationParamsList>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={(props: { navigation: StackNavigationProps }) => <View>
          <Button onPress={() => props.navigation.navigate('ScrollView')} title='Go to ScrollView' />
        </View>} />
        <Stack.Screen name="ScrollView" component={() => 
          <ScrollView horizontal={ true } >
            <View style={{ width: 300 }}>
              <Text style={{ fontSize: 48 }}>{ Array.from({ length: 100 }).map( _ => ['🤖', '👨‍💻', '👾'][Math.floor(Math.random() * 3)]).join('')}</Text>
            </View>
            <View style={{ width: 300, paddingTop: 100 }}>
              <Button title='A button' />
            </View>
          </ScrollView>
        } />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
