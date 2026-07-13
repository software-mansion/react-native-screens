import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
type RouteParamList = {
  Home: undefined;
  ModalDefaultScreen: undefined;
  ModalScreen: undefined;
  PageSheetScreen: undefined;
  FormSheetScreen: undefined;
};
const Stack = createNativeStackNavigator<RouteParamList>();
function Home({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>sheetCornerRadius with modal/pageSheet</Text>
      <Button
        title="Open Modal (default radius: no prop)"
        onPress={() => navigation.navigate('ModalDefaultScreen')}
      />
      <Button
        title="Open Modal (cornerRadius: 10)"
        onPress={() => navigation.navigate('ModalScreen')}
      />
      <Button
        title="Open PageSheet (cornerRadius: 10)"
        onPress={() => navigation.navigate('PageSheetScreen')}
      />
      <Button
        title="Open FormSheet (cornerRadius: 10)"
        onPress={() => navigation.navigate('FormSheetScreen')}
      />
    </View>
  );
}
function SheetContent({ navigation, title }: any) {
  return (
    <View style={styles.sheetContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Corner radius should be 10</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
export default function TestModalCornerRadius() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="ModalDefaultScreen"
          component={({ navigation }: any) => (
            <SheetContent navigation={navigation} title="Modal (default system radius)" />
          )}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ModalScreen"
          component={({ navigation }: any) => (
            <SheetContent navigation={navigation} title="Modal (cornerRadius: 10)" />
          )}
          options={{
            presentation: 'modal',
            sheetCornerRadius: 10,
          }}
        />
        <Stack.Screen
          name="PageSheetScreen"
          component={({ navigation }: any) => (
            <SheetContent navigation={navigation} title="PageSheet" />
          )}
          options={{
            presentation: 'modal',
            sheetCornerRadius: 10,
          }}
        />
        <Stack.Screen
          name="FormSheetScreen"
          component={({ navigation }: any) => (
            <SheetContent navigation={navigation} title="FormSheet (existing)" />
          )}
          options={{
            presentation: 'formSheet',
            sheetCornerRadius: 10,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'lightsalmon',
  },
  sheetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});