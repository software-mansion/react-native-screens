import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5143
//
// A formSheet hosts its own native stack. "Continue" closes the sheet and
// pushes a screen onto the root stack on the next tick. The pushed screen
// reuses a recycled RNSScreenContentWrapper whose delegate still points at the
// dismissed sheet, which logs "sheetPresentationController is null when
// attempting to set allowed detents" (a red box in development).
// Expected: the Next screen opens without a red box.

type RootStackParamList = {
  Home: undefined;
  Next: undefined;
  Sheet: undefined;
};

type SheetStackParamList = {
  SheetHome: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const SheetStack = createNativeStackNavigator<SheetStackParamList>();

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
      }}>
      <Button
        title="Open form sheet"
        onPress={() => navigation.navigate('Sheet')}
        testID="home-open-sheet"
      />
    </View>
  );
}

function Next() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
      }}>
      <Text testID="next-text">Pushed right after the sheet closed.</Text>
    </View>
  );
}

function SheetHome({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SheetStackParamList>;
}) {
  const onContinue = () => {
    const rootNavigation = navigation.getParent();
    // Close the form sheet, then push onto the root stack on the next tick.
    rootNavigation?.goBack();
    setTimeout(() => rootNavigation?.navigate('Next'), 0);
  };

  return (
    <View style={{ padding: 24, backgroundColor: Colors.White }}>
      <Button title="Continue" onPress={onContinue} testID="sheet-continue" />
    </View>
  );
}

// The form sheet hosts its own stack (a multi-step sheet flow).
function Sheet() {
  return (
    <SheetStack.Navigator screenOptions={{ title: 'Sheet' }}>
      <SheetStack.Screen name="SheetHome" component={SheetHome} />
    </SheetStack.Navigator>
  );
}

export default function Test5143() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home' }}
        />
        <RootStack.Screen
          name="Next"
          component={Next}
          options={{ title: 'Next' }}
        />
        <RootStack.Screen
          name="Sheet"
          component={Sheet}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [1],
            headerShown: false,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
