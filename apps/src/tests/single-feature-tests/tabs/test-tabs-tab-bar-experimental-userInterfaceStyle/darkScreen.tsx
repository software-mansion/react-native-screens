import {
    TabsContainerWithHostConfigContext,
    type TabRouteConfig,
} from '@apps/shared/gamma/containers/tabs';
import React from 'react';
import { Button, View, Text, ScrollView } from 'react-native';

import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
    useNavigation,
    type NavigationProp,
    ThemeProvider,
    DarkTheme,
} from '@react-navigation/native';

type RootStackParamList = {
    Screen1: undefined;
    DarkScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Screen1() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <ScrollView style={{ padding: 40 }}>
            <View>
                <Text style={styles.sectionHeader}>
                    experimental_userInterfaceStyle
                </Text>
                <Text style={styles.description}>
                    Enable system light mode and observe the tab bar and back
                    button on the pushed screen.
                </Text>
                <Button
                    title="Push screen with style: dark"
                    onPress={() => navigation.navigate('DarkScreen')}
                />
            </View>
        </ScrollView>
    );
}

function DarkStyleTabContent() {
    return (
        <View style={styles.centeredDarkScreen}>
            <Text style={styles.screenLabel}>
                experimental_userInterfaceStyle: dark</Text>
            <Text style={styles.screenHint}>
                This screen forces dark interface style regardless of system setting.
                Observe the tab bar and navigation bar appearance.
            </Text>
        </View>
    );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
    {
        name: 'Tab1',
        Component: DarkStyleTabContent,
        options: {
            title: 'Tab1',
            ios: {
                icon: {
                    type: 'sfSymbol',
                    name: 'house',
                },
                experimental_userInterfaceStyle: 'dark'
            }
        },
    },
    {
        name: 'Tab2',
        Component: DarkStyleTabContent,
        options: {
            title: 'Tab2',
            ios: {
                icon: {
                    type: 'sfSymbol',
                    name: 'star',
                },
                experimental_userInterfaceStyle: 'dark'
            },
        },
    },
];

function DarkInterfaceStyleScreen() {
    return (
        <TabsContainerWithHostConfigContext
            routeConfigs={ROUTE_CONFIGS}
        />
    );
}

export function App() {
    return (
        <ThemeProvider value={DarkTheme}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Screen1"
                    component={Screen1}
                    options={{
                        headerShown: false,
                        contentStyle: { backgroundColor: 'black' }
                    }}
                />
                <Stack.Screen
                    name="DarkScreen"
                    component={DarkInterfaceStyleScreen}
                    options={{
                        title: 'Dark Interface Style',
                        statusBarStyle: "light",
                    }}
                />
            </Stack.Navigator>
        </ThemeProvider>
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
    centeredDarkScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        gap: 12,
        backgroundColor: 'black'
    },
    screenLabel: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white'
    },
    screenHint: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        lineHeight: 20,
    },
};
