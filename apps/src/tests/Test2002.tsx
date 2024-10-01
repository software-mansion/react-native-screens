import * as React from 'react';
import { View, Button, useColorScheme, StyleSheet } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => navigation.navigate('fullScreenModal')}
        title="Open fullScreenModal"
      />
      <Button
        onPress={() => navigation.navigate('formSheet')}
        title="Open formSheet"
      />
    </View>
  );
}

function ModalScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}

const RootStack = createNativeStackNavigator();

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen
          name="formSheet"
          component={ModalScreen}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.3, 0.5, 0.8],
          }}
        />
        <RootStack.Screen
          name="fullScreenModal"
          component={ModalScreen}
          options={{ presentation: 'fullScreenModal' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
