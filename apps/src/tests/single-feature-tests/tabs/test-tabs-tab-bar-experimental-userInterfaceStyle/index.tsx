import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { StackContainer, StackRouteConfig, useStackNavigationContext } from '@apps/shared/gamma/containers/stack';
import { DarkRootScreen, DarkInterfaceStyleScreen } from './darkScreen';
import { LightRootScreen, LightInterfaceStyleScreen } from './lightScreen';
import { Scenario } from '@apps/tests/shared/helpers';

const SCENARIO: Scenario = {
    name: 'Tab Bar Experimental UIStyle',
    key: 'test-tabs-tab-bar-experimental-userInterfaceStyle-ios',
    platforms: ['ios'],
    AppComponent: App,
};

export default SCENARIO;

function HomeScreen() {
    const navigation = useStackNavigationContext();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>experimental_userInterfaceStyle</Text>
            <Text style={styles.description}>
                Select an interface style to preview how the tab bar and
                navigation bar respond.
            </Text>
            <Button title="Dark" onPress={() => navigation.push('darkRoot')} />
            <Button title="Light" onPress={() => navigation.push('lightRoot')} />
        </View>
    );
}

function DarkRootScreenContent() {
    const navigation = useStackNavigationContext();
    return <DarkRootScreen onPush={() => navigation.push('darkPushed')} />;
}

function LightRootScreenContent() {
    const navigation = useStackNavigationContext();
    return <LightRootScreen onPush={() => navigation.push('lightPushed')} />;
}

const ROUTE_CONFIGS: StackRouteConfig[] = [
    { name: 'home', Component: HomeScreen, options: {} },
    { name: 'darkRoot', Component: DarkRootScreenContent, options: {} },
    { name: 'darkPushed', Component: DarkInterfaceStyleScreen, options: {} },
    { name: 'lightRoot', Component: LightRootScreenContent, options: {} },
    { name: 'lightPushed', Component: LightInterfaceStyleScreen, options: {} },
];

export function App() {
    return (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
            <StackContainer routeConfigs={ROUTE_CONFIGS} />
        </View>
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
        color: '#5d5b5b',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
        marginBottom: 12,
    },
});
