import React, { useState } from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Colors from '../shared/styling/Colors';
import PressableWithFeedback from '../shared/PressableWithFeedback';

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
  const [showSecondRectangle, setShowSecondRectangle] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowSecondRectangle(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.formSheetContainer}>
      <TextInput
        style={styles.input}
        autoFocus
      />
      <PressableWithFeedback>
        <Text style={styles.text}>Test Pressable</Text>
      </PressableWithFeedback>
      <View style={styles.rectangle} />
      {showSecondRectangle && (
        <View style={styles.rectangle} />
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
            // TODO(@t0maboro) - add `sheetDefaultResizeAnimationEnabled` prop here when possible
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
  input: {
    width: 100,
    height: 20,
    borderColor: Colors.BlueDark100,
    borderWidth: 1,
  },
});
