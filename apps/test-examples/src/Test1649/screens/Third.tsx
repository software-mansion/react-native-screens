import * as React from 'react';

import { NavProp } from "../types";
import { Button, TextInput, View } from 'react-native';

export default function Third({
  navigation,
}: NavProp) {
  const [bgColor, setBgColor] = React.useState('firebrick');

  const navigateToSecondCallback = () => {
    console.log('Navigate Back');
    // navigation.goBack();
    navigation.navigate('Second');
  };

  // const navState = navigation.getState();
  // const routeInd = navState.index;
  // const routeName = navState.routes[navState.index].name;
  //
  // console.log(`THIRD routeName: ${routeName}, routeInd: ${routeInd}`);

  // useFocusEffectIgnoreSheet(
  //   React.useCallback(() => {
  //     console.log('ACTUAL_CALLBACK called');
  //     const handle = setInterval(() => {
  //       console.log('SET_INTERVAL_CALLBACK called');
  //       setBgColor(value => {
  //         return value === 'firebrick' ? 'green' : 'firebrick';
  //       });
  //     }, 1500);
  //
  //     return () => {
  //       console.log('ACTUAL_CALLBACK cleared');
  //       clearInterval(handle);
  //     };
  //   }, [navigation]),
  //   'SheetScreen',
  // );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const handle = setInterval(() => {
  //       console.log('Hellow from setInterval');
  //       setBgColor(value => {
  //         return value === 'firebrick' ? 'green' : 'firebrick';
  //       });
  //     }, 750);
  //
  //     return () => {
  //       clearInterval(handle);
  //     };
  //   }, []),
  // );

  // React.useEffect(() => {
  //   const handle = setInterval(() => {
  //     console.log('Hellow from setInterval');
  //     setBgColor(value => {
  //       return value === 'firebrick' ? 'green' : 'firebrick';
  //     });
  //   }, 750);
  //
  //   return () => {
  //     clearInterval(handle);
  //   };
  // }, []);

  // console.log('Third RENDERED');
  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <TextInput
        style={{
          backgroundColor: 'lemonchiffon',
          borderRadius: 10,
          paddingHorizontal: 10,
          margin: 10,
        }}
        placeholder="Hello there General Kenobi"
      />
      <Button
        title="Open the sheet"
        onPress={() => navigation.navigate('SheetScreen')}
      />
      <Button
        title="Open the sheet with ScrollView"
        onPress={() => navigation.navigate('SheetScreenWithScrollView')}
      />
      <Button
        title="Go back to second screen"
        onPress={navigateToSecondCallback}
      />
    </View>
  );
}

