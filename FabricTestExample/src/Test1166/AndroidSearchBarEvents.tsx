import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import { SearchBarProps } from 'react-native-screens';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="First" component={First} />
    </Stack.Navigator>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [events, setEvents] = React.useState<string[]>([]);
  React.useLayoutEffect(() => {
    const searchBar: SearchBarProps = {
      onSearchButtonPress: () => setEvents(prev => [...prev, 'Search']),
      onBlur: () => setEvents(prev => [...prev, 'Blur']),
      onClose: () => setEvents(prev => [...prev, 'Close']),
      onOpen: () => setEvents(prev => [...prev, 'Open']),
      onFocus: () => setEvents(prev => [...prev, 'Focus']),
    };
    navigation.setOptions({
      searchBar: searchBar,
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', padding: 12 }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      {events.map((event, i) => (
        <Text key={i}>{event}</Text>
      ))}
    </View>
  );
}
