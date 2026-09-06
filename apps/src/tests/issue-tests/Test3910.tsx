import React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-screens/experimental';

export type RootStackParamList = {
  Home: undefined;
  Sheet: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => (
  <SafeAreaView edges={{ top: true, bottom: true }}>
    <Button
      title="Open form sheet"
      onPress={() => navigation.navigate('Sheet')}
    />
  </SafeAreaView>
);

const SheetScreen = () => (
  <View style={{ height: 250 }}>
    <Text>This is a form sheet.</Text>
  </View>
);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Sheet"
        component={SheetScreen}
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: 'fitToContents',
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
