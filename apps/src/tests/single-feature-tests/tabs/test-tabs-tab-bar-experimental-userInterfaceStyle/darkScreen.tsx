import {
    TabsContainerWithHostConfigContext,
    type TabRouteConfig,
} from '@apps/shared/gamma/containers/tabs';
import React from 'react';
import { Button, View, Text, ScrollView } from 'react-native';
import { ThemedText } from '@apps/shared/ThemedText';
import { ThemeProvider } from '../../../../../../react-navigation/packages/core/src/theming/ThemeProvider';
import { DarkTheme } from '@react-navigation/native';


export function DarkRootScreen({ onPush }: { onPush: () => void }) {
    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <ScrollView style={{ padding: 40 }}>
                <View>
                    <Text style={styles.sectionHeader}>
                        experimental_userInterfaceStyle
                    </Text>
                    <ThemedText>
                        Enable system light mode and observe the tab bar and back
                        button on the pushed screen.
                    </ThemedText>
                    <Button
                        title="Push screen with style: dark"
                        onPress={onPush}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

function DarkStyleTabContent() {
    return (
        <View style={styles.centeredDarkScreen}>
            <ThemedText>experimental_userInterfaceStyle: dark</ThemedText>
            <ThemedText style={{ textAlign: 'center' }}>
                This screen forces dark interface style regardless of system setting.
                Observe the tab bar and navigation bar appearance.
            </ThemedText>
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
                icon: { type: 'sfSymbol', name: 'house' },
                experimental_userInterfaceStyle: 'dark',
            },
        },
    },
    {
        name: 'Tab2',
        Component: DarkStyleTabContent,
        options: {
            title: 'Tab2',
            ios: {
                icon: { type: 'sfSymbol', name: 'star' },
                experimental_userInterfaceStyle: 'dark',
            },
        },
    },
];

export function DarkInterfaceStyleScreen() {
    return (
        <ThemeProvider value={DarkTheme}>
            <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />
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
        marginTop: 60,
        marginBottom: 4,
    },
    centeredDarkScreen: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: 40,
        gap: 12,
        backgroundColor: 'black',
    },
};
