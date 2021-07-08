import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
const levels = 2;
const Stack = createStackNavigator();

function RandomStack(props: any) {
    const {navigation, route, level} = props;

    if (level === 0) {
        console.log("level props", level, Object.keys(route));
        return  (
            <View>
                <Text> {"level route " + level + " " + route.name} </Text>
            </View>
        );
    }
    if (false && level != levels) {
        const isFocused = navigation.isFocused();
        useEffect(() => {
            if (isFocused) {
                const stay = Math.random() < 0.9;
                const next = Math.round(Math.random() * 99) % 3;
                const sib = stay ? route.name : next.toString();
                navigation.navigate(
                    sib,
                );
            }
        }, [isFocused]);
    } 
    
    return (
        <Stack.Navigator>
            <Stack.Screen name="0" >
                { (props) => <RandomStack {...props} level={level-1}/> }
            </Stack.Screen> 
            <Stack.Screen name="1" >
                { (props) => <RandomStack {...props} level={level-1}/> }    
            </Stack.Screen> 
            <Stack.Screen name="2" >
                { (props) => <RandomStack {...props} level={level-1}/> }
            </Stack.Screen> 
        </Stack.Navigator>
    );
}

export default function NestedStacksExample() {
    return (
        <NavigationContainer>
            <RandomStack level={levels} />
        </NavigationContainer>
    );
}
