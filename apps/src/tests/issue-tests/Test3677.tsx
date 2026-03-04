import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Alert, Button, ScrollView, Text, View } from 'react-native';
import { ListItem } from '../../shared';

type StackRouteParamList = {
  Home: undefined;
  Second: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();

const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

function Second({}: StackNavigationProp) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Second screen</Text>
    </View>
  );
}

function Home({ navigation }: StackNavigationProp) {
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placement: 'stacked',
        hideWhenScrolling: false,
        onChangeText: event => setSearchQuery(event.nativeEvent.text),
      },
      // @ts-ignore – unstable API
      unstable_headerRightItems: () => [
        {
          type: 'menu',
          label: 'Menu',
          icon: { type: 'sfSymbol', name: 'ellipsis.circle' },
          menu: {
            items: [
              {
                label: 'Settings',
                type: 'action',
                icon: { type: 'sfSymbol', name: 'gear' },
                onPress: () => Alert.alert('Settings', 'Settings pressed'),
              },
              {
                label: 'Refresh',
                type: 'action',
                icon: { type: 'sfSymbol', name: 'arrow.triangle.2.circlepath' },
                onPress: () => Alert.alert('Refresh', 'Refresh pressed'),
              },
            ],
          },
        },
      ],
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ marginTop: 15 }}>
        <Text style={{ padding: 15, color: '#666', lineHeight: 22 }}>
          Steps to reproduce:{'\n'}
          1. Tap the search bar to focus it{'\n'}
          2. Dismiss the keyboard (tap Cancel or tap away){'\n'}
          3. Tap the menu button (ellipsis icon) in the header{'\n'}
          4. Expected: The keyboard should remain dismissed and the menu should
          appear without the keyboard reopening
        </Text>
        <Button
          title="Open Second"
          onPress={() => navigation.navigate('Second')}
          testID="home-button-open-second"
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
