import React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Pressable } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  NavigationContainer,
  useNavigation,
  ParamListBase,
  type NavigationProp,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'red',
  },
  innerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    padding: 20,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },

  textIntro: {
    padding: 10,
  },

  buttons: {
    flexDirection: 'row',
    padding: 10,
  },

  text: {
    textAlign: 'center',
  },
});

type RootStackScreens = {
  Home: undefined;
  Modal: undefined;
  TransparentModal: undefined;
  ContainedTransparentModal: undefined;
};

const RootStack = createNativeStackNavigator<RootStackScreens>();

function Home() {
  const navigation = useNavigation<NavigationProp<RootStackScreens>>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.inner}>
        <Text style={styles.textIntro}>
          Red represents the safe area padding as provided by React Native Safe
          Area Context (although I've noticed that the issue also affects the
          build in react native SafeArea component).
        </Text>
        <Text style={styles.textIntro}>
          This only applies to iOS. Ensure you have rotation lock off, and
          rotate the view into landscape orientation. Note how the red safe
          areas appear. Then tap `Spawn Transparent Modal`, dismiss the modal,
          and then rotate the screen again to see how the safe areas are now
          stuck as the portrait values. You must force quite the app to undo the
          bug.
        </Text>
        <Pressable
          style={styles.pressable}
          onPress={() => navigation.navigate('Modal')}>
          <Text style={styles.text}>"modal"</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => navigation.navigate('ContainedTransparentModal')}>
          <Text style={styles.text}>"containedTransparentModal"</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => navigation.navigate('TransparentModal')}>
          <Text style={styles.text}>"transparentModal"</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Modal({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={styles.innerModal}>
      <Text>Modal</Text>
      <Pressable style={styles.pressable} onPress={() => navigation.goBack()}>
        <Text>Go Back!</Text>
      </Pressable>
      <Pressable
        style={styles.pressable}
        onPress={() => navigation.push('Modal')}>
        <Text>Open another modal!</Text>
      </Pressable>
    </View>
  );
}

function TransparentModal({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={styles.innerModal}>
      <Text>Transparent Modal</Text>
      <Pressable style={styles.pressable} onPress={() => navigation.goBack()}>
        <Text>Go Back!</Text>
      </Pressable>
      <Pressable
        style={styles.pressable}
        onPress={() => navigation.push('TransparentModal')}>
        <Text>Open another modal!</Text>
      </Pressable>
    </View>
  );
}

function ContainedTransparentModal({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={styles.innerModal}>
      <Text>Contained Transparent Modal</Text>
      <Pressable style={styles.pressable} onPress={() => navigation.goBack()}>
        <Text>Go Back!</Text>
      </Pressable>
      <Pressable
        style={styles.pressable}
        onPress={() => navigation.push('ContainedTransparentModal')}>
        <Text>Open another modal!</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Home" component={Home} />
          <RootStack.Screen
            name="TransparentModal"
            component={TransparentModal}
            options={{ presentation: 'transparentModal' }}
          />
          <RootStack.Screen
            name="ContainedTransparentModal"
            component={ContainedTransparentModal}
            options={{ presentation: 'containedTransparentModal' }}
          />
          <RootStack.Screen
            name="Modal"
            component={Modal}
            options={{ presentation: 'modal' }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
