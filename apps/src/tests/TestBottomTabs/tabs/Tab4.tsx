import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, ScrollView, Text } from 'react-native';

type RouteParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

export function LongText() {
  return (
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed egestas
      felis. Proin laoreet eros a tellus elementum, quis euismod enim gravida.
      Morbi at arcu commodo, condimentum purus a, congue sapien. Nunc luctus
      molestie enim ut mattis. Pellentesque sollicitudin, arcu nec sodales
      gravida, tortor mauris dignissim urna, nec venenatis nibh ex ut odio.
      Donec rhoncus arcu eu pulvinar cursus. Sed id ullamcorper erat. Proin
      mollis a mi vitae posuere. Integer a pretium tellus, vel faucibus metus.
      Pellentesque non lorem ullamcorper, auctor tellus vulputate, eleifend
      metus. Aenean in semper erat. Ut arcu elit, semper et dolor eu, pharetra
      ornare dui. Donec ac condimentum tellus, sed consequat tortor. Etiam
      facilisis diam sit amet felis rhoncus aliquet. Vestibulum pharetra sapien
      in tellus pharetra, vel rhoncus ipsum pharetra. Mauris eget porttitor
      nulla. Vestibulum blandit neque in molestie laoreet. Aliquam semper risus
      sit amet augue hendrerit suscipit. Vivamus eleifend aliquam congue. Mauris
      id volutpat neque. Donec erat justo, dictum quis ultrices sit amet,
      fermentum vel augue. Donec ut velit sit amet mauris tincidunt tincidunt.
      Mauris et neque ipsum. Aenean vitae eros in risus aliquam dignissim
      efficitur at nisl. Duis eu mi mauris. Quisque sodales convallis velit, a
      mollis quam dictum a. Phasellus iaculis tempus orci, ac ultrices lorem
      faucibus at. Aliquam bibendum nibh eu nisi ultrices, at faucibus purus
      imperdiet. Proin eu enim porttitor, hendrerit risus quis, sagittis neque.
      Sed ligula lacus, placerat non erat vitae, porta sagittis ligula. Nam
      egestas malesuada lectus, vitae auctor lorem hendrerit in. Maecenas
      hendrerit porta leo et fringilla. Praesent scelerisque arcu at sapien
      convallis, eget maximus purus malesuada. Praesent malesuada, justo at
      suscipit ullamcorper, massa turpis laoreet velit, in vulputate urna felis
      at odio. Suspendisse vehicula pretium purus, sit amet egestas nisl
      malesuada eu. Sed sed rhoncus sapien, id porta nisl. Sed non mi tortor.
      Nullam risus ipsum, ullamcorper eu ligula a, ullamcorper molestie augue.
      Donec eu purus vel quam ultricies egestas eu vel lectus. Nullam ac nunc
      augue. Cras dolor mi, mollis rhoncus eros non, condimentum pretium sem.
      Suspendisse vehicula enim a metus aliquet consectetur. Curabitur vehicula
      gravida risus in facilisis. Ut eget sapien nisi. Sed pulvinar mi nec
      volutpat ullamcorper. Aenean vulputate justo nec sapien consectetur
      sagittis. Nunc pellentesque a arcu ac mattis. Mauris nec turpis nec erat
      dignissim commodo. Vivamus porta mollis ipsum non rutrum. Sed facilisis
      ante cursus nunc suscipit, non tristique mauris posuere. Donec eget nisi
      facilisis, fermentum quam ut, imperdiet sem. Sed sit amet metus ligula.
      Vestibulum placerat dignissim libero, sit amet semper justo vestibulum ut.
      Etiam eget sagittis elit. Fusce lobortis enim urna, a molestie nulla
      bibendum sit amet. Sed tellus sem, sodales nec tellus eget, eleifend
      finibus purus. Proin sollicitudin dolor a luctus elementum. Proin eu dui
      vestibulum arcu venenatis rutrum.
    </Text>
  );
}

function Screen1({ navigation }: StackNavigationProp) {
  return (
    <ScrollView>
      <Button
        title="Go to screen 2"
        onPress={() => navigation.push('Screen2')}
      />
      <LongText />
    </ScrollView>
  );
}

function Screen2({ navigation }: StackNavigationProp) {
  return (
    <ScrollView>
      <Button
        title="Go to screen 3"
        onPress={() => navigation.push('Screen3')}
      />
      <LongText />
    </ScrollView>
  );
}

function Screen3({ navigation }: StackNavigationProp) {
  return (
    <ScrollView>
      <Button
        title="Go to screen 3"
        onPress={() => navigation.push('Screen3')}
      />
      <LongText />
    </ScrollView>
  );
}

export function Tab4() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{ headerTransparent: true }}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={{
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="Screen3"
          component={Screen3}
          options={{ headerTransparent: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
