import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, View, Text, ScrollView } from 'react-native';
import PressableWithFeedback from '../../shared/PressableWithFeedback';

type RouteParamList = {
  Main: undefined;
  PushWithoutHeader: undefined;
  PushWithTransparentHeader: undefined;
  ModalWithView: undefined;
  ModalWithViewAndNoHeader: undefined;
  ModalWithViewAndTransparentHeader: undefined;
  ModalWithScrollView: undefined;
  ModalWithScrollViewAndNoHeader: undefined;
  ModalWithScrollViewAndTransparentHeader: undefined;
  ModalWithScrollViewBehaviorAutomatic: undefined;
  ModalWithScrollViewBehaviorAutomaticAndNoHeader: undefined;
  ModalWithScrollViewBehaviorAutomaticAndTransparentHeader: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

function Screen1({ navigation }: StackNavigationProp) {
  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Push</Text>
      <Button
        title="WithoutHeader"
        onPress={() => navigation.push('PushWithoutHeader')}
      />
      <Button
        title="TransparentHeader"
        onPress={() => navigation.push('PushWithTransparentHeader')}
      />
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 10 }}>
        Modal + View
      </Text>
      <Button title="Normal" onPress={() => navigation.push('ModalWithView')} />
      <Button
        title="WithoutHeader"
        onPress={() => navigation.push('ModalWithViewAndNoHeader')}
      />
      <Button
        title="TransparentHeader"
        onPress={() => navigation.push('ModalWithViewAndTransparentHeader')}
      />
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 10 }}>
        Modal + ScrollView
      </Text>
      <Button
        title="Normal"
        onPress={() => navigation.push('ModalWithScrollView')}
      />
      <Button
        title="WithoutHeader"
        onPress={() => navigation.push('ModalWithScrollViewAndNoHeader')}
      />
      <Button
        title="TransparentHeader"
        onPress={() =>
          navigation.push('ModalWithScrollViewAndTransparentHeader')
        }
      />
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 10 }}>
        Modal + ScrollView
      </Text>
      <Text style={{ fontStyle: 'italic' }}>
        with contentInsetAdjustmentBehavior='automatic'
      </Text>
      <Button
        title="Normal"
        onPress={() => navigation.push('ModalWithScrollViewBehaviorAutomatic')}
      />
      <Button
        title="WithoutHeader"
        onPress={() =>
          navigation.push('ModalWithScrollViewBehaviorAutomaticAndNoHeader')
        }
      />
      <Button
        title="TransparentHeader"
        onPress={() =>
          navigation.push(
            'ModalWithScrollViewBehaviorAutomaticAndTransparentHeader',
          )
        }
      />
    </View>
  );
}

function Screen2() {
  return (
    <View style={{ gap: 20, paddingHorizontal: 30, paddingVertical: 10 }}>
      {[...Array(30).keys()].map(index => (
        <PressableWithFeedback
          key={index + 1}
          onPress={() => console.log(`Pressed #${index + 1}`)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          <Text>Pressable #{index + 1}</Text>
        </PressableWithFeedback>
      ))}
    </View>
  );
}

function Screen3() {
  return (
    <ScrollView
      contentContainerStyle={{
        gap: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
      }}>
      {[...Array(30).keys()].map(index => (
        <PressableWithFeedback
          key={index + 1}
          onPress={() => console.log(`Pressed #${index + 1}`)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          <Text>Pressable #{index + 1}</Text>
        </PressableWithFeedback>
      ))}
    </ScrollView>
  );
}

function Screen4() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        gap: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
      }}>
      {[...Array(30).keys()].map(index => (
        <PressableWithFeedback
          key={index + 1}
          onPress={() => console.log(`Pressed #${index + 1}`)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          <Text>Pressable #{index + 1}</Text>
        </PressableWithFeedback>
      ))}
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerRight: () => (
            <PressableWithFeedback
              onPress={() => console.log('Pressed headerRight')}>
              <Text>Pressable</Text>
            </PressableWithFeedback>
          ),
        }}>
        <Stack.Screen name="Main" component={Screen1} />
        <Stack.Screen
          name="PushWithoutHeader"
          component={Screen2}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PushWithTransparentHeader"
          component={Screen2}
          options={{
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="ModalWithView"
          component={Screen2}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ModalWithViewAndNoHeader"
          component={Screen2}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ModalWithViewAndTransparentHeader"
          component={Screen2}
          options={{
            presentation: 'modal',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="ModalWithScrollView"
          component={Screen3}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ModalWithScrollViewAndNoHeader"
          component={Screen3}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ModalWithScrollViewAndTransparentHeader"
          component={Screen3}
          options={{
            presentation: 'modal',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="ModalWithScrollViewBehaviorAutomatic"
          component={Screen4}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ModalWithScrollViewBehaviorAutomaticAndNoHeader"
          component={Screen4}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ModalWithScrollViewBehaviorAutomaticAndTransparentHeader"
          component={Screen4}
          options={{
            presentation: 'modal',
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
