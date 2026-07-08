import React from 'react';
import { Alert, Button, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  NavigationContainer,
  NavigatorScreenParams,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type NestedStackParamList = {
  NSHome: undefined;
  NSDetailsStack: undefined;
};

const NestedStack = createNativeStackNavigator<NestedStackParamList>();

type StackParamList = {
  Home: undefined;
  DetailsStack: undefined;
  NestedStack: NavigatorScreenParams<typeof NestedStack> | undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: 'slide_from_left' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DetailsStack" component={DetailsScreen} />
        <Stack.Screen name="NestedStack" component={NestedStackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function NestedStackScreen() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="NSHome" component={NestedHomeScreen} />
      <NestedStack.Screen name="NSDetailsStack" component={DetailsScreen} />
    </NestedStack.Navigator>
  );
}

function HomeContent({
  onDetailsPress,
  onNestedStackPress,
  onNestedDetailsPress,
}: {
  onDetailsPress: () => void;
  onNestedStackPress: () => void;
  onNestedDetailsPress: () => void;
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to Details" onPress={onDetailsPress} />
      <Button title="Go to NestedStack" onPress={onNestedStackPress} />
      <Button
        title="Go to NestedStack Details"
        onPress={onNestedDetailsPress}
      />
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation<typeof Stack, 'Home'>('Home');

  return (
    <HomeContent
      onDetailsPress={() => navigation.navigate('DetailsStack')}
      onNestedStackPress={() => navigation.navigate('NestedStack')}
      onNestedDetailsPress={() =>
        navigation.navigate('NestedStack', { screen: 'NSDetailsStack' })
      }
    />
  );
}

function NestedHomeScreen() {
  const navigation = useNavigation<typeof Stack, 'NSHome'>('NSHome');

  return (
    <HomeContent
      onDetailsPress={() => navigation.navigate('DetailsStack')}
      onNestedStackPress={() => navigation.navigate('NestedStack')}
      onNestedDetailsPress={() =>
        navigation.navigate('NestedStack', { screen: 'NSDetailsStack' })
      }
    />
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {new Array(10).fill(0).map((_, i) => (
        <Pressable
          key={i.toString()}
          onPress={() => {
            Alert.alert('Pressed!');
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
            styles.wrapperCustom,
          ]}>
          {({ pressed }) => (
            <Text style={styles.text}>{pressed ? 'Pressed!' : 'Press Me'}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperCustom: {
    width: '100%',
    height: 100,
    marginHorizontal: 30,
    borderRadius: 10,
    margin: 10,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});
