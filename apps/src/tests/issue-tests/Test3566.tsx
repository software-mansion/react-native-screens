import React, { useState } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Colors from '../../shared/styling/Colors';

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
  const [showLargeContent, setShowLargeContent] = useState(false);

  const toggleLargeContent = () => {
    setShowLargeContent(prev => !prev);
  };

  return (
    <View style={styles.formSheetContainer}>
      <Button
        title={showLargeContent ? 'Hide Large Content' : 'Show Large Content'}
        onPress={toggleLargeContent}
      />
      <View style={styles.rectangle} />
      {showLargeContent && (
        <View style={[styles.largeContentContainer]}>
          <Text style={styles.largeTextTitle}>Large Content</Text>
          {[...Array(50)].map((_, index) => (
            <Text key={index} style={styles.largeTextItem}>
              Item #{index + 1}
            </Text>
          ))}
        </View>
      )}
      <Button title="Dismiss" onPress={() => navigation.goBack()} />
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
            contentStyle: {
              backgroundColor: Colors.YellowLight40,
            },
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
    flex: 1,
    padding: 20,
    gap: 20,
  },
  rectangle: {
    width: '100%',
    backgroundColor: Colors.NavyLight80,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeContentContainer: {
    flex: 1,
    marginVertical: 10,
    padding: 10,
    backgroundColor: Colors.NavyLight80,
    borderRadius: 8,
  },
  largeTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.White,
    marginBottom: 10,
  },
  largeTextItem: {
    fontSize: 14,
    color: Colors.White,
    marginVertical: 2,
  },
});
