import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Button,
  StyleSheet,
} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

function HomeScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={styles.container}>
      <Text>Keyboard shouldn&apos;t hide on swipe</Text>
      <Button
        title="Navigate to second screen"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TextInput
        placeholder="Focus here, show keyboard and swipe"
        style={styles.textInput}
      />
      <Text>Use Return to close keyboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
});

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            keyboardAvoidingEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
