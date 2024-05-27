import * as React from 'react';
import {
  TouchableOpacity,
  GestureHandlerRootView,
  TextInput,
} from 'react-native-gesture-handler';
import {
  Button,
  StyleSheet,
  View,
  Text,
  ScrollView,
  NativeSyntheticEvent,
  // TextInput,
} from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';
import * as jotai from 'jotai';
import useFocusEffectIgnoreSheet from './hooks/useFocusEffectIgnoreSheet';
import { NavigationProp, useNavigation } from '@react-navigation/core';

type NavProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

type AllowedDetentsType = NativeStackNavigationOptions['sheetAllowedDetents'];

/// Sheet options
// const allowedDetentsAtom = jotai.atom<AllowedDetentsType>([
//   0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
// ]);
// const largestUndimmedDetentAtom = jotai.atom<number>(3);

const allowedDetentsAtom = jotai.atom<AllowedDetentsType>([0.4, 0.6, 0.9]);
// const allowedDetentsAtom =
//   jotai.atom<NativeStackNavigationOptions['sheetAllowedDetents']>(
//     'fitToContents',
//   );
const largestUndimmedDetentAtom = jotai.atom<number>(-1);

// const allowedDetentsAtom = jotai.atom<number[]>([0.7]);
// const largestUndimmedDetentAtom = jotai.atom<number>(-1);

const grabberVisibleAtom = jotai.atom(false);
const cornerRadiusAtom = jotai.atom(24);
const expandsWhenScrolledToEdgeAtom = jotai.atom(true);

const sheetOptionsAtom = jotai.atom(get => ({
  sheetAllowedDetents: get(allowedDetentsAtom),
  sheetLargestUndimmedDetent: get(largestUndimmedDetentAtom),
  sheetGrabberVisible: get(grabberVisibleAtom),
  sheetCornerRadius: get(cornerRadiusAtom),
  sheetExpandsWhenScrolledToEdge: get(expandsWhenScrolledToEdgeAtom),
}));

const selectedDetentIndexAtom = jotai.atom(0);

const isAdditionalContentVisibleAtom = jotai.atom(false);

const Stack = createNativeStackNavigator();

function Footer() {
  const setAdditionalContentVisible = jotai.useSetAtom(
    isAdditionalContentVisibleAtom,
  );

  return (
    <View
      style={{
        backgroundColor: 'goldenrod',
        padding: 20,
        borderColor: 'darkblue',
        borderWidth: 1,
      }}>
      <Text>SomeContent</Text>
      <Button
        title="Click me"
        onPress={() => {
          setAdditionalContentVisible(old => !old);
        }}
      />
      <Text>SomeContent</Text>
      <Text>SomeContent</Text>
      <Text>SomeContent</Text>
      <Text>SomeContent</Text>
    </View>
  );
}

