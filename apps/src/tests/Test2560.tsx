import React, { useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Colors from '../shared/styling/Colors';

type StackParamList = {
  Home: undefined;
  FormSheet: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

const HomeScreen = ({ navigation }: NativeStackScreenProps<StackParamList>) => (
  <View style={styles.screen}>
    <Text style={styles.title}>Home Screen</Text>
    <Button
      title="Open Form Sheet"
      onPress={() => navigation.navigate('FormSheet')}
    />
  </View>
);

const FormSheetScreen = ({
  navigation,
}: NativeStackScreenProps<StackParamList>) => {
  const [showTopView, setShowTopView] = useState(false);
  const [showBottomView, setShowBottomView] = useState(false);
  const [rectangleHeight, setRectangleHeight] = useState(200);

  const toggleTopView = () => setShowTopView(prev => !prev);
  const toggleBottomView = () => setShowBottomView(prev => !prev);
  const toggleRectangleHeight = () =>
    setRectangleHeight(prev => (prev === 200 ? 400 : 200));

  return (
    <View style={styles.formSheetContainer}>
      {showTopView && (
        <View style={styles.rectangle}>
          <Text style={styles.text}>Top View</Text>
        </View>
      )}
      <Text style={styles.formSheetTitle}>Form Sheet Content</Text>
      <View style={[styles.rectangle, { height: rectangleHeight }]} />
      <Button
        title={showTopView ? 'Hide Top View' : 'Show Top View'}
        onPress={toggleTopView}
      />
      <Button
        title={`Toggle Height (Current: ${rectangleHeight}px)`}
        onPress={toggleRectangleHeight}
      />
      <Button
        title={showBottomView ? 'Hide Bottom View' : 'Show Bottom View'}
        onPress={toggleBottomView}
      />
      <Button title="Dismiss" onPress={() => navigation.goBack()} />
      {showBottomView && (
        <View style={styles.rectangle}>
          <Text style={styles.text}>Bottom View</Text>
        </View>
      )}
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="FormSheet"
          component={FormSheetScreen}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  formSheetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
    backgroundColor: Colors.White,
  },
  formSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.White,
  },
  rectangle: {
    width: '100%',
    backgroundColor: Colors.NavyLight80,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
