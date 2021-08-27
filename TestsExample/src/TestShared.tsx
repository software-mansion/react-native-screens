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

const width = 375;
const height = 250;
const picURI = `https://picsum.photos/id/3/${width}/${height}`;

const sharedElements = [
  {fromID: 'view3000', toID: 'view3000Dest'},
  {fromID: 'ImageRandom0', toID: 'ImageRandomDest'},
  {fromID: 'TextRandom0', toID: 'TextRandomDest'},
];

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
};

function Element({viewNativeID, imageNativeID, textNativeID, navigation}: NativeIDs) {
  const width = 200;
  const height = 120;

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('Second')} 
      style={{flexDirection: 'row', backgroundColor: 'yellow', width: '100%', height: 120}} 
      nativeID={viewNativeID}>
      <Image
        resizeMethod="scale"
        source={{uri: picURI}}
        style={{width, height}} 
        nativeID={imageNativeID}
         />
      <Text nativeID={textNativeID} style={{fontSize: 20, color: 'red'}}>Text</Text>
    </TouchableOpacity>
  )
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'First'>;
}) {

  return (
    <ScrollView style={{flex: 1}}>
      <Element viewNativeID={sharedElements[0].fromID} imageNativeID={sharedElements[1].fromID} textNativeID={sharedElements[2].fromID} navigation={navigation} />
    </ScrollView>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'Second'>;
}) {

  React.useEffect(() => {
    navigation.setOptions({
      sharedElements,
    });
  }, [navigation]);

  return (
    <View style={{flex: 1}}>
      <View style={{width: '100%', height: 290, backgroundColor: 'blue'}} nativeID={sharedElements[0].toID}>
        <Image source={{uri: picURI}}  style={{width, height}} nativeID={sharedElements[1].toID}/>
        <Text style={{fontSize: 20, color: 'red'}} nativeID={sharedElements[2].toID}>Text</Text>
      </View>
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
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
        }}>
        <Stack.Screen name="First" component={NestedFirst} options={{sharedElements}}/>
        <Stack.Screen name="Second" component={Second} options={{headerShown: false, sharedElements}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
