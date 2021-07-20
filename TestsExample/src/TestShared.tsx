import * as React from 'react';
import {
  Button,
  View,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createNativeStackNavigator();

const NestedStack = createStackNavigator();

// Nested stack to check if transition progress values are passed properly through non native-stack navigators
function NestedFirst() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="NestedFirst" component={First}/>
    </NestedStack.Navigator>
  )
}

type SimpleStackParams = {
  First: undefined;
  Second: undefined;
};

type NativeIDs = {
  viewNativeID: string;
  imageNativeID: string;
  textNativeID: string;
  navigation: NativeStackNavigationProp<SimpleStackParams, 'First'>;
  imageUri: string;
};

function CarElement({viewNativeID, imageNativeID, textNativeID, navigation, imageUri}: NativeIDs) {
  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('Second')} 
      style={{flexDirection: 'row', backgroundColor: 'yellow', width: '100%', height: 120, borderBottomColor: 'powderblue', borderBottomWidth: 3}} 
      nativeID={viewNativeID}>
      <Image 
        source={{uri: imageUri}}
        style={{width: 200, height: 120}} 
        nativeID={imageNativeID}
        resizeMode="cover" />
      <Text nativeID={textNativeID} style={{fontSize: 20, color: 'red'}}>Nissan GTR</Text>
    </TouchableOpacity>
  )
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'First'>;
}) {

  const sharedElements = [
    {fromID: 'view3000', toID: 'view3000Dest'},
    {fromID: 'ImageGTR0', toID: 'ImageGTRDest'},
    {fromID: 'TextGTR0', toID: 'TextGTRDest'},
  ];

  React.useEffect(() => {
    navigation.dangerouslyGetParent()?.setOptions({
      sharedElements,
    });
  }, [navigation]);

  return (
    <ScrollView style={{flex: 1}}>
      <CarElement viewNativeID={sharedElements[0].fromID} imageNativeID={sharedElements[1].fromID} textNativeID={sharedElements[2].fromID} navigation={navigation} 
        imageUri={'https://c8.alamy.com/comp/2AD68EG/white-nissan-gtr-on-gravel-road-with-windmills-in-background-2AD68EG.jpg'}/>
      <CarElement viewNativeID={"view3001"} imageNativeID={"ImageGTR1"} textNativeID={"TextGTR1"}/>
      <CarElement viewNativeID={"view3002"} imageNativeID={"ImageGTR2"} textNativeID={"TextGTR2"}/>
      <CarElement viewNativeID={"view3003"} imageNativeID={"ImageGTR3"} textNativeID={"TextGTR3"}/>
      <CarElement viewNativeID={"view3004"} imageNativeID={"ImageGTR4"} textNativeID={"TextGTR4"}/>
    </ScrollView>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'Second'>;
}) {
  const sharedElements = [
    {fromID: 'view3000', toID: 'view3000Dest'},
    {fromID: 'ImageGTR0', toID: 'ImageGTRDest'},
    {fromID: 'TextGTR0', toID: 'TextGTRDest'},
  ];

  React.useEffect(() => {
    navigation.setOptions({
      sharedElements,
    });
  }, [navigation]);

  return (
    <View style={{flex: 1}}>
      <View style={{width: '100%', height: 290, backgroundColor: 'blue'}} nativeID={sharedElements[0].toID}>
        <Image resizeMode="stretch" source={{uri: 'https://c8.alamy.com/comp/2AD68EG/white-nissan-gtr-on-gravel-road-with-windmills-in-background-2AD68EG.jpg'}}  style={{width: 375, height: 250}} nativeID={sharedElements[1].toID}/>
        <Text style={{fontSize: 30, color: 'red', fontWeight: '900'}} nativeID={sharedElements[2].toID}>Nissan GTR!</Text>
      </View>
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.push('Second')}
      />
    </View>
  );
};

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackAnimation: 'default',
          // stackPresentation: 'transparentModal',
        }}>
        <Stack.Screen name="First" component={NestedFirst} />
        <Stack.Screen name="Second" component={Second} options={{headerShown: false, sharedElements: [
          {fromID: 'view3000', toID: 'view3000Dest'},
          {fromID: 'ImageGTR', toID: 'ImageGTRDest'},
          {fromID: 'TextGTR', toID: 'TextGTRDest'},
          ]}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
