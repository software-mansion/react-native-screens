import * as React from 'react';
import { View, Text, Button, useColorScheme, StyleSheet } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen({ navigation }) {
  const scheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text
        style={[styles.text, { color: scheme === 'dark' ? '#FFF' : '#000' }]}>
        This is the home screen!
      </Text>
      <Button
        onPress={() => navigation.navigate('MyModal')}
        title="Open Modal"
      />
      <Button
        onPress={() => navigation.navigate('MyWorkingModal')}
        title="Open Working Modal"
      />
      <Text
        style={[
          styles.schemeText,
          { color: scheme === 'dark' ? '#FFF' : '#000' },
        ]}>
        current scheme is: {scheme}
      </Text>
    </View>
  );
}

function ModalScreen({ navigation }) {
  const scheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text
        style={[styles.text, { color: scheme === 'dark' ? '#FFF' : '#000' }]}>
        This is a modal!
      </Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
      <Text
        style={[
          styles.schemeText,
          { color: scheme === 'dark' ? '#FFF' : '#000' },
        ]}>
        current scheme is: {scheme}
      </Text>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View>
      <Text>Details</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator();

function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootStack.Navigator>
        <RootStack.Group>
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="Details" component={DetailsScreen} />
          <RootStack.Screen
            name="MyWorkingModal"
            component={ModalScreen}
            options={{ presentation: 'formSheet' }}
          />
        </RootStack.Group>
        <RootStack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
          <RootStack.Screen name="MyModal" component={ModalScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 30, marginBottom: 20 },
  schemeText: { marginTop: 20 },
});
