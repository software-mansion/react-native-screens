import { SettingsSwitch } from '../../../shared/SettingsSwitch';
import React, { useEffect, useState, useCallback } from 'react';
import {
    Appearance,
    ColorSchemeName,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Scenario } from '../../shared/helpers';
import {
    TabsContainerWithHostConfigContext,
    type TabRouteConfig,
    useTabsHostConfig,
    DEFAULT_TAB_ROUTE_OPTIONS,
} from '../../../shared/gamma/containers/tabs';
import { ScreenStackHeaderConfig, Tabs } from 'react-native-screens';
import { PropToggle,PropSelector } from '../../../shared/PropToggle';




const SCENARIO: Scenario = {
    name: 'Tab Bar Visibility',
    key: 'test-tab-bar-visibility',
    platforms: ['ios', 'android'],
    AppComponent: App,
};

export default SCENARIO;

// ─── Types ────────────────────────────────────────────────────────────────────

type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';
type TabBarMinimizeBehavior = 'automatic' | 'never' | 'onScrollDown' | 'onScrollUp';
type Direction = 'inherit' | 'ltr' | 'rtl';
type ColorScheme = 'light' | 'dark';
type UserInterfaceStyle = 'unspecified' | 'light' | 'dark';

type LogEntry = { id: number; text: string };

// ─── Constants ────────────────────────────────────────────────────────────────
const TAB_BAR_CONTROLLER_MODE_OPTIONS: TabBarControllerMode[] = ['automatic', 'tabBar', 'tabSidebar'];
const TAB_BAR_MINIMIZE_BEHAVIOR_OPTIONS: TabBarMinimizeBehavior[] = ['automatic', 'never', 'onScrollDown', 'onScrollUp'];
const DIRECTION_OPTIONS: Direction[] = ['inherit', 'ltr', 'rtl'];
const COLOR_SCHEME_OPTIONS: ColorScheme[] = ['light', 'dark'];
const USER_INTERFACE_STYLE_OPTIONS: UserInterfaceStyle[] = ['unspecified', 'light', 'dark'];


const StatusLog = ({
    entries,
    testIDPrefix,
}: {
    entries: LogEntry[];
    testIDPrefix: string;
}) => (
    <View style={ctrl.log}>
        <Text style={ctrl.label}>Callback log</Text>
        <ScrollView style={ctrl.logScroll} nestedScrollEnabled>
            {entries.length === 0 && (
                <Text style={ctrl.logEmpty}>No events yet</Text>
            )}
            {entries.map((e, i) => (
                <Text
                    key={e.id}
                    style={ctrl.logEntry}
                    testID={i === entries.length - 1 ? `${testIDPrefix}-last` : undefined}>
                    {e.text}
                </Text>
            ))}
        </ScrollView>
    </View>
);

function ConfigScreen() {
    const { hostConfig, updateHostConfig } = useTabsHostConfig();
    // const [reactColorScheme, setReactColorScheme] =
    //     React.useState<ColorSchemeName>('unspecified');

    // ── Tabs.Host props ──────────────────────────────────────────────────
    const [tabBarHidden, setTabBarHidden] = useState(false);
    const [tabBarControllerMode, setTabBarControllerMode] = useState<TabBarControllerMode>('auto');
    const [tabBarMinimizeBehavior, setTabBarMinimizeBehavior] = useState<TabBarMinimizeBehavior>('automatic');

    // ── Tabs.Screen props ────────────────────────────────────────────────
    const [direction, setDirection] = useState<Direction>('inherit');
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const [userInterfaceStyle, setUiStyle] = useState<UserInterfaceStyle>('unspecified');

    // ── callback log ───────────────────
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
    const logId = React.useRef(0);

    const log = useCallback((text: string) => {
        setLogEntries(prev => [
            ...prev,
            { id: logId.current++, text: `${new Date().toISOString().slice(11, 23)}  ${text}` },
        ]);
    }, []);

    // useEffect(() => {
    //     Appearance.setColorScheme(reactColorScheme);
    // }, [reactColorScheme]);

    return (
        <ScrollView style={{ padding: 40 }}>
            <View style={styles.section}>
                <Text>TabBarHidden option:</Text>
                <PropToggle
                    label="tabBarHidden"
                    iosOnly={false}
                    value={hostConfig.tabBarHidden ?? false}
                    onValueChange={value => updateHostConfig({ tabBarHidden: value })}
                />
                <PropSelector
                    label="tabBarControllerMode"
                    options={TAB_BAR_CONTROLLER_MODE_OPTIONS}
                    selected={hostConfig.tabBarControllerMode ?? 'automatic'}
                    testIDPrefix="select-tab-bar-controller-mode"
                    iosOnly
                    note="Prop on TabsHost. tabSideBar collapses to tabBar on iPhone — test on iPad."
                    onValueChange={value => updateHostConfig({ tabBarControllerMode: value })
                    }
                />
            </View>
        </ScrollView>
    );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
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
        Component: ConfigScreen,
        options: {
            ...DEFAULT_TAB_ROUTE_OPTIONS,
            title: 'Tab2',
        },
    },
];

export function App() {
    return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 60 : undefined,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    section: {
        marginBottom: 10,
    },
});

const ctrl = StyleSheet.create({
    panel: {
        marginTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 16,
        gap: 12,
    },
    heading: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#888',
        letterSpacing: 0.5,
    },
    group: {
        gap: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 13,
        color: '#555',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    chip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 6,
    },
    chipActive: {
        borderColor: '#007AFF',
        backgroundColor: '#007AFF',
    },
    chipText: {
        fontSize: 12,
        color: '#555',
    },
    chipTextActive: {
        color: '#fff',
    },
    note: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    log: {
        marginTop: 8,
        gap: 4,
    },
    logScroll: {
        maxHeight: 120,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 6,
        padding: 8,
    },
    logEmpty: {
        fontSize: 12,
        color: '#aaa',
        fontStyle: 'italic',
    },
    logEntry: {
        fontSize: 11,
        color: '#333',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        lineHeight: 18,
    },
});