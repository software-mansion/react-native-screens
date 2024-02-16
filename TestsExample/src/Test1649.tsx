import * as React from 'react';
import { Button, StyleSheet, View, Text, ScrollView } from 'react-native';
import {
  TouchableOpacity,
  GestureHandlerRootView,
  Gesture,
  TextInput,
} from 'react-native-gesture-handler';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';
import { SheetDetentTypes } from 'react-native-screens';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const [sheetOptions, _] = React.useState<NativeStackNavigationOptions>({
    stackPresentation: 'formSheet',
    sheetAllowedDetents: [0.45, 0.9],
    sheetLargestUndimmedDetent: 0,
    sheetGrabberVisible: false,
    sheetCornerRadius: 20,
    sheetExpandsWhenScrolledToEdge: false,
  });

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
          <Stack.Screen name="First" component={First} />
          <Stack.Screen
            name="Second"
            component={Second}
            options={{
              // stackPresentation: 'modal',
              fullScreenSwipeEnabled: true,
            }}
          />
          <Stack.Screen
            name="SheetScreen"
            component={SheetScreen}
            options={{
              // stackAnimation: 'slide_from_bottom',
              stackAnimation: 'none',
              stackPresentation: 'formSheet',
              ...sheetOptions,
            }}
          />
          <Stack.Screen
            name="SheetScreenWithScrollView"
            component={SheetScreenWithScrollView}
            options={{
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

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <Button
      title="Tap me for the second screen"
      onPress={() => navigation.navigate('Second')}
    />
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
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

  function nextDetentLevel(currDetent: SheetDetentTypes): SheetDetentTypes {
    if (currDetent === 'all') {
      return 'medium';
    } else if (currDetent === 'medium') {
      return 'large';
    } else if (currDetent === 'large') {
      return 'all';
    } else {
      console.warn('Unhandled sheetDetent type');
      return 'all';
    }
  }

  const ref = React.useRef(null);

  return (
    <View style={[styles.containerView, { backgroundColor: 'white' }]}>
      <TextInput
        style={{
          backgroundColor: 'lightblue',
          paddingHorizontal: 5,
          margin: 5,
          borderRadius: 5,
        }}
        value={'hello'}
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
  );
}

function SheetScreenWithScrollView({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <>
      <View style={styles.centeredView}>
        <ScrollView nestedScrollEnabled={true}>
          <SheetScreen navigation={navigation} />
          {[...Array(40).keys()].map(val => (
            <Text key={`${val}`}>Some component {val}</Text>
          ))}
        </ScrollView>
      </View>
    </>
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
  },
});
