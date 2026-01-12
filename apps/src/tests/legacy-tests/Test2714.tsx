import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PressableWithFeedback from '../../shared/PressableWithFeedback';

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
  const [isLargeSize, setLargeSize] = React.useState(true);

  const headerRight = React.useCallback(() => {
    return (
      <View style={[styles.buttonsView, !showAllButtons && { display: 'none' }]}>
        <PressableWithFeedback style={isLargeSize ? styles.largeButton : styles.button} onPress={() => console.log(1)}>
          <Text>1</Text>
        </PressableWithFeedback>
        {secondButtonShown && (
          <PressableWithFeedback style={styles.button} onPress={() => console.log(2)}>
            <Text>2</Text>
          </PressableWithFeedback>
        )}
        {thirdButtonShown && (
          <PressableWithFeedback style={styles.button} onPress={() => console.log(3)}>
            <Text>3</Text>
          </PressableWithFeedback>
        )}
        <PressableWithFeedback style={styles.button} onPress={() => console.log('D')}>
          <Text>[D]</Text>
        </PressableWithFeedback>
      </View>
    );
  }, [secondButtonShown, thirdButtonShown, showAllButtons, isLargeSize]);

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
        title="Toggle size"
        onPress={() => setLargeSize(p => !p)}
      />
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

function SimpleHome() {
  const navigation = useNavigation();
  const [isExpanded, setExpanded] = React.useState(false);

  const headerRight = React.useCallback(() => {
    return (
      <PressableWithFeedback>
        <View style={[{ width: 128, height: 42 }, isExpanded ? { width: 192 } : null]} />
      </PressableWithFeedback>
    );
  }, [isExpanded]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [headerRight, navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'lightsalmon' }}>
      <Button title="Toggle subview size" onPress={() => setExpanded(val => !val)} />
      <Button title="Go to HomeScreen" onPress={() => navigation.navigate('HomeScreen')} />
    </View>
  );
}

function SimpleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SimpleHome" component={SimpleHome} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// function App() {
//   return (
//     <NavigationContainer>
//       <RootStack />
//     </NavigationContainer>
//   );
// }

function AppSimplified() {
  return (
    <NavigationContainer>
      <SimpleStack />
    </NavigationContainer>
  );
}

// export default App;
export default AppSimplified;


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
  largeButton: {
    width: 64,
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
