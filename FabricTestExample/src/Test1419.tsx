import React from 'react';
import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TextInput,
} from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>First screen</Text>
      <Button
        title={'Navigate'}
        onPress={() => navigation.navigate('Second')}
      />
    </View>
  );
}

function Second() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../assets/backButton.png')}
            style={{
              width: 150,
              height: 150,
              marginBottom: 30,
            }}
          />
          <TextInput
            placeholder={'Input'}
            style={{
              width: 200,
              height: 40,
              paddingLeft: 15,
              paddingRight: 15,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: '#cccccc',
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const { Navigator, Screen } = createNativeStackNavigator();

export default () => {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ hideKeyboardOnSwipe: true }}>
        <Screen name={'First'} component={First} />
        <Screen name={'Second'} component={Second} />
      </Navigator>
    </NavigationContainer>
  );
};
