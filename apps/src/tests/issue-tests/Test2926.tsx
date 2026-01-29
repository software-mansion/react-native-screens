import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, View, ScrollView } from 'react-native';
import { ListItem, SettingsSwitch } from '../../shared';

type StackRouteParamList = {
  Home: undefined;
  Second: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();

const items = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`);

function Second({}: StackNavigationProp) {
  return (
    <View>
      <Text>Second screen</Text>
    </View>
  );
}

function Home({ navigation }: StackNavigationProp) {
  const [searchEnabled, setSearchEnabled] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useLayoutEffect(() => {
    if (searchEnabled) {
      navigation.setOptions({
        headerSearchBarOptions: {
          // Added in https://github.com/software-mansion/react-native-screens/pull/3186
          // to preserve test's original search bar configuration.
          placement: 'stacked',
          hideWhenScrolling: false,
          onChangeText: event => setSearchQuery(event.nativeEvent.text),
        },
      });
    } else {
      setSearchQuery('');
      navigation.setOptions({
        headerSearchBarOptions: undefined,
      });
    }
  }, [navigation, searchEnabled]);

  return (
    <View style={[{ flex: 1, gap: 15 }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ marginTop: 15 }}>
        <Button
          title="Open Second"
          onPress={() => navigation.navigate('Second')}
          testID="home-button-open-second"
        />
        <SettingsSwitch
          style={{ marginTop: 15, marginBottom: 15 }}
          label="Search enabled"
          value={searchEnabled}
          onValueChange={() => setSearchEnabled(!searchEnabled)}
          testID="home-switch-search-enabled"
        />
        {items
          .filter(
            name =>
              searchQuery === '' ||
              name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .map(name => (
            <ListItem key={name} title={name} onPress={() => {}} />
          ))}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Second" component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
