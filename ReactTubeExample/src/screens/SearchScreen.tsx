import React, { useLayoutEffect, useState } from 'react';
import useSearchScreen from '../hooks/useSearchScreen';
import { Text, View, Button } from 'react-native';
import GridView from '../components/GridView';
import useGridColumnsPreferred from '../hooks/home/useGridColumnsPreferred';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RootStackParamList } from '../navigation/RootStackNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

export default function SearchScreen() {
  const { search, searchResult, fetchMore } = useSearchScreen();
  const [searchText, setSearchText] = useState('');

  const columns = useGridColumnsPreferred();

  // console.log(JSON.stringify(searchResult));

  console.log(searchResult.length);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const performSearch = (text?: string) => {
    console.log('Search: ', searchText);
    search(text ?? searchText).catch(console.warn);
    if (text) {
      setSearchText(text);
    }
  };

  console.log('Searchtext: ', searchText);

  useLayoutEffect(() => {
    navigation.setOptions({
      contentStyle: {
        backgroundColor: 'red',
      },
      headerStyle: {
        backgroundColor: 'red',
      },
      headerTitle: 'Serzch',
      searchBar: {
        placeholder: 'Searchyyyyk',
        background: () => {
          return (
            <View style={{ backgroundColor: 'red', width: 64, height: 64 }} />
          );
        },
        onChangeText: event => setSearchText(event.nativeEvent.text),
        onBlur: () => performSearch(),
        onSearchButtonPress: event => performSearch(event.nativeEvent.text),
        onClose: () => performSearch(),
        hideWhenScrolling: false,
      },
    });
  }, [navigation]);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={{ color: 'white', fontSize: 32 }}>This is a text!</Text>
        <Text style={{ color: 'white', fontSize: 32 }}>This is a text!</Text>
        <Text style={{ color: 'white', fontSize: 32 }}>This is a text!</Text>
        <Text style={{ color: 'white', fontSize: 32 }}>This is a text!</Text>
        <Button title="Helo" />

        <GridView
          columns={columns}
          shelfItem={searchResult}
          onEndReached={() => fetchMore().catch(console.warn)}
        />
      </SafeAreaView>
    </>
  );
}
