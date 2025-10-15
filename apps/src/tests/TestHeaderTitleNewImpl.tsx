import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EXAMPLES, ExampleRouteName } from './TestHeaderTitleExamples';
import { Button, FlatList, StyleSheet, View } from 'react-native';

export type RootStackParamList = {
  Examples: undefined;
} & {
  [K in ExampleRouteName]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ExamplesList = () => {
  const navigation = useNavigation();

  const data = Object.entries(EXAMPLES).map(([key, value]) => ({
    routeName: key as ExampleRouteName,
    title: value.name,
  }));

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={data}
      keyExtractor={(item) => item.routeName.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Button
            title={item.title}
            // @ts-ignore
            onPress={() => navigation.navigate(item.routeName)}
          />
        </View>
      )}
    />
  );
};


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Examples" component={ExamplesList} />
        {Object.entries(EXAMPLES).map(([routeName, { component, name }]) => (
          <Stack.Screen
            key={routeName}
            name={routeName as ExampleRouteName}
            component={component}
            options={{ title: name }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  item: {
    marginBottom: 12,
  },
});

export default App;
