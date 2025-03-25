import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet, Pressable, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';


const Stack = createNativeStackNavigator();

const titleLength = 24;

const baseTitle = 'Ab';
const baseTitle2 = 'Ac';

// Toggle these two for short / long string on first screen
// const homeScreenTitle = "Screen";
const homeScreenTitle = baseTitle.repeat(titleLength);

// Toggle these two for short / long string on second screen
// const secondScreenTitle = "Details";
const secondScreenTitle = baseTitle2.repeat(titleLength);

const searchBarScreenTitle = 'SearchBarScreen';

/**
  * Small left element
  */
function HeaderLeftSmall(): React.JSX.Element {
  return (
    <View style={{ width: 40, height: 20, backgroundColor: 'goldenrod' }} />
  );
}

function HeaderRightTwoRects(): React.JSX.Element {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ width: 20, height: 20, backgroundColor: 'lightgreen', opacity: 0.8 }} />
      <View style={{ width: 60, height: 20, backgroundColor: 'lightblue', opacity: 0.8 }} />
    </View>
  );
}

function TitleTextComponent({ length }: { length?: number }): React.JSX.Element {
  return (
    <View style={{}}>
      <Text numberOfLines={1} style={{}}>{baseTitle.repeat(length ?? titleLength)}</Text>
    </View>
  );
}

const headerOptions = {
  headerLeft: () => <HeaderRightTwoRects />,
  // headerRight: () => (
  //   <View style={{ width: 120, height: 20, backgroundColor: 'goldenrod', opacity: 0.4, flexDirection: 'row' }}>
  //   </View>
  // ),
  // headerRight: () => {
  //   return (
  //     <View style={{ flexDirection: 'row' }}>
  //       <View style={{ width: 60, height: 20, backgroundColor: 'lightblue', opacity: 0.4 }} />
  //       <View style={{ width: 60, height: 20, backgroundColor: 'lightgreen', opacity: 0.4 }} />
  //     </View>
  //   );
  // },
  // headerRight: () => (
  //   <View style={{}}>
  //     <View style={{ width: 80, height: 20, backgroundColor: 'goldenrod', opacity: 0.4 }}>
  //     </View>
  //   </View>
  // ),
  // headerTitle: baseTitle.repeat(20),
  // headerTitle: () => (
  //   <Text numberOfLines={1} style={{ flexShrink: 1 }}>{baseTitle.repeat(5)}</Text>
  // ),
  headerRight: () => <HeaderRightTwoRects />,
  headerTitle: () => <TitleTextComponent />,
  //title: baseTitle.repeat(titleLength),
  headerTitleAlign: 'left',
  statusBarTranslucent: true
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ statusBarTranslucent: false }}>
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
          }}
        />
        <Stack.Screen
          name={searchBarScreenTitle}
          component={DetailsScreen}
          options={{
            ...headerOptions,
            headerSearchBarOptions: {
              placeholder: 'placeholder',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Screen({ navigation }: any) {
  console.log("==mylog== Screen");

  // Just a reference contents, mimicking the setup with header config & subviews
  // setTimeout(() =>
  //   navigation.setOptions({
  //     headerLeft: () => <HeaderLeftSmall />
  //   }), 500
  // );

  // setTimeout(() =>
  //   navigation.setOptions({
  //     headerRight: () => <HeaderRightTwoRects />
  //   }), 700
  // );

  return (
    <View>
      <View style={[{ backgroundColor: 'pink', flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginVertical: 10 }]}>
        <View collapsable={false} style={[styles.headerSubviewStyle]}>
          <View style={{ backgroundColor: 'lightgreen', width: 50, height: 20, opacity: 0.6 }} />
        </View>
        <View style={[{ backgroundColor: 'goldenrod', flexShrink: 1 }, styles.headerSubviewStyle]}>
          <Text numberOfLines={1} style={{}}>{baseTitle.repeat(5)}</Text>
        </View>
        <View collapsable={false} style={{}}>
          <View style={[{ backgroundColor: 'lightblue', width: 80, height: 20, opacity: 0.6 }, styles.headerSubviewStyle]} />
        </View>
      </View>
      <Button onPress={() => navigation.navigate(secondScreenTitle)} title="Nav Forward" />
      <Button onPress={() => navigation.navigate(searchBarScreenTitle)} title={searchBarScreenTitle} />
    </View>
  );
}

function DetailsScreen({ navigation }: any) {
  console.log("==mylog== DetailsScreen");
  let counter = React.useRef(0);

  // setTimeout(() =>
  //   navigation.setOptions({
  //     headerLeft: () => <HeaderLeftSmall />
  //   }), 5000
  // );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{fontWeight: 'bold'}}>Foo</Text>,
    });
  }, [navigation]);


  // setTimeout(() =>
  //   navigation.setOptions({
  //     headerRight: () => <HeaderRightTwoRects />
  //   }), 700
  // );

  return (
    <View style={{ ...styles.container, backgroundColor: 'beige' }}>
      <Pressable
        onPressIn={() => {
          counter.current += 1;
          console.log(`[${counter.current}] Details: onPressIn`);
        }}
        onPress={() => {
          console.log(`[${counter.current}] Details: onPress`);
        }}
        onPressOut={() => {
          console.log(`[${counter.current}] Details: onPressOut`);
        }}
        style={({ pressed }) => [
          styles.pressable,
          pressed && { backgroundColor: 'goldenrod' },
        ]}>
        <Text>Press me</Text>
      </Pressable>
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

