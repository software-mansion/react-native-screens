// import React from 'react';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {NavigationContainer} from '@react-navigation/native';
// import {I18nManager} from 'react-native';
// import Chapter from './src/Chapter';
// import chapters from './src/chapters';
// import HeaderDemo from './src/HeaderDemo';
// import {WHITE} from './src/colors';

// const Stack = createNativeStackNavigator();

// const App = () => (
//   <NavigationContainer>
//     <Stack.Navigator
//       screenOptions={{
//         headerHideBackButton: true,
//         direction: I18nManager.isRTL ? 'rtl' : 'ltr',
//       }}>
//       <Stack.Screen
//         name="Chapter"
//         options={{
//           title: 'Fabric Example',
//           headerShown: false,
//         }}
//         initialParams={{
//           index: 0,
//           chapters: chapters,
//           chapterRoute: 'Chapter',
//           afterChapterRoute: 'HeaderDemo',
//         }}
//         component={Chapter}
//       />
//       <Stack.Screen
//         name="HeaderDemo"
//         component={HeaderDemo}
//         options={{title: 'Header Demo', headerTintColor: WHITE}}
//       />
//     </Stack.Navigator>
//   </NavigationContainer>
// );

// export default App;

import React from 'react';
import {ScrollView, View} from 'react-native';
import {ScreenStack, Screen} from 'react-native-screens';

const App = () => (
  <ScreenStack style={{flex: 1}}>
    {/* <Screen style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'blue'}} />
    </Screen> */}
    <Screen
      style={{flex: 1}}
      // onHeaderHeightChange={e => {
      //   const headerHeight = e.nativeEvent.headerHeight;
      //   console.log(headerHeight);
      //   // if (cachedAnimatedHeaderHeight.current !== headerHeight) {
      //   // Currently, we're setting value by Animated#setValue, because we want to cache animated value.
      //   // Also, in React Native 0.72 there was a bug on Fabric causing a large delay between the screen transition,
      //   // which should not occur.
      //   // TODO: Check if it's possible to replace animated#setValue to Animated#event.
      //   // animatedHeaderHeight.setValue(headerHeight);
      //   // cachedAnimatedHeaderHeight.current = headerHeight;
      //   // }
      // }}
      >
      {/* <ScrollView contentInsetAdjustmentBehavior="automatic"> */}
        <View
          style={{ width: 50, height: 50, backgroundColor: 'blue'}}
        />
        <View
          style={{ width: 50, height: 50, backgroundColor: 'red'}}
        />
        <View
          style={{ width: 50, height: 50, backgroundColor: 'red'}}
        />
        <View
          style={{ width: 50, height: 50, backgroundColor: 'red'}}
        />
      {/* </ScrollView> */}
    </Screen>
  </ScreenStack>
);

export default App;
