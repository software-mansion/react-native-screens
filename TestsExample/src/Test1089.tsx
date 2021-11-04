import * as React from 'react';
import {
  Button,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import Animated, {
  LinearTransition,
} from 'react-native-reanimated';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createNativeStackNavigator();

const NestedStack = createStackNavigator();

const width = 375;
const height = 250;
const picURI = `https://picsum.photos/id/3/${width}/${height}`;

const sharedElements = [
  {fromID: 'view3000', toID: 'view3000Dest'},
  {fromID: 'ImageRandom0', toID: 'ImageRandomDest'},
  {fromID: 'TextRandom0', toID: 'TextRandomDest'},
];

// Nested stack to check if transition progress values are passed properly through non native-stack navigators
function NestedFirst() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="NestedFirst" component={First} options={{headerShown: false}}/>
    </NestedStack.Navigator>
  )
}

type SimpleStackParams = {
  First: undefined;
  Second: undefined;
};

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'First'>;
}) {

  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={{width: '100%', height: 100, backgroundColor: 'red'}}
        nativeID={sharedElements[0].fromID}
        sharedElementTransition={LinearTransition}
        />
      <Button  onPress={() => navigation.navigate('Second')}  title="Click"/>
    </View>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'Second'>;
}) {
  React.useEffect(() => {
    navigation.setOptions({
      sharedElements,
    });
  }, [navigation]);

  return (
    <View style={{flex: 1}}>
      <Animated.View style={{width: '100%', height: 200, backgroundColor: 'green'}}
        nativeID={sharedElements[0].toID}
        sharedElementTransition={LinearTransition}
        />
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
    </View>
  );
};

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackAnimation: 'default',
        }}>
        <Stack.Screen name="First" component={NestedFirst} options={{sharedElements, headerShown: false}}/>
        <Stack.Screen name="Second" component={Second} options={{headerShown: true, sharedElements}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
