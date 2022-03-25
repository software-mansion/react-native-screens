import * as React from 'react';
import {Button, ScrollView, View} from 'react-native';
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from 'react-native-screens/native-stack';

const AppStack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <AppStack.Navigator>
        <AppStack.Screen name="First" component={First} />
        <AppStack.Screen name="Second" component={Second} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

function First({navigation}: NativeStackScreenProps<ParamListBase>) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
    </View>
  );
}

function Second({navigation}: {navigation: NavigationProp<ParamListBase>}) {
    const items = [
        'Apples',
        'Pie',
        'Juice',
        'Cake',
        'Nuggets',
        'Some',
        'Other',
        'Stuff',
        'To',
        'Fill',
        'The',
        'Scrolling',
        'Space',
        'Space',
        'Space',
        'Space',
        'Space',
        'Space',
        'Space',
        'Space',
        ];

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
      {items.map((item) => (
          <Button
            title={item}
            key={item}
            onPress={() => {
              console.log(`${item} clicked`);
            }}
          />
        ))}
    </ScrollView>
  );
}
