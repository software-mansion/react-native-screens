import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, ScrollView, Text } from 'react-native';
import type { SearchBarCommands } from 'react-native-screens';

type StackParamList = { Home: undefined; Detail: undefined };
const Stack = createNativeStackNavigator<StackParamList>();

// iOS 27: type a query, then dismiss with the round X beside integrated search.
// Query must match the actual field (empty), without incrementing Cancel presses.
// Also check in-field clear, Search (retains query), navigation/back (retains text),
// normal Cancel (one cancel and one empty change), and setText followed by dismissal.
function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList>;
}) {
  const searchRef = React.useRef<SearchBarCommands | null>(null);
  const [query, setQuery] = React.useState('');
  const [changes, setChanges] = React.useState<string[]>([]);
  const [cancels, setCancels] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      unstable_headerLeftItems: () => [
        {
          type: 'button',
          label: 'Detail',
          onPress: () => navigation.navigate('Detail'),
        },
      ],
      headerSearchBarOptions: {
        ref: searchRef,
        placement: 'integratedButton',
        allowToolbarIntegration: false,
        hideWhenScrolling: false,
        onChangeText: event => {
          setQuery(event.nativeEvent.text);
          setChanges(previous => [...previous, event.nativeEvent.text]);
        },
        onCancelButtonPress: () => setCancels(previous => previous + 1),
      },
    });
  }, [navigation]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Text testID="query">Query: {JSON.stringify(query)}</Text>
      <Text testID="changes">Changes: {JSON.stringify(changes)}</Text>
      <Text testID="cancels">Cancel presses: {cancels}</Text>
      {['Apple', 'Banana', 'Pear']
        .filter(item => item.toLowerCase().includes(query.toLowerCase()))
        .map(item => (
          <Text key={item}>{item}</Text>
        ))}
      <Button
        title="Set text from JS"
        onPress={() => {
          searchRef.current?.setText('Pear');
          setQuery('Pear');
        }}
      />
      <Button
        title="Cancel search"
        onPress={() => searchRef.current?.cancelSearch()}
      />
      <Button
        title="Open Detail"
        onPress={() => navigation.navigate('Detail')}
      />
    </ScrollView>
  );
}

export default function Test5075() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Detail"
          component={() => <Text>Go back to check retained search text.</Text>}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
