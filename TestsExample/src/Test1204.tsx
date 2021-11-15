import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Second" component={NoA11yOnAndroid} />
        <Stack.Screen
          name="TransparentModal"
          component={Details}
          options={{
            stackPresentation: 'transparentModal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ContainedTransparentModal"
          component={Details}
          options={{
            stackPresentation: 'containedTransparentModal',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Main({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Text>Example text that could be read out by TalkBack</Text>
      <Button
        title="Open transparent modal"
        onPress={() => navigation.navigate('TransparentModal')}
      />
      <Button
        title="Open contained transparent modal"
        onPress={() => navigation.navigate('ContainedTransparentModal')}
      />
    </View>
  );
}

function Details({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#0005',
      }}>
      <View
        style={{
          padding: 20,
          margin: 20,
          borderWidth: 1,
          borderColor: 'grey',
          justifyContent: 'space-around',
          backgroundColor: 'white',
        }}>
        <Text style={{padding: 15}}>
          Buttons beneath the modal shouldn&apos;t be picked up by Android
          TalkBack
        </Text>
        <Button
          title="Go to second"
          onPress={() => navigation.navigate('Second')}
        />
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

function NoA11yOnAndroid({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <View importantForAccessibility="no-hide-descendants">
        <Text>This text shouldn&apos;t be accessible</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