export default function App(): JSX.Element {
  const sheetOptions = jotai.useAtomValue(sheetOptionsAtom);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            // headerRight: () => <View style={styles.headerView} />,
            headerTitleStyle: {
              color: 'cyan',
            },
            headerShown: true,
            headerHideBackButton: false,
          }}>
          <Stack.Screen name="First" component={Home} />
          <Stack.Screen
            name="Second"
            component={Second}
            options={{
              fullScreenSwipeEnabled: true,
            }}
          />
          <Stack.Screen
            name="SheetScreen"
            component={SheetScreen}
            options={{
              headerShown: false,
              stackPresentation: 'formSheet',
              sheetElevation: 24,
              screenStyle: {
                backgroundColor: 'firebrick',
              },
              // footerComponent: Footer(),
              onSheetDetentChanged: (e: NativeSyntheticEvent<{ index: number }>) => {
                console.log(`onSheetDetentChanged in App with index ${e.nativeEvent.index}`)
              },
              ...sheetOptions,
            }}
          />
          <Stack.Screen
            name="SheetScreenWithScrollView"
            component={SheetScreenWithScrollView}
            options={{
              headerShown: false,
              stackPresentation: 'formSheet',
              ...sheetOptions,
            }}
          />
          <Stack.Screen
            name="Third"
            component={Third}
            options={{
              // stackPresentation: 'modal',
              fullScreenSwipeEnabled: true,
            }}
          />
          <Stack.Screen
            name="ModalScreen"
            component={ModalScreen}
            options={{
              headerShown: false,
              stackPresentation: 'modal',
              ...sheetOptions,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function Home({ navigation }: NavProp) {
  return (
    <>
      <Button
        title="Tap me for the second screen"
        onPress={() => navigation.navigate('Second')}
      />
      <Button
        title="Tap me for the second screen"
        onPress={() => navigation.navigate('Second')}
      />
      <Button
        title="Tap me for the second screen"
        onPress={() => navigation.navigate('Second')}
      />
    </>
  );
}

function Second({ navigation }: NavProp) {
  const navigateToFirstCallback = () => {
    console.log('Navigate to first callback called');
    navigation.navigate('First');
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Button
        title="Open the sheet"
        onPress={() => navigation.navigate('SheetScreen')}
      />
      <Button
        title="Open the sheet with ScrollView"
        onPress={() => navigation.navigate('SheetScreenWithScrollView')}
      />
      <Button
        title="Open the Third screen"
        onPress={() => navigation.navigate('Third')}
      />
      <Button
        title="Open ModalScreen"
        onPress={() => navigation.navigate('ModalScreen')}
      />
      <Button
        title="Go back to first screen"
        onPress={navigateToFirstCallback}
      />
      <TouchableOpacity
        style={{ backgroundColor: 'goldenrod' }}
        onPress={() => console.log('GH Button clicked')}>
        <Text>GH BUTTON</Text>
      </TouchableOpacity>
    </View>
  );
}

function Third({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [bgColor, setBgColor] = React.useState('firebrick');

  const navigateToSecondCallback = () => {
    console.log('Navigate Back');
    navigation.goBack();
    navigation.navigate('Second');
  };

  const navState = navigation.getState();
  const routeInd = navState.index;
  const routeName = navState.routes[navState.index].name;

  console.log(`THIRD routeName: ${routeName}, routeInd: ${routeInd}`);

  useFocusEffectIgnoreSheet(
    React.useCallback(() => {
      console.log('ACTUAL_CALLBACK called');
      const handle = setInterval(() => {
        console.log('SET_INTERVAL_CALLBACK called');
        setBgColor(value => {
          return value === 'firebrick' ? 'green' : 'firebrick';
        });
      }, 1500);

      return () => {
        console.log('ACTUAL_CALLBACK cleared');
        clearInterval(handle);
      };
    }, [navigation]),
    'SheetScreen',
  );

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

  console.log('Third RENDERED');
  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
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

function CommonSheetContent(): React.JSX.Element {
  const navigation = useNavigation();

  const [radius, setRadius] = jotai.useAtom(cornerRadiusAtom);
  const [detents, setDetents] = jotai.useAtom(allowedDetentsAtom);
  const [largestUndimmedDetent, setLargestUndimmedDetent] = jotai.useAtom(
    largestUndimmedDetentAtom,
  );
  const [isGrabberVisible, setIsGrabberVisible] =
    jotai.useAtom(grabberVisibleAtom);
  const [shouldExpand, setShouldExpand] = jotai.useAtom(
    expandsWhenScrolledToEdgeAtom,
  );
  const [selectedDetentIndex, setSelectedDetentIndex] = jotai.useAtom(
    selectedDetentIndexAtom,
  );
  const isAdditionalContentVisible = jotai.useAtomValue(
    isAdditionalContentVisibleAtom,
  );

  const ref = React.useRef(null);

  function nextDetentLevel(currentDetent: number): number {
    return 0;
  }

  return (
    <View style={[{ backgroundColor: 'lightgreen' }]}>
      <View style={{ paddingTop: 10 }}>
        <TextInput
          style={{
            backgroundColor: 'lightblue',
            paddingHorizontal: 5,
            margin: 5,
            borderRadius: 5,
          }}
          placeholder="123"
          inputMode="numeric"
          ref={ref}
        />
        <Button
          title="Tap me for the first screen"
          onPress={() => navigation.navigate('First')}
        />
        <Button
          title="Tap me for the second screen"
          onPress={() => navigation.navigate('Second')}
        />
        <Button
          title="Tap me for the third screen / blur"
          onPress={() => {
            navigation.navigate('Third');
          }}
        />
        <Button
          title="Change the corner radius"
          onPress={() => {
            const newRadius = radius >= 150 ? -1.0 : radius + 50;
            setRadius(newRadius);
            navigation.setOptions({
              sheetCornerRadius: newRadius,
            });
          }}
        />
        <Text>radius: {radius}</Text>
        <Button
          title="Change detent level"
          onPress={() => {
            const newDetentLevel = nextDetentLevel(
              detents[selectedDetentIndex],
            );
            setSelectedDetentIndex(newDetentLevel);
            // navigation.setOptions({
            //   sheetAllowedDetents: newDetentLevel,
            // });
          }}
        />
        <Text>Allowed detents: {detents}</Text>
        <Button
          title="Change largest undimmed detent"
          onPress={() => {
            const newDetentLevel = nextDetentLevel(largestUndimmedDetent);
            setLargestUndimmedDetent(newDetentLevel);
            navigation.setOptions({
              sheetLargestUndimmedDetent: newDetentLevel,
            });
          }}
        />
        <Text>largestUndimmedDetent: {largestUndimmedDetent}</Text>
        <Button
          title="Toggle sheetExpandsWhenScrolledToEdge"
          onPress={() => {
            setShouldExpand(!shouldExpand);
            navigation.setOptions({
              sheetExpandsWhenScrolledToEdge: !shouldExpand,
            });
          }}
        />
        <Text>
          sheetExpandsWhenScrolledToEdge: {shouldExpand ? 'true' : 'false'}
        </Text>
        <Button
          title="Toggle grabber visibility"
          onPress={() => {
            setIsGrabberVisible(!isGrabberVisible);
            navigation.setOptions({
              sheetGrabberVisible: !isGrabberVisible,
            });
          }}
        />
      </View>
      <TouchableOpacity
        style={{ backgroundColor: 'goldenrod' }}
        onPress={() => console.log('GH Button clicked')}>
        <Text>GH BUTTON</Text>
      </TouchableOpacity>
      {isAdditionalContentVisible && (
        <View style={{ backgroundColor: 'pink' }}>
          <Text>Additional content</Text>
        </View>
      )}
    </View>
  );
}

function ModalScreen() {
  return <CommonSheetContent />;
}

function SheetScreen() {
  return <CommonSheetContent />;
}

function SheetScreenWithScrollView() {
  const [additionalContentVisible, setAdditionalContentVisible] =
    React.useState(false);

  const svRef = React.useRef<ScrollView | null>(null);
  const contentRef = React.useRef<View | null>(null);

  return (
    <ScrollView ref={svRef} nestedScrollEnabled={true} scrollEnabled>
      <View ref={contentRef}>
        <CommonSheetContent />
        <Button
          title="Toggle content"
          onPress={() => setAdditionalContentVisible(old => !old)}
        />
        {additionalContentVisible &&
          [...Array(3).keys()].map(val => (
            <Text key={`${val}`}>Some component {val}</Text>
          ))}
      </View>
    </ScrollView>
  );
  // return (
  //   <ScrollView nestedScrollEnabled={true}>
  //     <SheetScreen navigation={navigation} />
  //     {[...Array(99).keys()].map(val => (
  //       <Text key={`${val}`}>Some component {val}</Text>
  //     ))}
  //   </ScrollView>
  // );
}

function SheetScreenWithTextInput({ navigation }: NavProp) {
  const [textValue, setTextValue] = React.useState('text input');

  return (
    <View style={styles.centeredView}>
      <TextInput
        style={[styles.bordered, styles.keyboardTriggerTextInput]}
        value={textValue}
        onChangeText={text => setTextValue(text)}
      />
      <CommonSheetContent />
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    height: 20,
    width: 20,
    // backgroundColor: 'red',
  },
  containerView: {
    flex: 1,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'firebrick',
    // flex: 1,
  },
  absoluteFillNoBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    // bottom: 0,
    backgroundColor: 'firebrick',
  },
  absoluteFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'teal',
  },
  bordered: {
    borderColor: 'black',
    borderWidth: 2,
  },
  keyboardTriggerTextInput: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    marginTop: 10,
  },
});
