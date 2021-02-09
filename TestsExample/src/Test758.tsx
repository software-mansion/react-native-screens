import * as React from 'react';
import { Button, ScrollView, Text, StyleSheet } from 'react-native';
import {NavigationContainer, NavigationProp, ParamListBase} from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { SearchBar } from 'react-native-screens';

const AppStack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerLargeTitle: true,
          headerTranslucent: true,
        }}>
        <AppStack.Screen name="First" component={First} />
        <AppStack.Screen
          name="Second"
          component={Second}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

function First({navigation}: {navigation: NavigationProp<ParamListBase>}) {
  React.useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/display-name
      searchBar: () => 
        <SearchBar
          barTintColor={"powderblue"}
          hideWhenScrolling={true} 
          obscureBackground={true} 
          hideNavigationBar={false} 
          autoCapitalize={'sentences'} 
          placeholder={"Some text"} 
          onChangeText={(e) => setSearch(e.nativeEvent.text)}
          onCancelButtonPress={() => console.warn("Cancel button pressed")}
          onSearchButtonPress={() => console.warn("Search button pressed")}
          onFocus={() => console.warn("onFocus event")}
          onBlur={() => console.warn("onBlur event")}
        />
    })
  }, [navigation]);

  const [search, setSearch] = React.useState('');

  const items = ['Apples', 'Pie', 'Juice', 'Cake', 'Nuggets', 'Some', 'Other', 'Stuff'];

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
      {items
          .filter(a => a.toLowerCase().indexOf(search.toLowerCase()) !== -1)
          .map(a => (
            <Text style={styles.listItem} key={a}>
              {a}
            </Text>
      ))}
    </ScrollView>
  );
}

function Second({navigation}: {navigation: NavigationProp<ParamListBase>}) {
  return (
    <ScrollView>
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 15,
    paddingVertical: 30,
    fontSize: 30,
    backgroundColor: '#fff',
  },
});
