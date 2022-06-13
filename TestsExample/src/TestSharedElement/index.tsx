import React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  ScrollView,
  Text,
  Image,
  useWindowDimensions,
  View,
  Button,
} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function NativeNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen1"
          component={Screen1}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={{
            customAnimationOnSwipe: true,
            transitionDuration: 200,
            sharedElementTransitions: [
              {
                from: 'screen-1-image-1',
                to: 'screen-2-image-1',
                duration: 500,
                damping: 0.8,
                initialVelocity: 8,
                easing: 'ease-in-out',
              },
              {
                from: 'screen-1-image-2',
                to: 'screen-2-image-2',
                easing: 'ease-out',
                duration: 700,
                showFromElementDuringAnimation: true,
                showToElementDuringAnimation: true,
              },
              {
                from: 'screen-1-text',
                to: 'screen-2-text',
                align: 'right-bottom',
                resizeMode: 'none',
              },
            ],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Screen1({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <Text style={{textAlign: 'center', margin: 40}}>Not shared screen content</Text>
      <Image
        source={require('./hiroshige-naruto.jpeg')}
        style={{resizeMode: 'cover', width: 100, height: 100}}
        nativeID="screen-1-image-1"
      />
      <Image
        source={require('./hokusai-lake-suwa.jpeg')}
        style={{resizeMode: 'contain', width: 100, height: 100}}
        nativeID="screen-1-image-2"
      />
      <View
        style={{height: 40, justifyContent: 'flex-end'}}
        nativeID="screen-1-text">
        <Text style={{textAlign: 'right', padding: 5}}>Right bottom aligned text</Text>
      </View>
      <Button
        title="Go to next Screen"
        onPress={() => {
          navigation.push('Screen2');
        }}
      />
    </ScrollView>
  );
}

const Screen2 = () => {
  const {width} = useWindowDimensions();
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{height: 100, justifyContent: 'flex-end'}}
        nativeID="screen-2-text">
        <Text style={{textAlign: 'right', padding: 5}}>Right bottom aligned text</Text>
      </View>
      <Image
        source={require('./hiroshige-naruto.jpeg')}
        style={{resizeMode: 'cover', width: 2 * width / 2, height:  2 * width / 2 + 100}}
        nativeID="screen-2-image-1"
      />
      <Image
        source={require('./hokusai-lake-suwa.jpeg')}
        style={{resizeMode: 'contain', width: width, height: width - 100}}
        nativeID="screen-2-image-2"
      />
    </ScrollView>
  );
};
