import {
    TabsContainerWithHostConfigContext,
    type TabRouteConfig,
} from '@apps/shared/gamma/containers/tabs';
import React from 'react';
import { Button, View, Text, ScrollView } from 'react-native';
import Colors from '@apps/shared/styling/Colors';
import { ThemedText } from '@apps/shared';

export function LightRootScreen({ onPush }: { onPush: () => void }) {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView style={{ padding: 40 }}>
                <View>
                    <Text style={styles.sectionHeader}>
                        experimental_userInterfaceStyle
                    </Text>
                    <ThemedText>
                        Enable system dark mode and observe the tab bar and back
                        button on the pushed screen.
                    </ThemedText>
                    <Button
                        title="Push screen with style: light"
                        onPress={onPush}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

function LightStyleTabScreen() {
    return (
        <View style={styles.centeredLightScreen}>
            <ThemedText>experimental_userInterfaceStyle: light</ThemedText>
            <ThemedText style={{ textAlign: 'center' }}>
                This screen forces light interface style regardless of system setting.
                Observe the tab bar and navigation bar appearance.
            </ThemedText>
        </View>
    );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
    {
        name: 'Tab1',
        Component: LightStyleTabScreen,
        options: {
            title: 'Tab1',
            ios: {
                icon: { type: 'sfSymbol', name: 'house' },
                experimental_userInterfaceStyle: 'light',
            },
        },
    },
    {
        name: 'Tab2',
        Component: LightStyleTabScreen,
        options: {
            title: 'Tab2',
            ios: {
                icon: { type: 'sfSymbol', name: 'star' },
                experimental_userInterfaceStyle: 'light',
            },
        },
    },
];

export function LightInterfaceStyleScreen() {
    return (
        <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />
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
    centeredLightScreen: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: 40,
        gap: 12,
        backgroundColor: Colors.cardBackground,
    },
};
