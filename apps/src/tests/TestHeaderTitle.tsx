import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet, Pressable, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const baseTitle = 'Ab';

const headerOptions = {
  headerLeft: () => {
    return (
      <View style={{ width: 80, height: 20, backgroundColor: 'goldenrod' }}>
      </View>
    )
  },
  headerRight: () => (
    <View style={{}}>
      <View style={{ width: 80, height: 20, backgroundColor: 'goldenrod', opacity: 0.4 }}>
      </View>
    </View>
  ),
  // headerTitle: baseTitle.repeat(20),
  // headerTitle: () => (
  //   <Text>{baseTitle.repeat(20)}</Text>
  // ),
  headerTitle: () => (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
      <Text numberOfLines={1} style={{}}>{baseTitle.repeat(20)}</Text>
    </View>
  ),
  // title: baseTitle.repeat(20),
  headerTitleAlign: 'left',
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ statusBarTranslucent: false }}>
        <Stack.Screen
          name="Screen"
          component={Screen}
          options={headerOptions}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={headerOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Screen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
        <View style={{ backgroundColor: 'goldenrod', flexDirection: 'row', width: 200 }}>
          <View collapsable={false} style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{}}>{baseTitle.repeat(20)}</Text>
          </View>
          <View collapsable={false} style={{}}>
            <View style={{ backgroundColor: 'lightgreen', width: 50, height: 20, opacity: 0.6 }} />
          </View>
          <View collapsable={false} style={{}}>
            <View style={{ backgroundColor: 'pink', width: 30, height: 20, opacity: 0.6 }} />
          </View>
        </View>
      </View>
      <Button onPress={() => navigation.navigate("Details")} title="GoDetails" />
    </View>
  );
}

// function AppScreensOnly

function DetailsScreen() {
  let counter = React.useRef(0);

  return (
    <View style={{ ...styles.container, backgroundColor: 'beige' }}>
      <Pressable
        onPressIn={() => {
          counter.current += 1;
          console.log(`[${counter.current}] Details: onPressIn`);
        }}
        onPress={() => {
          console.log(`[${counter.current}] Details: onPress`);
        }}
        onPressOut={() => {
          console.log(`[${counter.current}] Details: onPressOut`);
        }}
        style={({ pressed }) => [
          styles.pressable,
          pressed && { backgroundColor: 'goldenrod' },
        ]}>
        <Text>Press me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'red',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
});

export default App;
