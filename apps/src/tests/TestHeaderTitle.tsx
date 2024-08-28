import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const baseTitle = 'Ab';

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ statusBarTranslucent: false }}>
        <Stack.Screen
          name="Screen"
          component={Screen}
          options={{
            headerLeft: () => {
              return (
                <View style={{ width: 80, height: 20, backgroundColor: 'goldenrod', flexShrink: 1 }}>
                </View>
              )
            },
            // headerRight: () => (
            //   <View style={{ width: 80, height: 20, minWidth: 80, backgroundColor: 'goldenrod', flexShrink: 0, opacity: 0.4 }}>
            //   </View>
            // ),
            headerTitle: baseTitle.repeat(20),
            // headerTitle: () => (
            //   <Text>{baseTitle.repeat(20)}</Text>
            // ),
            // headerTitle: () => (
            //   <View style={{ borderColor: 'red', borderWidth: 2, height: 20, flexShrink: 1 }}>
            //     <Text numberOfLines={1} style={{ flexShrink: 1 }}>{baseTitle.repeat(25)}</Text>
            //   </View>
            // ),
            // title: baseTitle.repeat(15),
            // headerTitleAlign: 'center'
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ navigation }) => ({
            title: 'Details',
            headerRight: () => (
              <Pressable
                onPress={navigation.goBack}
                style={({ pressed }) => [
                  styles.pressable,
                  pressed && { backgroundColor: 'goldenrod' },
                ]}>
                <Text>Go Back</Text>
              </Pressable>
            ),
          })}
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
          <View collapsable={false} style={{ flexShrink: 1 }}>
            <Text numberOfLines={1} style={{ flexShrink: 0 }}>{baseTitle.repeat(20)}</Text>
          </View>
          <View collapsable={false} style={{ flexShrink: 1, width: 80 }}>
            <View style={{ backgroundColor: 'lightgreen', width: 80, height: 20, opacity: 0.6 }} />
          </View>
        </View>
      </View>
    </View>
  );
}

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
