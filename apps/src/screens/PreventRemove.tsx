import React from 'react';
import { View, StyleSheet, TextInput, Platform, Alert, ScrollView, Text } from 'react-native';
import { usePreventRemove } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button } from '../shared';

type StackParamList = {
  Main: undefined;
  PreventRemoveScreen: undefined;
  PreventRemoveModal: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'bisque' }}>
    <Button
      title="Go to screen"
      onPress={() => navigation.navigate('PreventRemoveScreen')}
    />
    <Button
      title="Open modal"
      onPress={() => navigation.navigate('PreventRemoveModal')}
    />
    <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
  </View>
);

const PreventRemoveScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList>;
}): JSX.Element => {
  const [text, setText] = React.useState('');

  const hasUnsavedChanges = Boolean(text);

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    Alert.alert(
      'Discard changes?',
      'You have unsaved changes. Discard them and leave the screen?',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => { } },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });

  return (
    <View style={{ ...styles.container, backgroundColor: 'thistle' }}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardDismissMode="interactive"
      >
        <TextInput
          autoFocus
          value={text}
          placeholder="Type something to prevent remove…"
          placeholderTextColor="#999"
          onChangeText={setText}
        />
        <Button
          title="Discard and go back"
          onPress={() => navigation.goBack()}
        />
        {Array.from({ length: 10 }).map((_, i) => (
          <Text key={`lorem-ipsum-${i}`} style={styles.loremIpsum}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{ title: 'Prevent Remove' }}
    />
    <Stack.Screen name="PreventRemoveScreen" component={PreventRemoveScreen} />
    <Stack.Screen
      name="PreventRemoveModal"
      component={PreventRemoveScreen}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  loremIpsum: {
    marginVertical: 8,
    fontSize: 16,
    color: 'gray',
  },
});

export default App;
