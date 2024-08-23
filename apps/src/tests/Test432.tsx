import { Pressable, View, Button, Text } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, { useCallback } from 'react';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};
type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

const HomeScreen = ({ navigation }: RootStackScreenProps<'Home'>) => {
  const [x, setX] = React.useState(false);
  React.useEffect(() => {
    navigation.setOptions({
      headerBackVisible: !x,
      headerRight: x
        ? () => (
            <View style={{ backgroundColor: 'green', width: 20, height: 20 }} />
          )
        : () => (
            <View style={{ backgroundColor: 'green', width: 10, height: 10 }} />
          ),
    });
  }, [navigation, x]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Tap me for header update" onPress={() => setX(!x)} />
      <Button
        title={'Show settings'}
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings</Text>
    </View>
  );
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator = () => {
  const navigation = useNavigation();
  const headerRight = useCallback(
    () => (
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}>
        <Text>Close</Text>
      </Pressable>
    ),
    [navigation],
  );
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Home" component={HomeScreen} />
      <RootStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: true,
          headerRight: headerRight,
        }}
      />
    </RootStack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
