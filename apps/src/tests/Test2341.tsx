import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ViewProps,
} from 'react-native';

enableScreens(true);

function Item({ children, ...props }: ViewProps) {
  return (
    <View style={styles.item} {...props}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

function Home({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Button title="Go to List" onPress={() => navigation.navigate('List')} />
    </View>
  );
}

function ListScreen() {
  return (
    <FlatList
      data={Array.from({ length: 50 }).fill(0)}
      renderItem={({ index }) =>
        index === 20 ? (
          <View key={index}>
            <NestedFlatlist />
          </View>
        ) : (
          <Item key={index}>List item {index + 1}</Item>
        )
      }
    />
  );
}

function NestedFlatlist() {
  return (
    <FlatList
      style={styles.nestedList}
      data={Array.from({ length: 10 }).fill(0)}
      renderItem={({ index }) => (
        <Item key={index}>Nested list item {index + 1}</Item>
      )}
    />
  );
}

const Stack = createNativeStackNavigator();

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="List" component={ListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nestedList: {
    backgroundColor: '#FFA07A',
  },
  item: {
    padding: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});
