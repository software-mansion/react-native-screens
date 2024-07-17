import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';

import { SettingsSwitch, Square } from '../shared';
import { NavigationContainer } from '@react-navigation/native';

const SettingsScreen = ({ navigation }: any) => {
  const [hasLeftItem, setHasLeftItem] = useState(false);

  const square1 = (props: { tintColor?: string }) => (
    <View style={{ gap: 8, flexDirection: 'row' }}>
      {hasLeftItem && <Square {...props} color="green" size={20} />}
      <Square {...props} color="green" size={20} />
    </View>
  );

  const square2 = (props: { tintColor?: string }) => (
    <Square {...props} color="red" size={20} />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: square1,
      headerTitle: undefined,
      headerLeft: hasLeftItem ? square2 : undefined,
      headerBackTitleVisible: false,
    });
  }, [navigation, hasLeftItem]);

  return (
    <SettingsSwitch
      label="Left item"
      value={hasLeftItem}
      onValueChange={setHasLeftItem}
    />
  );
};

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTintColor: 'hotpink',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
