import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [navigation]);

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      navigation.setOptions({
        headerLeft: HeaderLeft,
        headerRight: HeaderLeft,
      });
    }, 1300);

    return () => {
      clearTimeout(timerId);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
}

function HeaderLeft() {
  return (
    <View>
      <Text>Left</Text>
    </View>
  );
}

function HeaderTitle() {
  return (
    <View>
      <Text>Title</Text>
    </View>
  );
}

function HeaderRight() {
  return (
    <View>
      <Text>Right</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            statusBarTranslucent: true,
            statusBarStyle: 'dark',
            headerTitle: HeaderTitle,
            //headerSearchBarOptions: {
            //  placeholder: 'Search...',
            //  onChangeText: (event) => {
            //    console.log('Search text:', event.nativeEvent.text);
            //  },
            //},
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
});

