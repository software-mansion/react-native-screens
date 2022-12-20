/* eslint-disable react/display-name */
import * as React from 'react';
import {Button, StyleSheet, View, Text, ScrollView} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackNavigationOptions
} from 'react-native-screens/native-stack';
import { SheetDetentTypes } from 'react-native-screens';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const initialScreenOptions: NativeStackNavigationOptions = {
    stackPresentation: 'formSheet',
    sheetAllowedDetents: 'all',
    sheetLargestUndimmedDetent: 'medium',
    sheetGrabberVisible: false,
    sheetCornerRadius: -1,
    sheetExpandsWhenScrolledToEdge: true
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // headerRight: () => <View style={styles.headerView} />,
          headerTitleStyle: {
            color: 'cyan',
          },
          headerShown: true,
          headerHideBackButton: false
        }}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} options={{
          fullScreenSwipeEnabled: true,
        }} />
        <Stack.Screen name="SheetScreen" component={SheetScreen} options={{
          ...initialScreenOptions
        }}/>
        <Stack.Screen name="SheetScreenWithScrollView" component={SheetScreenWithScrollView} options={{
          ...initialScreenOptions
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
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
  return (
    <>
      <Button
        title="Open the sheet"
        onPress={() => navigation.navigate("SheetScreen")}
      />
      <Button
        title="Open the sheet with ScrollView"
        onPress={() => navigation.navigate("SheetScreenWithScrollView")}
      />
    </>
  )
}


function SheetScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [radius, setRadius] = React.useState(-1);
  const [detent, setDetent] = React.useState<SheetDetentTypes>('all');
  const [largestUndimmedDetent, sheetLargestUndimmedDetent] = React.useState<SheetDetentTypes>('all');
  const [isGrabberVisible, setIsGrabberVisible] = React.useState(false);
  // navigation
  const [shouldExpand, setShouldExpand] = React.useState(true)

  function nextDetentLevel(currDetent: SheetDetentTypes): SheetDetentTypes {
    if (currDetent === "all") {
      return "medium";
    } else if (currDetent === "medium") {
      return "large";
    } else if (currDetent === "large") {
      return "all";
    } else {
      console.warn("Unhandled sheetDetent type")
      return "all";
    }
  }

  return (
    <View style={styles.centeredView}>
      <Button
      title="Tap me for the first screen"
      onPress={() => navigation.navigate('First')} />
      <Button
      title="Tap me for the second screen"
      onPress={() => navigation.navigate('Second')} />
      <Button
      title="Change the corner radius"
      onPress={() => {
        const newRadius = radius >= 150 ? -1.0 : radius + 50;
        setRadius(newRadius)
        navigation.setOptions({
          sheetCornerRadius: newRadius
        })
      }}/>
      <Text>radius: {radius}</Text>
      <Button 
        title="Change detent level"
        onPress={() => {
          const newDetentLevel = nextDetentLevel(detent);
          setDetent(newDetentLevel)
          navigation.setOptions({
            sheetAllowedDetents: newDetentLevel
          })
        }} 
      />
      <Text>detent: {detent}</Text>
      <Button 
        title="Change largest undimmed detent"
        onPress={() => {
          const newDetentLevel = nextDetentLevel(largestUndimmedDetent);
          sheetLargestUndimmedDetent(newDetentLevel);
          navigation.setOptions({
            sheetLargestUndimmedDetent: newDetentLevel
          })
        }}
      />
      <Text>largestUndimmedDetent: {largestUndimmedDetent}</Text>
      <Button 
        title="Toggle sheetExpandsWhenScrolledToEdge"
        onPress={() => {
          setShouldExpand(!shouldExpand);
          navigation.setOptions({
            sheetExpandsWhenScrolledToEdge: !shouldExpand
          })
        }}
      />
      <Text>sheetExpandsWhenScrolledToEdge: {shouldExpand ? "true" : "false"}</Text>
      <Button 
        title="Toggle grabber visibility"
        onPress={() => {
          setIsGrabberVisible(!isGrabberVisible);
          navigation.setOptions({
            sheetGrabberVisible: !isGrabberVisible
          })
        }}
      />
    </View>
  );
}

function SheetScreenWithScrollView({ navigation }: { navigation: NativeStackNavigationProp<ParamListBase> }) {
  return (
    <>
    <View style={styles.centeredView}>
      <ScrollView>
        <SheetScreen navigation={navigation} />
        {[...Array(40).keys()].map((val) => <Text key={`${val}`}>Some component {val}</Text>)}
      </ScrollView>
    </View>
    </>
  )
}


const styles = StyleSheet.create({
  headerView: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
