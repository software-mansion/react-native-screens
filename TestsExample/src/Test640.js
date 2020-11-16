import React from 'react';
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';

import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {NavigationContainer} from '@react-navigation/native';

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

function HomeScreen({navigation}) {
  return(
    <Button
      title="Navigate"
      onPress={() => navigation.navigate('Modal')} />
  );
}

function Modal({navigation}) {
  const someContent = Array.from({length: 50}, (v, i) => i);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentInsetAdjustmentBehavior="automatic"
      scrollToOverflowEnabled
      stickyHeaderIndices={[0, 5]}>
      {someContent.map((x) => (
        <TouchableOpacity key={x} style={styles.button}>
          <Text>Scroll to {x}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{stackPresentation: 'modal'}}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Modal"
          component={Modal}
          options={{}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
  },
  button: {
    padding: 5,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: 'lightblue',
    flex: 1,
  },
});
