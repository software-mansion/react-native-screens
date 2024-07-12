import { NavigationContainer, RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import React from 'react';
import { Alert, LogBox } from 'react-native';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
  Header,
  Colors,
  DebugInstructions,
} from 'react-native/Libraries/NewAppScreen';

type DataItem = {
  title: string;
  value: number;
};

enum Route {
  FirstScreen = 'FirstScreen',
  SecondScreen = 'SecondScreen',
}

type RootStackParamList = {
  [Route.FirstScreen]: undefined;
  [Route.SecondScreen]: undefined;
};

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

const Stack = createStackNavigator();

const dataset = Array.from<unknown, DataItem>({ length: 100 }, (_, i) => ({
  title: `Title ${i}`,
  value: i,
}));

const Screen: React.FC<{
  route: RouteProp<RootStackParamList, any>;
  navigation: StackNavigationProp<RootStackParamList, any>;
}> = ({ route, navigation }) => {
  for (let i = 0; i < 10 ** 3; i++) {}
  const isSecondScreen = route.name === Route.SecondScreen;

  const handleItemPress = (item: DataItem) => () => {
    if (isSecondScreen) {
      Alert.alert(item.title, item.value.toString());
      return;
    }
    navigation.navigate(Route.SecondScreen);
  };

  const renderItem = (item: DataItem) => (
    <Pressable
      android_ripple={{ color: Colors.light }}
      style={styles.listItemContainer}
      onPress={handleItemPress(item)}>
      <View style={styles.listItemContentWrapper}>
        <Text style={styles.listItemTitle}>{item.title}</Text>
        <Text>{`This is item number ${item.value}`}</Text>
      </View>
    </Pressable>
  );

  return (
    // So in a much more complex scenario, we might have a ScrollView that contains multiple horizontal list
    // I know it's bad to have a FlatList nested in ScrollView, ideally I should use something better
    // However, it seems like having a nested VirtualizeList in ScrollView will cause the transition lag issue
    <ScrollView>
      <FlatList
        data={dataset}
        keyExtractor={item => item.value.toString()}
        renderItem={({ item }) => renderItem(item)}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={!isSecondScreen && Header}
        ListHeaderComponentStyle={styles.headerWrapper}
        ListFooterComponent={!isSecondScreen && DebugInstructions}
        ListFooterComponentStyle={styles.footerWrapper}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
        <Stack.Screen
          name={Route.FirstScreen}
          component={Screen}
          options={{ title: 'Sample List' }}
        />
        <Stack.Screen
          name={Route.SecondScreen}
          component={Screen}
          options={{ title: 'Sample List 2' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    overflow: 'hidden',
  },
  footerWrapper: {
    paddingVertical: 50 / 3,
    paddingHorizontal: 40 / 3,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 50 / 3,
    paddingVertical: 40 / 3,
  },
  image: {
    width: 200 / 3,
    aspectRatio: 1,
    borderRadius: 25 / 3,
    backgroundColor: Colors.primary,
  },
  listItemContentWrapper: {
    flexDirection: 'column',
    paddingHorizontal: 30 / 3,
  },
  listItemTitle: {
    fontWeight: 'bold',
    fontSize: 50 / 3,
  },
  separator: {
    height: 1 / 3,
    flex: 1,
    marginHorizontal: 50 / 3,
    backgroundColor: '#000',
  },
});

export default App;
