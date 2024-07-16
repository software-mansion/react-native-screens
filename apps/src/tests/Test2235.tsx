import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button } from '../shared';
import { NavigationContainer } from '@react-navigation/native';

type StackParamList = {
  Main: undefined;
  Detail: undefined;
  Detail2: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'moccasin' }}>
    <Button
      testID="simple-native-stack-go-to-detail"
      title="Go to detail"
      onPress={() => {
        navigation.navigate('Detail');
        navigation.navigate('Detail2');
      }}
    />
  </View>
);

interface DetailScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Detail'>;
}

const DetailScreen = ({ navigation }: DetailScreenProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'thistle' }}>
    <Button
      title="Go back"
      onPress={() => navigation.goBack()}
      testID="simple-native-stack-detail-go-back"
    />
  </View>
);

const DetailScreen2 = ({
  navigation,
}: DetailScreenProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'yellow' }}>
    <Button
      title="Go back"
      onPress={() => navigation.goBack()}
      testID="simple-native-stack-detail-go-back"
    />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): React.JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerBackVisible: false,
      }}>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ title: 'Simple Native Stack' }}
      />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Detail2" component={DetailScreen2} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});

export default App;
