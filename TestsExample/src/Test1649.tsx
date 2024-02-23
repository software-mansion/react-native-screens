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
  // TextInput,
} from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';
import * as jotai from 'jotai';

type NavProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

/// Sheet options
// const allowedDetentsAtom = jotai.atom<number[]>([
//   0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
// ]);
// const largestUndimmedDetentAtom = jotai.atom<number>(3);

// const allowedDetentsAtom = jotai.atom<number[]>([0.4, 0.9]);
const allowedDetentsAtom =
  jotai.atom<NativeStackNavigationOptions['sheetAllowedDetents']>(
    'fitToContents',
  );
const largestUndimmedDetentAtom = jotai.atom<number>(0);

// const allowedDetentsAtom = jotai.atom<number[]>([0.7]);
// const largestUndimmedDetentAtom = jotai.atom<number>(-1);

const grabberVisibleAtom = jotai.atom(true);
const cornerRadiusAtom = jotai.atom(24);
const expandsWhenScrolledToEdgeAtom = jotai.atom(true);

const sheetOptionsAtom = jotai.atom(get => ({
  sheetAllowedDetents: get(allowedDetentsAtom),
  sheetLargestUndimmedDetent: get(largestUndimmedDetentAtom),
  sheetGrabberVisible: get(grabberVisibleAtom),
  sheetCornerRadius: get(cornerRadiusAtom),
  sheetExpandsWhenScrolledToEdge: get(expandsWhenScrolledToEdgeAtom),
}));

const Stack = createNativeStackNavigator();

function Footer() {
  return (
    <View style={{ backgroundColor: 'red' }}>
      <Text>SomeContent</Text>
      <Text>SomeContent</Text>
      <Text>SomeContent</Text>
      <Text>SomeContent</Text>
      <Text>SomeContent</Text>
    </View>
  );
}

export default function App(): JSX.Element {
  const sheetOptions = jotai.useAtomValue(sheetOptionsAtom);

  // const [sheetOptions, _] = React.useState<NativeStackNavigationOptions>({
  //   stackPresentation: 'formSheet',
  //   sheetAllowedDetents: [0.45, 0.9],
  //   sheetLargestUndimmedDetent: 0,
  //   sheetGrabberVisible: false,
  //   sheetCornerRadius: 20,
  //   sheetExpandsWhenScrolledToEdge: false,
  // });

  // return <RawScreenHome />;

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
                flex: undefined,
              },
              // footerComponent: Footer,
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
        title="Go back to first screen"
        onPress={navigateToFirstCallback}
      />
      <TouchableOpacity onPress={() => console.log('GH Button clicked')}>
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
  const navigateToSecondCallback = () => {
    console.log('Navigate Back');
    navigation.goBack();
    navigation.navigate('Second');
  };

  return (
    <View>
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

function SheetScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [radius, setRadius] = React.useState(-1);
  const [detent, setDetent] = React.useState<SheetDetentTypes>('all');
  const [largestUndimmedDetent, sheetLargestUndimmedDetent] =
    React.useState<SheetDetentTypes>('all');
  const [isGrabberVisible, setIsGrabberVisible] = React.useState(false);
  const [shouldExpand, setShouldExpand] = React.useState(true);

  function nextDetentLevel(detent: SheetDetent): SheetDetent {
    if (Array.isArray(detent)) {
      return 'all';
    } else if (detent === 'all') {
      return 'medium';
    } else if (detent === 'medium') {
      return 'large';
    } else if (detent === 'large') {
      return initialAllowedDetentsArray;
    } else {
      return 'all';
    }
  }

  const ref = React.useRef(null);

  return (
    <View style={[{ backgroundColor: 'green' }]}>
      <View style={{ paddingTop: 10 }}>
        <TextInput
          style={{
            backgroundColor: 'lightblue',
            paddingHorizontal: 5,
            margin: 5,
            borderRadius: 5,
          }}
          placeholder="hello"
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
            // navigation.goBack();
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
            const newDetentLevel = nextDetentLevel(detent);
            setDetent(newDetentLevel);
            navigation.setOptions({
              sheetAllowedDetents: newDetentLevel,
            });
          }}
        />
        <Text>detent: {detent}</Text>
        <Button
          title="Change largest undimmed detent"
          onPress={() => {
            const newDetentLevel = nextDetentLevel(largestUndimmedDetent);
            sheetLargestUndimmedDetent(newDetentLevel);
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
    </View>
  );
}

function SheetScreenWithScrollView({ navigation }: NavProp) {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <SheetScreen navigation={navigation} />
      {[...Array(99).keys()].map(val => (
        <Text key={`${val}`}>Some component {val}</Text>
      ))}
    </ScrollView>
  );
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
      <SheetScreen navigation={navigation} />
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
