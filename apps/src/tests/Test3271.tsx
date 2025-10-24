import React from 'react';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, ScrollView, Text, View } from 'react-native';

type NavigationParamsList = {
  Home: undefined,
  ScrollView: undefined,
}

type StackNavigationProps = NavigationProp<NavigationParamsList>;

function ScrollViewComponent() {
  return (
    <ScrollView horizontal={ true } >
      <View style={{ width: 800 }}>
        <Text style={{ fontSize: 24 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae lacus tempor, condimentum ipsum eu, semper enim. Integer at arcu sem. Cras venenatis tellus non lacus scelerisque viverra. Mauris quis malesuada est. Maecenas venenatis ultricies magna. Etiam ultrices ultrices odio sit amet malesuada. Nullam condimentum pulvinar massa, quis laoreet mi maximus ac.

          Etiam vitae condimentum tellus, id semper quam. Sed congue metus lorem, vel viverra velit convallis at. Proin in placerat mauris, in egestas neque. Donec posuere pulvinar turpis id dapibus. Praesent feugiat ullamcorper neque in vehicula. Vestibulum risus nisl, hendrerit eget consequat ac, tincidunt sit amet sem. Integer egestas tristique viverra. Integer faucibus, odio eget lobortis tincidunt, neque est accumsan nunc, sed varius tortor tellus sed lorem. Suspendisse sit amet quam et augue finibus efficitur.
        </Text>
        <Text style={{ margin: 50, width: 300 }}>
          You should not be able to dismiss the screen from the center, only from the edges of the screen.
        </Text>
      </View>
    </ScrollView>
  );
}

export default function TestScrollViewHorizontal() {
  const Stack = createNativeStackNavigator<NavigationParamsList>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={(props: { navigation: StackNavigationProps }) => <View>
          <Button onPress={() => props.navigation.navigate('ScrollView')} title='Go to ScrollView' />
        </View>} />
        <Stack.Screen
          name="ScrollView"
          component={ScrollViewComponent}
          options={{
            animation: 'slide_from_bottom',
            animationMatchesGesture: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
