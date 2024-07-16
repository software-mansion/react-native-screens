import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SettingsSwitch, Square, ToastProvider } from '../shared';
import { NavigationContainer } from '@react-navigation/native';

type StackParamList = {
  Settings: undefined;
};

interface SettingsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Settings'>;
}

const SettingsScreen = ({
  navigation,
}: SettingsScreenProps): React.JSX.Element => {
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
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}>
      <SettingsSwitch
        label="Left item"
        value={hasLeftItem}
        onValueChange={setHasLeftItem}
      />
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): React.JSX.Element => (
  <NavigationContainer>
    <ToastProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerTintColor: 'hotpink',
          }}
        />
      </Stack.Navigator>
    </ToastProvider>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'white',
  },
});

export default App;
