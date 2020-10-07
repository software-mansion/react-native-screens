import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';

enableScreens();

function First({ navigation }) {
  return (
    <View style={styles.verticalContainer}>
      <View style={styles.centeredContainer}>
        <TouchableOpacity
          style={[styles.centeredContainer, styles.buttonExtras]}
          onPress={() => navigation.navigate('Second')}>
          <Text style={styles.buttonText}>Tap me for second screen</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.centeredContainer}>
        <Text>Hi I'm the SECOND screen</Text>
        <TextInput
          placeholder={'Password'}
          autoCompleteType={'password'}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.centeredContainer}>
        <TouchableOpacity
          style={[styles.centeredContainer, styles.buttonExtras]}
          onPress={() => navigation.popToTop()}>
          <Text style={styles.buttonText}>Pop to top</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.flexOne} />
      <View style={styles.flexOne}>
        <TouchableOpacity
          style={[styles.centeredContainer, styles.buttonExtras]}
          onPress={() => navigation.navigate('Second')}>
          <Text style={styles.buttonText}>Tap me for second screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Second({ navigation }) {
  return (
    <View style={styles.verticalContainer}>
      <View style={styles.centeredContainer}>
        <TouchableOpacity
          style={[styles.centeredContainer, styles.buttonExtras]}
          onPress={() => navigation.navigate('Second')}>
          <Text style={styles.buttonText}>Tap me for second screen</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.centeredContainer}>
        <Text>Hi I'm the SECOND screen</Text>
        <TextInput
          placeholder={'Password'}
          autoCompleteType={'password'}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.centeredContainer}>
        <TouchableOpacity
          style={[styles.centeredContainer, styles.buttonExtras]}
          onPress={() => navigation.popToTop()}>
          <Text style={styles.buttonText}>Pop to top</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.flexOne} />
      <View style={styles.flexOne}>
        <TouchableOpacity
          style={[styles.centeredContainer, styles.buttonExtras]}
          onPress={() => navigation.push('Second')}>
          <Text style={styles.buttonText}>Tap me for second screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // mode="modal"
        // activeLimit={5}
        screensEnabled={true}
        screenOptions={{
          animationEnabled: true,
          transparentCard: true,
          // cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          headerStyle: { backgroundColor: 'red' },
          gestureEnabled: true,
        }}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  verticalContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'pink',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexOne: {
    flex: 1,
  },
  buttonExtras: {
    backgroundColor: '#3A8EED',
    borderRadius: 20,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
