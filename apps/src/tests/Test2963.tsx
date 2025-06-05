import React from 'react';
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';
import Colors from '../shared/styling/Colors';

type PushedScreenProps = {
  screenNumber: number;
  intervalId?: number;
};

type StackRouteParamList = {
  Home: undefined;
  Push: PushedScreenProps;
  ModalWithoutHeader: PushedScreenProps;
  ModalWithHeader: PushedScreenProps;
  PageSheetWithHeader: PushedScreenProps;
  FormSheetWithoutHeader: PushedScreenProps;
  FormSheetWithHeader: PushedScreenProps;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
  route: RouteProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;
const Stack = createNativeStackNavigator<StackRouteParamList>();

function Second({ navigation, route }: StackNavigationProp) {
  const { screenNumber, intervalId } = route.params ?? {
    screenNumber: -1,
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BlueLight40,
      }}>
      <Text>Another screen</Text>
      <Text testID={`screen-${screenNumber}-text`}>{screenNumber}</Text>
      <Button
        onPress={() => {
          clearInterval(intervalId);
          navigation.popTo('Home');
        }}
        title="Stop"
      />
    </View>
  );
}

function Home({ navigation }: StackNavigationProp) {
  const startPushingScreens = (screen: any) => {
    let screenNumber = 1;
    let intervalId: number | NodeJS.Timeout | undefined;

    intervalId = setInterval(() => {
      navigation.push(screen, {
        screenNumber: screenNumber++,
        intervalId: intervalId,
      });
    }, 1000);
  };

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.PurpleDark40,
        },
      ]}>
      <Text
        style={{
          color: Colors.GreenDark120,
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 10,
        }}>
        Working correctly:
      </Text>
      <Button
        title="card/push screens"
        onPress={() => startPushingScreens('Push')}
      />
      <Button
        title="pageSheets"
        onPress={() => startPushingScreens('PageSheetWithHeader')}
      />
      <Button
        title="modals without header"
        onPress={() => startPushingScreens('ModalWithoutHeader')}
      />
      <Button
        title="formSheets without header"
        onPress={() => startPushingScreens('FormSheetWithoutHeader')}
      />
      <Text
        style={{
          color: Colors.RedDark110,
          fontSize: 24,
          fontWeight: 'bold',
          marginTop: 40,
          marginBottom: 10,
        }}>
        Working incorrectly:
      </Text>
      <Button
        title="modals with header"
        onPress={() => startPushingScreens('ModalWithHeader')}
      />
      <Button
        title="formSheets with header"
        onPress={() => startPushingScreens('FormSheetWithHeader')}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ freezeOnBlur: false }}
        />
        <Stack.Screen
          name="Push"
          component={Second}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="ModalWithoutHeader"
          component={Second}
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="ModalWithHeader"
          component={Second}
          options={{ presentation: 'modal', headerShown: true }}
        />
        <Stack.Screen
          name="PageSheetWithHeader"
          component={Second}
          options={{ presentation: 'pageSheet', headerShown: true }}
        />
        <Stack.Screen
          name="FormSheetWithoutHeader"
          component={Second}
          options={{ presentation: 'formSheet', headerShown: false, sheetAllowedDetents: [0.4] }}
        />
        <Stack.Screen
          name="FormSheetWithHeader"
          component={Second}
          options={{ presentation: 'formSheet', headerShown: true, sheetAllowedDetents: [0.4] }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
