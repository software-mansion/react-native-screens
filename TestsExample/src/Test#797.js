/**
 * Test case for this Issue https://github.com/software-mansion/react-native-screens/issues/797
 * A bug in Android 
 * Tested on: Android version 9
 * Description: when user pop the screen Images inside screen first hide before pop transition
 */

/**
 * How to reproduce:  
 * The issue only occur when it's FastImage and user manually pop the screen by clicking on the button
 * but when clicking of the back button inside the header every thing is working normally
 */
import React from 'react'
import { View, Text, Button } from "react-native"
import FastImage from 'react-native-fast-image'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';


export const ImageScreen = () => {
    const { goBack } = useNavigation()
    return (
        <View style={{ flex: 1, backgroundColor: 'red' }}>
            <Text style={{ color: '#fff' }}>Following images will blink right before pop transition completed</Text>
            <Text style={{ color: '#fff' }}>Png image</Text>
            <FastImage style={{ width: 100, height: 100 }} source={require('../assets/react.png')} />
            <Text style={{ color: '#fff' }}>JPEG image</Text>
            <FastImage style={{ width: 100, height: 100 }} source={require('../assets/react.png')} />
            <Button title="Go Back" onPress={() => goBack()} />
        </View>
    )
}
export const RootScreen = () => {
    const { navigate } = useNavigation()
    return (
        <View style={{ flex: 1 }}>
            <Text>This is root Page</Text>
            <Button title="Next Page" onPress={() => {
                navigate('ImageScreen')
            }} />
        </View>
    )
}


const Stack = createNativeStackNavigator();
const Router = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="RootScreen"
                    component={RootScreen}
                />
                <Stack.Screen
                    name="ImageScreen"
                    component={ImageScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default Router