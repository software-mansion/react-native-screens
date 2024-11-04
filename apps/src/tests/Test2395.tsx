import * as React from 'react';
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            headerRight: () => (
              <View
                style={{
                  backgroundColor: 'lightblue',
                  padding: 3,
                  height: 200,
                }}>
                <Text>Right</Text>
              </View>
            ),
            headerLeft: () => (
              <View
                style={{
                  backgroundColor: 'goldenrod',
                  padding: 8,
                }}>
                <Text>Left</Text>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            headerSearchBarOptions: {},
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({ navigation }: NativeStackScreenProps<ParamListBase>) {
  return (
    <FlatList
      style={styles.first}
      data={Array.from({ length: 20 }).fill(0) as number[]}
      renderItem={({ index }) => (
        <Pressable
          key={index}
          style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
          <Text style={styles.text}>List item {index + 1}</Text>
        </Pressable>
      )}
      ListFooterComponent={() => (
        <Button
          title="Go to second screen"
          onPress={() => navigation.navigate('Second')}
        />
      )}
    />
  );
}

function Second({ navigation }: NativeStackScreenProps<ParamListBase>) {
  return (
    <View style={styles.second}>
      <Button title="Go back" onPress={navigation.goBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  first: {
    flex: 1,
    backgroundColor: 'mediumseagreen',
  },
  second: {
    flex: 1,
    backgroundColor: 'slateblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: 'black',
    padding: 10,
  },
  pressed: {
    backgroundColor: 'seagreen',
  },
});
