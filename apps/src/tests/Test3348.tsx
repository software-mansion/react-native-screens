import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../shared/styling/Colors';

const Stack = createNativeStackNavigator();

const CustomBackgroundComponent = () => (
  <Image
    source={{
      uri: 'https://fastly.picsum.photos/id/309/400/800.jpg?hmac=Pjy1rvSFQNX9tqavzeWNpy3dfWBGjLkY0doRN50JXBA',
    }}
    style={{
      height: '100%',
      aspectRatio: 1
    }}
  />
);

function HomeScreen() {
  return (
    <View style={styles.screenContent}>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: {
            padding: 35,
          },
          renderBackground: CustomBackgroundComponent,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    backgroundColor: Colors.Navy,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    color: Colors.White,
  },
});

export default App;
