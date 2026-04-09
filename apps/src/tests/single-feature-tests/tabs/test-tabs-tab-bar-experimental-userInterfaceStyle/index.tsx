import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Scenario } from '@apps/tests/shared/helpers';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import { App as DarkApp } from './darkScreen';
import { App as LightApp } from './lightScreen';

type RootStackParamList = {
    Home: undefined;
    Dark: undefined;
    Light: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const SCENARIO: Scenario = {
    name: 'Tab Bar Experimental UIStyle',
    key: 'test-tabs-tab-bar-experimental-userInterfaceStyle-ios',
    platforms: ['ios'],
    AppComponent: App,
};

export default SCENARIO;

function HomeScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>experimental_userInterfaceStyle</Text>
            <Text style={styles.description}>
                Select an interface style to preview how the tab bar and navigation bar respond.
            </Text>
            <TouchableOpacity
                style={[styles.button, styles.darkButton]}
                onPress={() => navigation.navigate('Dark')}
            >
                <Text style={styles.darkButtonText}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.lightButton]}
                onPress={() => navigation.navigate('Light')}
            >
                <Text style={styles.lightButtonText}>Light</Text>
            </TouchableOpacity>
        </View>
    );
}

export function App() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Dark"
                component={DarkApp}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Light"
                component={LightApp}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        gap: 16,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#888',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
        marginBottom: 12,
    },
    button: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    darkButton: {
        backgroundColor: '#1c1c1e',
    },
    darkButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    lightButton: {
        backgroundColor: '#f2f2f7',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#c7c7cc',
    },
    lightButtonText: {
        color: '#1c1c1e',
        fontSize: 16,
        fontWeight: '600',
    },
});
