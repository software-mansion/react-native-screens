import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { Pressable, Text, View, StyleSheet, Button } from 'react-native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
//
// const styles = StyleSheet.create({
//   button: {
//     width: 42,
//     height: 42,
//     marginHorizontal: 5,
//     padding: 5,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'blue',
//   },
//   buttonsView: {
//     flexDirection: 'row',
//     borderWidth: 1,
//   },
// });
//
// const Stack = createNativeStackNavigator();
//
// function MyStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: true,
//         headerBackButtonDisplayMode: 'minimal',
//       }}>
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Profile" component={HomeScreen} />
//     </Stack.Navigator>
//   );
// }
//
// const HomeScreen = ({ navigation }: any) => {
//   const [secondButtonShown, setSecondButtonShown] = React.useState(true);
//   const [thirdButtonShown, setThirdButtonShown] = React.useState(true);
//   const [showAllButtons, setShowAllButtons] = React.useState(true);
//
//   const headerRight = React.useCallback(() => {
//     return (
//       <>
//         <Pressable style={styles.button} onPress={() => console.log(1)}>
//           <Text>1</Text>
//         </Pressable>
//         {secondButtonShown && (
//           <Pressable style={styles.button} onPress={() => console.log(2)}>
//             <Text>2</Text>
//           </Pressable>
//         )}
//         {thirdButtonShown && (
//           <Pressable style={styles.button} onPress={() => console.log(3)}>
//             <Text>3</Text>
//           </Pressable>
//         )}
//       </>
//     );
//   }, [secondButtonShown, thirdButtonShown]);
//
//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerStyle: { backgroundColor: 'pink' },
//       headerRight: () => (
//         <View
//           style={[styles.buttonsView, !showAllButtons && { display: 'none' }]}>
//           {headerRight()}
//           <Pressable style={styles.button} onPress={() => console.log('D')}>
//             <Text>[D]</Text>
//           </Pressable>
//         </View>
//       ),
//     });
//   }, [navigation, headerRight, showAllButtons]);
//
//   return (
//     <View>
//       <Text>Home Screen</Text>
//       <Button
//         title="Toggle 2nd button"
//         onPress={() => setSecondButtonShown(p => !p)}
//       />
//       <Button
//         title="Toggle 3rd button"
//         onPress={() => setThirdButtonShown(p => !p)}
//       />
//       <Button
//         title="Toggle All Right Buttons"
//         onPress={() => setShowAllButtons(p => !p)}
//       />
//     </View>
//   );
// };
//
// function App() {
//   return (
//     <GestureHandlerRootView>
//       <NavigationContainer>
//         <MyStack />
//       </NavigationContainer>
//     </GestureHandlerRootView>
//   );
// }
//
// export default App;

import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function HeaderItemSmall() {
  return (
    <Text style={styles.headerRight}>Hi</Text>
  );
}

function HeaderItemLarge() {
  return (
    <Text style={styles.headerRight}>Longer Header Right</Text>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerRight: HeaderItemSmall,
        headerTitle: 'Longer Screen Title',
      },
    },
  },
});

const RootNavigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigation />
    </SafeAreaProvider>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  const [isLargeHeaderItem, setLargeHeaderItem] = React.useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title={'Update Header'}
        onPress={() => {
          if (isLargeHeaderItem) {
            navigation.setOptions({
              headerRight: HeaderItemSmall,
            });
          } else {
            navigation.setOptions({
              headerRight: HeaderItemLarge,
            });
          }
          setLargeHeaderItem(old => !old);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    paddingHorizontal: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
