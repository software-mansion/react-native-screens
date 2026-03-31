import {
    TabsContainerWithHostConfigContext,
    type TabRouteConfig,
} from '../../../shared/gamma/containers/tabs';
import React from 'react';
import { Button, View, Text, ScrollView, StyleSheet } from 'react-native';
import { Scenario } from '../../shared/helpers';
import Colors from '../../../shared/styling/Colors';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
    useNavigation,
    type NavigationProp,
} from '@react-navigation/native';

type RootStackParamList = {
    Screen1: undefined;
    LightScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const SCENARIO: Scenario = {
    name: 'Tab Bar Light Experimental userInterfaceStyle',
    key: 'test-tab-bar-light-experimental-userInterfaceStyle-ios',
    platforms: ['ios'],
    AppComponent: App,
};

export default SCENARIO;


function Screen1() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <ScrollView style={{ padding: 40 }}>
            <View>

                <Text style={styles.sectionHeader}>
                    experimental_userInterfaceStyle
                </Text>
                <Text style={styles.description}>
                    Enable system dark mode and observe the tab bar and back
                    button on the pushed screen.
                </Text>
                <Button
                    title="Push screen with style: light"
                    onPress={() => navigation.navigate('LightScreen')}
                />
            </View>
        </ScrollView>
    );
}


function LightStyleTabScreen() {
    return (
        <View style={styles.centeredLightScreen}>
            <Text style={styles.screenLabel}>experimental_userInterfaceStyle: light</Text>
            <Text style={styles.screenHint}>
                This screen forces light interface style regardless of system setting.
                Observe the tab bar and navigation bar appearance.
            </Text>
        </View>
    );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
    {
        name: 'LightTab1',
        Component: LightStyleTabScreen,
        options: {
            title: 'Tab1',
            ios: {
                icon: {
                    type: 'sfSymbol',
                    name: 'house',
                },
                experimental_userInterfaceStyle: 'light'
            },
        },
    },
    {
        name: 'LightTab2',
        Component: LightStyleTabScreen,
        options: {
            title: 'Tab2',
            ios: {
                icon: {
                    type: 'sfSymbol',
                    name: 'star',
                },
                experimental_userInterfaceStyle: 'light'
            },
        },
    },
];

function LightInterfaceStyleScreen() {
    return (
        <TabsContainerWithHostConfigContext
            routeConfigs={ROUTE_CONFIGS}
        />
    );
}

export function App() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Screen1"
                component={Screen1}
                options={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'white' }
                }}
            />
            <Stack.Screen
                name="LightScreen"
                component={LightInterfaceStyleScreen}
                options={{
                    title: 'Light Interface Style',
                    statusBarStyle: "dark",
                }}
            />
        </Stack.Navigator>
    );
}

const styles = {
    sectionHeader: {
        fontSize: 13,
        fontWeight: '600' as const,
        textTransform: 'uppercase' as const,
        color: '#888',
        letterSpacing: 0.5,
        marginTop: 24,
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#555',
        marginBottom: 6,
        marginTop: 12,
    },
    scrollItem: {
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e0e0e0',
    },
    centeredLightScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        gap: 12,
        backgroundColor: Colors.cardBackground
    },
    screenLabel: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        color: 'gray'
    },
    screenHint: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        lineHeight: 20,
    },
}