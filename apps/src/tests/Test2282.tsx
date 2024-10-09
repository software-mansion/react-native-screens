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
  Image,
  FlatListProps,
} from 'react-native';

enableScreens(true);

function Item({ children, ...props }: ViewProps) {
  return (
    <View style={styles.item} {...props}>
      <Image source={require('../assets/trees.jpg')} style={styles.image} />
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
      data={Array.from({ length: 30 }).fill(0)}
      renderItem={({ index }) => {
        if (index === 15) {
          return <NestedFlatlist key={index} />;
        } else if (index === 18) {
          return <ExtraNestedFlatlist key={index} />;
        } else if (index === 26) {
          return <NestedFlatlist key={index} horizontal />;
        } else if (index === 28) {
          return <ExtraNestedFlatlist key={index} horizontal />;
        } else {
          return <Item key={index}>List item {index + 1}</Item>;
        }
      }}
    />
  );
}

function NestedFlatlist(props: Partial<FlatListProps<number>>) {
  return (
    <FlatList
      style={[styles.nestedList, props.style]}
      data={Array.from({ length: 10 }).fill(0) as number[]}
      renderItem={({ index }) => (
        <Item key={'nested' + index}>Nested list item {index + 1}</Item>
      )}
      {...props}
    />
  );
}

function ExtraNestedFlatlist(props: Partial<FlatListProps<number>>) {
  return (
    <FlatList
      style={styles.nestedList}
      data={Array.from({ length: 10 }).fill(0) as number[]}
      renderItem={({ index }) =>
        index === 4 ? (
          <NestedFlatlist key={index} style={{ backgroundColor: '#d24729' }} />
        ) : (
          <Item key={'nested' + index}>Nested list item {index + 1}</Item>
        )
      }
      {...props}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    width: 50,
    height: 50,
  },
});
