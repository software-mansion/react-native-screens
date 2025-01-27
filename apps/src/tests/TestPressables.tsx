import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, PressableProps, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, View } from 'react-native';
import { PressableWithFeedback, TouchableWithFeedback } from '../shared/PressableWithFeedback';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type StackParamList = {
  Home: undefined,
}

const Stack = createNativeStackNavigator<StackParamList>();

function useCounter(initialValue: number = 0) {
  const [count, setCount] = React.useState<number>(initialValue);

  const inc = React.useCallback(() => {
    setCount(prev => prev + 1);
  }, [setCount]);

  const dec = React.useCallback(() => {
    setCount(prev => prev - 1);
  }, [setCount]);

  return [count, inc, dec];
}

function ButtonContent({ text }: { text: string }) {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '100%', height: 48, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hardcoded</Text>
      </View>
    </View>
  );
}

//type SharedClickableProps = {
//  Clickable: React.FC<TouchableWithoutFeedbackProps | PressableProps>;
//  text: string
//}
//
//function SharedClickable({ Clickable, text }: SharedClickableProps) {
//  return (
//    <Clickable>
//      <ButtonContent text={text} />
//    </Clickable>
//  );
//}

function SharedPressable() {
  return (
    <PressableWithFeedback>
      <ButtonContent text="Pressable" />
    </PressableWithFeedback>
  );
  //<SharedClickable Clickable={PressableWithFeedback} text="Pressable" />
}

function SharedTouchable() {
  //return (
  //  <TouchableWithFeedback>
  //    <ButtonContent text="Touchable" />
  //  </TouchableWithFeedback>
  //);

  const [count, setCount] = React.useState(0);

  const onPress = () => {
    console.log('onPress');
    setCount(count + 1);
  };

  return (
    <TouchableWithFeedback onPress={onPress}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '100%', height: 48, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Touch Here</Text>
        </View>
      </View>
    </TouchableWithFeedback>
  );
}

function Spacer() {
  return (
    <View style={{ flexDirection: 'row', height: 8 }} />
  );
}

function RegularButton() {
  return (
    <Button title="Regular button" onPress={() => console.log('Regular button onPress')} />
  );
}

function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightcoral', justifyContent: 'center' }}>
      <SharedTouchable />
      <Spacer />
      <SharedPressable />
      <Spacer />
      <SharedTouchable />
      <Spacer />
      <RegularButton />
      <Spacer />
      <TouchableOpacity onPress={() => console.log('Touchable onPress')}>
        <ButtonContent text="TouchableOpacity" />
      </TouchableOpacity>
      <Spacer />
      <TouchableWithoutFeedback onPress={() => console.log('TouchableWithoutFeedback onPress')}>
        <ButtonContent text="TouchableWithoutFeedback" />
      </TouchableWithoutFeedback>
      <Spacer />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function SecondApp() {
  const [count, setCount] = React.useState(0);

  const onPress = () => {
    setCount(count + 1);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>Count: {count}</Text>
        </View>
        <TouchableWithFeedback onPress={onPress}>
          <View style={styles.button}>
            <Text>Touch Here</Text>
          </View>
        </TouchableWithFeedback>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  containerThird: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
  },
  countText: {
    color: '#FF00FF',
  },
});


function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 22, marginTop: 15, color: "#fff" }}>
        New Architecture: <Text style={{ fontWeight: "bold" }}>Enabled</Text>
      </Text>

      <TouchableOpacity
        onPressOut={() => {
          console.log("activates here");
          navigation.navigate("Detail");
        }}
        onPress={() => {
          console.log("does not work here");
          navigation.navigate("Detail");
        }}
      >
        <Text>Go to details</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailScreen({ navigation }) {
  const [increment, setIncrement] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text>{increment}</Text>
      <TouchableOpacity
        onPress={() => {
          setIncrement(increment + 1);
        }}
        onPressOut={() => {
          setIncrement(increment + 1);
        }}
      >
        <Text>Increment</Text>
      </TouchableOpacity>
    </View>
  );
}

export function ThirdApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

