import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, StyleSheet, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PressableWithFeedback from '../shared/PressableWithFeedback';

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    marginHorizontal: 5,
    padding: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  buttonsView: {
    flexDirection: 'row',
    borderWidth: 1,
  },
});

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: 'minimal',
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={HomeScreen} />
    </Stack.Navigator>
  );
}

const HomeScreen = ({ navigation }: any) => {
  const [secondButtonShown, setSecondButtonShown] = React.useState(true);
  const [thirdButtonShown, setThirdButtonShown] = React.useState(true);
  const [showAllButtons, setShowAllButtons] = React.useState(true);

  const headerRight = React.useCallback(() => {
    return (
      <View style={[styles.buttonsView, !showAllButtons && { display: 'none' }]}>
        <PressableWithFeedback style={styles.button} onPress={() => console.log(1)}>
          <Text>1</Text>
        </PressableWithFeedback>
        <PressableWithFeedback style={styles.button} onPress={() => console.log('D')}>
          <Text>[D]</Text>
        </PressableWithFeedback>
      </View>
    );
  }, [secondButtonShown, thirdButtonShown, showAllButtons]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: 'pink' },
      headerRight: headerRight,
    });
  }, [navigation, headerRight, showAllButtons]);

  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Toggle 2nd button"
        onPress={() => setSecondButtonShown(p => !p)}
      />
      <Button
        title="Toggle 3rd button"
        onPress={() => setThirdButtonShown(p => !p)}
      />
      <Button
        title="Toggle All Right Buttons"
        onPress={() => setShowAllButtons(p => !p)}
      />
    </View>
  );
};

function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

export default App;

