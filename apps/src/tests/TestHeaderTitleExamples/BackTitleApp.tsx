import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const homeScreenTitle = 'Screen';
const secondScreenTitle = 'Details';

// const titleComponentContent = homeScreenTitle;
const titleComponentContent = 'ab'.repeat(20);

const HeaderLeftSmall = () => (
  <View style={{ width: 40, height: 20, backgroundColor: 'goldenrod' }} />
);

const HeaderRightTwoRects = () => (
  <View style={{ flexDirection: 'row' }}>
    <View
      style={{
        width: 20,
        height: 20,
        backgroundColor: 'lightgreen',
        opacity: 0.8,
      }}
    />
    <View
      style={{
        width: 60,
        height: 20,
        backgroundColor: 'lightblue',
        opacity: 0.8,
      }}
    />
  </View>
);

const TitleTextComponent = () => (
  <Text numberOfLines={1}>{titleComponentContent}</Text>
);

const CenterFixedWidthComponent = () => (
  <View style={{ width: 40, height: 40, backgroundColor: 'red' }} />
);

const headerOptions = {
  headerLeft: () => <HeaderLeftSmall />,
  headerRight: () => <HeaderRightTwoRects />,
  headerTitle: () => <CenterFixedWidthComponent />,
};

function App() {
  return (
    <Stack.Navigator screenOptions={{ statusBarTranslucent: true }}>
      <Stack.Screen
        name={homeScreenTitle}
        component={Screen}
        options={headerOptions}
      />
      <Stack.Screen
        name={secondScreenTitle}
        component={DetailsScreen}
        options={{
          ...headerOptions,
          headerBackVisible: true,
          headerBackTitle: 'Back to Home',
        }}
      />
    </Stack.Navigator>
  );
}

function Screen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Button
        onPress={() => navigation.navigate(secondScreenTitle)}
        title="Nav Forward"
      />
    </View>
  );
}

function DetailsScreen({ navigation }: any) {
  return (
    <View style={{ ...styles.container, backgroundColor: 'beige' }}>
      <Button title="GoBack" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'red',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  headerSubviewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;