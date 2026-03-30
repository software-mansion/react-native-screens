import {
    TabsContainerWithHostConfigContext,
    type TabRouteConfig,
    useTabsHostConfig,
    DEFAULT_TAB_ROUTE_OPTIONS,
} from '../../../shared/gamma/containers/tabs';
import React from 'react';
import { Button, View, Platform, Text, ScrollView, StyleSheet,I18nManager } from 'react-native';
import { Scenario } from '../../shared/helpers';
import { SettingsPicker, SettingsSwitch } from '../../../shared';
import { TabBarMinimizeBehavior, TabBarControllerMode } from 'react-native-screens';
import RNRestart from 'react-native-restart';

import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
    useNavigation,
    type NavigationProp,
} from '@react-navigation/native';
type RootStackParamList = {
    Main: undefined;
    LightScreen: undefined;
    DarkScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const SCENARIO: Scenario = {
    name: 'Tab Bar Visibility',
    key: 'test-tab-bar-visibility',
    platforms: ['ios', 'android'],
    AppComponent: App,
};

export default SCENARIO;

// type ConfigScreenProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

function ConfigScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { hostConfig, updateHostConfig } = useTabsHostConfig();
    return (
        <ScrollView style={{ padding: 40 }}>
            <View>
                <Text style={{ fontWeight: '800' }}>Instruction:</Text>
                <Text>To change values for flags click on button with it's name and select value. Below each switching button expected behaviour for each value were described.</Text>
                {/* Only prop which can be automated in e2e tests */}
                <SettingsSwitch style={{ marginTop: 20, marginBottom: 15 }}
                    label="tabBarHidden"
                    value={hostConfig.tabBarHidden ?? false}
                    onValueChange={value => updateHostConfig({ tabBarHidden: value })}
                />
                <Text style={{ fontWeight: '700' }}>Expected for:</Text>
                <Text>- true - tab bar should be hidden</Text>
                <Text>- false - tab bar should be visible</Text>

                {/* TO BE DISCUSS currently it doenst work on ios and work weirdly on android */}
{/* 
                <SettingsSwitch
                          label="Right to left"
                          value={I18nManager.isRTL}
                          onValueChange={() => {
                            I18nManager.forceRTL(!I18nManager.isRTL);
                            RNRestart.Restart();
                          }}
                          testID="root-screen-switch-rtl"
                        /> */}
                <SettingsPicker style={{ marginTop: 20, marginBottom: 15 }}
                    label={'tabHostLayoutDirection'}
                    value={hostConfig.direction ?? 'inherit'}
                    onValueChange={value => updateHostConfig({ direction: value })}
                    items={['inherit', 'ltr', 'rtl']}
                />
                <Text style={{ fontWeight: '700' }}>Configuration1:</Text>
                <Text>system layout direction set to left-to-right: </Text>
                <Text>- inherit - parent's layout direction is used</Text>
                <Text>- ltr - tab tab should be visible</Text>
                <Text>- rtl - tab tab should be visible</Text>

                <Text style={{ fontWeight: '700' }}>{'\n'}Configuration2:</Text>
                <Text>system layout direction set to right-to-left: </Text>
                <Text>- inherit - parent's layout direction is used</Text>
                <Text>- ltr - tab tab should be visible</Text>
                <Text>- rtl - tab tab should be visible</Text>

                <SettingsPicker style={{ marginTop: 20, marginBottom: 15 }}
                    label={'ColorScheme'}
                    value={hostConfig.colorScheme ?? 'inherit'}
                    onValueChange={value => updateHostConfig({ colorScheme: value })}
                    items={['inherit', 'light', 'dark']}
                />

                {Platform.OS === 'ios' && (
                    <>
                        <Text style={styles.sectionHeader}>iOS only</Text>

                        <Text style={styles.description}>
                            Controls whether the tab bar is displayed as a bar or
                            sidebar. Test tabSidebar on iPad — on iPhone it collapses
                            back to a tab bar automatically.
                        </Text>
                        <SettingsPicker<TabBarControllerMode>
                            label="tabBarControllerMode"
                            value={hostConfig.ios?.tabBarControllerMode ?? 'automatic'}
                            onValueChange={value =>
                                updateHostConfig({ ios: { tabBarControllerMode: value } })
                            }
                            items={['automatic', 'tabBar', 'tabSidebar']}
                        />

                        <Text style={styles.description}>
                            Controls when the tab bar minimizes. Switch to Tab2 and
                            scroll up/down to observe the behaviour. Requires iOS 26+.
                        </Text>
                        <SettingsPicker<TabBarMinimizeBehavior>
                            label="tabBarMinimizeBehavior"
                            value={hostConfig.ios?.tabBarMinimizeBehavior ?? 'automatic'}
                            onValueChange={value =>
                                updateHostConfig({ ios: { tabBarMinimizeBehavior: value } })
                            }
                            items={['automatic', 'onScrollDown', 'onScrollUp', 'never']}
                        />

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
                        <Text style={styles.description}>
                            Enable system light mode and observe the tab bar and back
                            button on the pushed screen.
                        </Text>
                        <Button
                            title="Push screen with style: dark"
                            onPress={() => navigation.navigate('DarkScreen')}
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

function TestScreen() {
    return (
        <ScrollView
            style={{ flex: 1 }}
            contentInsetAdjustmentBehavior="automatic"
            testID="test-screen-scroll">
            {Array.from({ length: 40 }, (_, i) => (
                <View key={i} style={styles.scrollItem}>
                    <Text>Row {i + 1} — scroll to test tabBarMinimizeBehavior</Text>
                </View>
            ))}
        </ScrollView>
    );
}

function LightStyleTabContent() {
    return (
        <View style={styles.centeredScreen}>
            <Text style={styles.screenLabel}>experimental_userInterfaceStyle: light</Text>
            <Text style={styles.screenHint}>
                This screen forces light interface style regardless of system setting.
                Observe the tab bar and navigation bar appearance.
            </Text>
        </View>
    );
}

function DarkStyleTabContent() {
    return (
        <View style={styles.centeredScreen}>
            <Text style={styles.screenLabel}>experimental_userInterfaceStyle: dark</Text>
            <Text style={styles.screenHint}>
                This screen forces dark interface style regardless of system setting.
                Observe the tab bar and navigation bar appearance.
            </Text>
        </View>
    );
}

const LIGHT_ROUTE_CONFIGS: TabRouteConfig[] = [
    {
        name: 'LightTab1',
        Component: LightStyleTabContent,
        options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Tab1',
            ios: { experimental_userInterfaceStyle: 'light' },
        },
    },
    {
        name: 'LightTab2',
        Component: TestScreen,
        options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Tab2',
            ios: { experimental_userInterfaceStyle: 'light' },
        },
    },
];

const DARK_ROUTE_CONFIGS: TabRouteConfig[] = [
    {
        name: 'DarkTab1',
        Component: DarkStyleTabContent,
        options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Tab1',
            ios: { experimental_userInterfaceStyle: 'dark' },
        },
    },
    {
        name: 'DarkTab2',
        Component: TestScreen,
        options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Tab2',
            ios: { experimental_userInterfaceStyle: 'dark' },
        },
    },
];

