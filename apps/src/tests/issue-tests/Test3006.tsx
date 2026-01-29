import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../../shared/styling/Colors';

type RootTabParamList = {
  First: undefined;
  Second: undefined;
  Third: undefined;
};

type InnerScreenName =
  | 'Inner11' | 'Inner12' | 'Inner13'
  | 'Inner21' | 'Inner22' | 'Inner23'
  | 'Inner31' | 'Inner32' | 'Inner33';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<any>();

type ScreenProps = {
  current: InnerScreenName;
  next?: InnerScreenName;
};

const Screen = ({ current, next, navigation }: ScreenProps & { navigation: any }) => (
  <View style={styles.container}>
    <Text>{`${current} Screen`}</Text>
    {next && (
      <Button title="Forward" onPress={() => navigation.navigate(next)} />
    )}
  </View>
);

const createScreen = (current: InnerScreenName, next?: InnerScreenName) =>
  function ScreenWrapper({ navigation }: { navigation: any }) {
    return <Screen current={current} next={next} navigation={navigation} />;
  };

const screenGroups: Record<string, { screens: InnerScreenName[]; headerColor: string; contentColor: string }> = {
  First: {
    screens: ['Inner11', 'Inner12', 'Inner13'],
    headerColor: Colors.BlueLight80,
    contentColor: Colors.BlueLight40,
  },
  Second: {
    screens: ['Inner21', 'Inner22', 'Inner23'],
    headerColor: Colors.GreenLight80,
    contentColor: Colors.GreenLight40,
  },
  Third: {
    screens: ['Inner31', 'Inner32', 'Inner33'],
    headerColor: Colors.YellowLight80,
    contentColor: Colors.YellowLight40,
  },
};

const createStack = (groupKey: keyof typeof screenGroups) => {
  const { screens, headerColor, contentColor } = screenGroups[groupKey];

  return () => (
    <Stack.Navigator
      screenOptions={{
        title: groupKey,
        headerStyle: { backgroundColor: headerColor },
        contentStyle: { backgroundColor: contentColor },
      }}
    >
      {screens.map((screen, index) => {
        const nextScreen = screens[index + 1];
        return (
          <Stack.Screen
            key={screen}
            name={screen}
            component={createScreen(screen, nextScreen)}
          />
        );
      })}
    </Stack.Navigator>
  );
};

const tabOptions = {
  tabBarIcon: () => null,
};

const RootTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="First" component={createStack('First')} options={tabOptions} />
    <Tab.Screen name="Second" component={createStack('Second')} options={tabOptions} />
    <Tab.Screen name="Third" component={createStack('Third')} options={tabOptions} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
