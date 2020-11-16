import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

const Stack1 = createNativeStackNavigator();

const Tabs = createBottomTabNavigator();

const Stack2 = createNativeStackNavigator();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const Screen1 = () => {
  return (
    <FlatList
      contentInsetAdjustmentBehavior={'always'}
      data={data}
      onRefresh={() => {}}
      refreshing={false}
      keyExtractor={(item) => `${item}`}
      renderItem={({item}) => {
        return (
          <View
            style={{
              backgroundColor: item % 2 === 0 ? 'red' : 'green',
              height: 120,
            }}
          />
        );
      }}
      style={{flex: 1}}
    />
  );
};

const Tab1 = () => {
  return (
    <Stack2.Navigator>
      <Stack2.Screen
        name={'Screen 1'}
        component={Screen1}
        options={{
          headerLeft: () => <Text>Left</Text>,
          headerRight: () => <Text>Right</Text>,
          headerLargeTitle: true,
          headerLargeTitleHideShadow: true,
        }}
      />
    </Stack2.Navigator>
  );
};

const Tab2 = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Tab 2</Text>
    </View>
  );
};

const TabsScreen = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name={'Tab 1'} component={Tab1} />
      <Tabs.Screen name={'Tab 2'} component={Tab2} />
    </Tabs.Navigator>
  );
};

const Init = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  );
};

const App = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }, []);
  return (
    <NavigationContainer>
      <Stack1.Navigator>
        {loaded && (
          <Stack1.Screen
            name={'Tabs'}
            component={TabsScreen}
            options={{headerShown: false}}
          />
        )}
        {!loaded && (
          <Stack1.Screen
            name={'Loading'}
            component={Init}
            options={{headerShown: false}}
          />
        )}
      </Stack1.Navigator>
    </NavigationContainer>
  );
};

export default App;