function LightInterfaceStyleScreen() {
    return (
        <TabsContainerWithHostConfigContext
            routeConfigs={LIGHT_ROUTE_CONFIGS}
        />
    );
}

function DarkInterfaceStyleScreen() {
    return (
        <TabsContainerWithHostConfigContext
            routeConfigs={DARK_ROUTE_CONFIGS}
        />
    );
}

const MAIN_ROUTE_CONFIGS: TabRouteConfig[] = [
    {
        name: 'Tab1',
        Component: ConfigScreen,
        options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Tab1',
        },
    },
    {
        name: 'Tab2',
        Component: TestScreen,
        options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Tab2',

        },
    },
];
function MainScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Main'>) {
    return (
        <TabsContainerWithHostConfigContext
            routeConfigs={MAIN_ROUTE_CONFIGS}
        />
    );
}

export function App() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Main"
                component={MainScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LightScreen"
                component={LightInterfaceStyleScreen}
                options={{ title: 'Light Interface Style' }}
            />
            <Stack.Screen
                name="DarkScreen"
                component={DarkInterfaceStyleScreen}
                options={{ title: 'Dark Interface Style' }}
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
    centeredScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        gap: 12,
    },
    screenLabel: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
    },
    screenHint: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        lineHeight: 20,
    },
}