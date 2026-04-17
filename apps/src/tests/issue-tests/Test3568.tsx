import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import {
  NavigationContainer,
  usePreventRemove,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Colors } from '@apps/shared/styling';

type StackParamList = {
  Home: undefined;
  FormSheet: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Home'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        FormSheet iOS usePreventRemove callback bug
      </Text>
      <Button
        title="Open sheet"
        onPress={() => navigation.navigate('FormSheet')}
      />
    </View>
  );
}

function FormSheetContent() {
  const [preventRemove, setPreventRemove] = React.useState(false);
  const navigation = useNavigation();

  usePreventRemove(preventRemove, ({ data }) => {
    Alert.alert(
      'Discard changes?',
      'You have unsaved changes. Are you sure you want to leave?',
      [
        {
          text: 'Keep editing',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });

  return (
    <View style={styles.sheetContainer}>
      <Button
        title={preventRemove ? 'Prevent Remove: ON' : 'Prevent Remove: OFF'}
        onPress={() => setPreventRemove(existing => !existing)}
      />
      <Text style={styles.sheetTitle}>Sheet Content</Text>
      <Text style={styles.sheetText}>
        Toggle the button above, then try to swipe down or close the sheet to
        see the Alert in action.
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="FormSheet"
          component={FormSheetContent}
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: 'fitToContents',
            sheetCornerRadius: 20,
            sheetGrabberVisible: true,
            contentStyle: {
              backgroundColor: Colors.White,
            },
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sheetContainer: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  sheetText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
});
