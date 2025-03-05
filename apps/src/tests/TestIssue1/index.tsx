import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Platform, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle, useColorScheme } from 'react-native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackButtonProps } from '@react-navigation/elements';
import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ParallaxScrollView from './components/ParallaxScrollView';

const ThemedView = View;
const ThemedText = Text;

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';


export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

type StackRouteParamList = {
  BlueTabsHost: undefined;
  GreenScreen: undefined;
  GreenModal: undefined;
  RedScreenHost: undefined;
}

type StackRouteParams = {
  navigation: NativeStackNavigationProp<StackRouteParamList>;
}

type RedStackRouteParamList = {
  RedScreen: undefined;
  RedSubScreen: undefined;
}

type RedStackRouteParams = {
  navigation: NativeStackNavigationProp<RedStackRouteParamList>;
}

//export function HeaderLeft({ onPress, style, ...props }: HeaderBackButtonProps) {
//  const handlePress = onPress ?? (router.canGoBack() ? router.back : () => console.log("No back route"));
//
//  return (
//    <TouchableOpacity hitSlop={20} onPress={handlePress} style={[style]} {...props}>
//      <Image source={require("@/assets/images/icon-close.png")} style={{ height: 18, tintColor: "blue", width: 18 }} />
//    </TouchableOpacity>
//  );
//}

export const ScrollviewWithStuff = ({ style }: { style: StyleProp<ViewStyle> }) => {
  // render views with random height and background color
  return (
    <ScrollView style={style} contentContainerStyle={{ gap: 10, padding: 16 }}>
      {Array.from({ length: 200 }).map((_, index) => (
        <View
          key={index}
          style={{
            height: Math.random() * 100,
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          }}
        />
      ))}
    </ScrollView>
  );
};


function GreenScreen({ navigation }: StackRouteParams) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <Button title="Green / Modal " onPress={() => navigation.navigate('GreenModal')} />
        <View style={{ flex: 1, width: 50, backgroundColor: 'green' }} />
        <View style={{ height: 50, width: '100%', backgroundColor: 'darkgreen' }} />
      </View>
    </>
  );
}

function GreenModal({ navigation }: StackRouteParams) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Button title="dismiss()" onPress={() => navigation.goBack()} />
      <Button title="dismissAll()" onPress={() => navigation.popToTop()} />
      <Button title="dismissTo /blue" onPress={() => navigation.popTo('BlueTabsHost')} />
      <Button title="dismissTo /red" onPress={() => navigation.popTo('RedScreenHost')} />
      <View style={{ flex: 1, width: 50, backgroundColor: 'green' }} />
      <View style={{ height: 50, width: '100%', backgroundColor: 'darkgreen' }} />
    </View>
  );
}

function RedScreen({ navigation }: RedStackRouteParams) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Button title="Red / Subroute" onPress={() => navigation.navigate('RedSubScreen')} />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 50, height: '100%', backgroundColor: 'red' }} />
        <ScrollviewWithStuff style={{ flex: 1 }} />
      </View>
      <View style={{ height: 50, backgroundColor: 'darkred', width: '100%' }} />
    </View>
  );
}

function RedSubScreen({ navigation }: RedStackRouteParams) {
  const parentNavigator = navigation.getParent<StackRouteParamList['navigation']>();

  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Button title="dismiss" onPress={() => navigation.pop()} />
      <Button title="dismissAll" onPress={() => navigation.popToTop()} />
      <Button title="dismissTo /blue" onPress={() => navigation.popTo('BlueScreen')} />
      <Button title="navigate /green/modal" onPress={() => navigation.navigate('GreenModal')} />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 50, height: '100%', backgroundColor: 'red' }} />
        <ScrollviewWithStuff style={{ flex: 1 }} />
      </View>
      <View style={{ height: 50, backgroundColor: 'darkred', width: '100%' }} />
    </View>
  );
}

function RedScreenHost() {
  return (
    <RedStack.Navigator>
      <RedStack.Screen name="RedScreen" component={RedScreen} />
      <RedStack.Screen name="RedSubScreen" component={RedSubScreen} />
    </RedStack.Navigator>
  );
}

function BlueStackHome({ navigation }: any) {
  // HEADER IMAGE REMOVED
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<View style={styles.reactLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Home</ThemedText>
      </ThemedView>
      <View style={{ flex: 1, gap: 8 }}>
        <Button title="Green" onPress={() => navigation.navigate('GreenScreen')} />
        <Button title="Blue" onPress={() => navigation.navigate('BlueStackSecond')} />
        <Button title="Red" onPress={() => navigation.navigate('RedScreenHost')} />
      </View>
    </ParallaxScrollView>
  );
}

function BlueStackSecond({ navigation }: any) {
  const tabHeight = useBottomTabBarHeight();
  return (
    <View style={{ flex: 1, paddingBottom: tabHeight }}>
      <Button title="Blue / Subroute" onPress={() => navigation.navigate('BlueStackSubroute')} />
      <View style={{ flex: 1, backgroundColor: 'blue', width: 50 }} />
      <View style={{ height: 50, backgroundColor: 'darkblue', width: '100%' }} />
    </View>
  );
}


function BlueStackSubroute({ navigation }: any) {
  const tabHeight = useBottomTabBarHeight();
  return (
    <View style={{ flex: 1, paddingBottom: tabHeight }}>
      <Button title="dismiss" onPress={() => navigation.dismiss()} />
      <Button title="dismissAll" onPress={() => navigation.dismissAll()} />
      <Button title="navigate /green/modal" onPress={() => navigation.navigate('GreenModal')} />
      <Button title="navigate /red/subroute" onPress={() => navigation.navigate('/red/subroute')} />
      <View style={{ flex: 1, backgroundColor: 'blue', width: 50 }} />
      <View style={{ height: 50, backgroundColor: 'darkblue', width: '100%' }} />
    </View>
  );
}

function BlueTabsHome() {
  return (
    <BlueStack.Navigator>
      <BlueStack.Screen name="BlueStackHome" component={BlueStackHome} options={{ headerShown: false }} />
      <BlueStack.Screen name="BlueStackSecond" component={BlueStackSecond} />
      <BlueStack.Screen name="BlueStackSubroute" component={BlueStackSubroute} />
    </BlueStack.Navigator>
  );
}

function BlueTabsExplore() {

}

function BlueTabsHost() {
  const colorScheme = useColorScheme();

  return (
    <BlueTabs.Navigator screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: false,
      tabBarStyle: Platform.select({
        ios: {
          position: 'absolute',
        },
        default: {},
      }),
    }}>
      <BlueTabs.Screen name="BlueTabsHome" component={BlueTabsHome} options={{ title: 'Home' }} />
      <BlueTabs.Screen name="BlueTabsExplore" component={BlueTabsExplore} options={{ title: 'Explore' }} />

    </BlueTabs.Navigator>
  );
}

const Stack = createNativeStackNavigator<StackRouteParamList>();
const RedStack = createNativeStackNavigator<RedStackRouteParamList>();
const BlueTabs = createBottomTabNavigator();
const BlueStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="BlueTabsHost" component={BlueTabsHost} options={{
          headerShown: false,
        }} />
        <Stack.Screen name="GreenScreen" component={GreenScreen} options={{
        }} />
        <Stack.Screen name="GreenModal" component={GreenModal} options={{
          presentation: 'modal',
        }} />
        <Stack.Screen name="RedScreenHost" component={RedScreenHost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
