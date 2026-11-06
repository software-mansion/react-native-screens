import React from 'react';
import { Alert, Button, StyleSheet, Switch, Text, View } from 'react-native';
import {
  NavigationContainer,
  usePreventRemove,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5158
//
// Home has `headerShown: false`. Guarded prevents its removal with
// `usePreventRemove`. Tap Guarded's native back button, then "Stay" in the
// alert. Expected: Guarded's navigation bar (back button, title, "Save") is
// still there, with its Liquid Glass platters intact (iOS 26+).
// Bug: the bar items lose their glass, or the whole bar is gone.

type StackParamList = {
  Home: undefined;
  Guarded: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'Home'>;
}) {
  const [headerShown, setHeaderShown] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown });
  }, [navigation, headerShown]);

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <View style={styles.row}>
        <Text>Home header shown</Text>
        <Switch
          value={headerShown}
          onValueChange={setHeaderShown}
          testID="home-header-switch"
        />
      </View>
      <Button
        title="Open guarded screen"
        onPress={() => navigation.navigate('Guarded')}
        testID="home-open-guarded"
      />
    </View>
  );
}

function Guarded({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'Guarded'>;
}) {
  const [preventRemove, setPreventRemove] = React.useState(true);

  usePreventRemove(preventRemove, ({ data }) => {
    Alert.alert('Unsaved changes', 'Leave this screen?', [
      { text: 'Stay', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  return (
    <View style={styles.container}>
      <Text>Guarded</Text>
      <View style={styles.row}>
        <Text>Prevent remove</Text>
        <Switch
          value={preventRemove}
          onValueChange={setPreventRemove}
          testID="guarded-prevent-switch"
        />
      </View>
    </View>
  );
}

function SaveButton() {
  return <Button title="Save" onPress={() => {}} testID="guarded-save" />;
}

export default function Test5158() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home', headerShown: false }}
        />
        <Stack.Screen
          name="Guarded"
          component={Guarded}
          options={{
            title: 'Guarded',
            headerRight: SaveButton,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: Colors.White,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
