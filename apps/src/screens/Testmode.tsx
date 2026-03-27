import React, { useCallback, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScreenStackHeaderConfig, Tabs } from 'react-native-screens';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabBarControllerMode   = 'auto' | 'tabBar' | 'tabSideBar';
type TabBarMinimizeBehavior = 'automatic' | 'never' | 'onScrollDown' | 'onScrollUp';
type Direction              = 'inherit' | 'ltr' | 'rtl';
type ColorScheme            = 'light' | 'dark';
type UserInterfaceStyle     = 'unspecified' | 'light' | 'dark';

type LogEntry = { id: number; text: string };

// ─── Constants ────────────────────────────────────────────────────────────────

const TAB_BAR_CONTROLLER_MODE_OPTIONS: TabBarControllerMode[]     = ['auto', 'tabBar', 'tabSideBar'];
const TAB_BAR_MINIMIZE_BEHAVIOR_OPTIONS: TabBarMinimizeBehavior[] = ['automatic', 'never', 'onScrollDown', 'onScrollUp'];
const DIRECTION_OPTIONS: Direction[]                              = ['inherit', 'ltr', 'rtl'];
const COLOR_SCHEME_OPTIONS: ColorScheme[]                         = ['light', 'dark'];
const USER_INTERFACE_STYLE_OPTIONS: UserInterfaceStyle[]          = ['unspecified', 'light', 'dark'];

// ─── Shared UI primitives ─────────────────────────────────────────────────────

const PropToggle = ({
  label,
  value,
  testID,
  onChange,
  iosOnly,
  note,
}: {
  label: string;
  value: boolean;
  testID: string;
  onChange: (v: boolean) => void;
  iosOnly?: boolean;
  note?: string;
}) => (
  <View style={ctrl.group}>
    <View style={ctrl.row}>
      <View style={ctrl.labelRow}>
        <Text style={ctrl.label}>{label}</Text>
        {iosOnly && <Text style={ctrl.badge}>iOS</Text>}
      </View>
      <Pressable
        testID={testID}
        onPress={() => onChange(!value)}
        style={[ctrl.chip, value && ctrl.chipActive]}>
        <Text style={[ctrl.chipText, value && ctrl.chipTextActive]}>
          {value ? 'ON' : 'OFF'}
        </Text>
      </Pressable>
    </View>
    {note ? <Text style={ctrl.note}>{note}</Text> : null}
  </View>
);

/**
 * PropSelector — every chip gets a testID; the active chip additionally
 * gets the '-active' suffix so Detox can assert which value is selected.
 */
const PropSelector = <T extends string>({
  label,
  options,
  selected,
  testIDPrefix,
  onChange,
  iosOnly,
  note,
}: {
  label: string;
  options: T[];
  selected: T;
  testIDPrefix: string;
  onChange: (o: T) => void;
  iosOnly?: boolean;
  note?: string;
}) => (
  <View style={ctrl.group}>
    <View style={ctrl.labelRow}>
      <Text style={ctrl.label}>{label}</Text>
      {iosOnly && <Text style={ctrl.badge}>iOS only</Text>}
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map(o => {
        const active = o === selected;
        return (
          <Pressable
            key={o}
            testID={active ? `${testIDPrefix}-active` : `${testIDPrefix}-${o}`}
            onPress={() => onChange(o)}
            style={[ctrl.chip, active && ctrl.chipActive]}>
            <Text style={[ctrl.chipText, active && ctrl.chipTextActive]}>
              {o}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
    {note ? <Text style={ctrl.note}>{note}</Text> : null}
  </View>
);

const StatusLog = ({
  entries,
  testIDPrefix,
}: {
  entries: LogEntry[];
  testIDPrefix: string;
}) => (
  <View style={ctrl.log}>
    <Text style={ctrl.sectionHeading}>Event log</Text>
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

const SectionHeading = ({ title }: { title: string }) => (
  <Text style={ctrl.sectionHeading}>{title}</Text>
);

// ─── Main playground ──────────────────────────────────────────────────────────

export default function TabBarPropsPlayground() {
  // ── Tabs.Host props ──────────────────────────────────────────────────
  const [tabBarHidden, setTabBarHidden]                     = useState(false);
  const [tabBarControllerMode, setTabBarControllerMode]     = useState<TabBarControllerMode>('auto');
  const [tabBarMinimizeBehavior, setTabBarMinimizeBehavior] = useState<TabBarMinimizeBehavior>('automatic');

  // ── Tabs.Screen props ────────────────────────────────────────────────
  const [direction, setDirection]             = useState<Direction>('inherit');
  const [colorScheme, setColorScheme]         = useState<ColorScheme>('light');
  const [userInterfaceStyle, setUiStyle]      = useState<UserInterfaceStyle>('unspecified');

  // ── Callback log ─────────────────────────────────────────────────────
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const logId = useRef(0);

  const log = useCallback((text: string) => {
    setLogEntries(prev => [
      ...prev,
      { id: logId.current++, text: `${new Date().toISOString().slice(11, 23)}  ${text}` },
    ]);
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  return (
    <Tabs.Host
      style={StyleSheet.absoluteFill}
      testID="tabs-host"
      tabBarHidden={tabBarHidden}
      {...(Platform.OS === 'ios' && {
        tabBarControllerMode,
        tabBarMinimizeBehavior,
      })}>

      {/* ── Tab 1 — Controls ──────────────────────────────────────────── */}
      <Tabs.Screen
        testID="tab-screen-controls"
        tabBarLabel="Controls"
        direction={direction}
        colorScheme={colorScheme}
        {...(Platform.OS === 'ios' && {
          experimental_userInterfaceStyle: userInterfaceStyle,
        })}
        onAppear={() => log('tab1 onAppear')}
        onDisappear={() => log('tab1 onDisappear')}>

        <ScreenStackHeaderConfig title="Tab bar props" />

        <ScrollView
          contentContainerStyle={screen.scroll}
          contentInsetAdjustmentBehavior="automatic"
          testID="tab-content-controls">

          {/* ── Active values summary ──────────────────────────────── */}
          <View style={screen.summary} testID="active-props-summary">
            <Text style={ctrl.sectionHeading}>Active values</Text>

            <Text style={screen.summaryRow}>
              {'[Host] tabBarHidden: '}
              <Text style={screen.summaryVal}>{String(tabBarHidden)}</Text>
            </Text>
            {Platform.OS === 'ios' && (
              <>
                <Text style={screen.summaryRow}>
                  {'[Host] tabBarControllerMode: '}
                  <Text style={screen.summaryVal}>{tabBarControllerMode}</Text>
                </Text>
                <Text style={screen.summaryRow}>
                  {'[Host] tabBarMinimizeBehavior: '}
                  <Text style={screen.summaryVal}>{tabBarMinimizeBehavior}</Text>
                </Text>
              </>
            )}
            <Text style={screen.summaryRow}>
              {'[Screen] direction: '}
              <Text style={screen.summaryVal}>{direction}</Text>
            </Text>
            <Text style={screen.summaryRow}>
              {'[Screen] colorScheme: '}
              <Text style={screen.summaryVal}>{colorScheme}</Text>
            </Text>
            {Platform.OS === 'ios' && (
              <Text style={screen.summaryRow}>
                {'[Screen] experimental_userInterfaceStyle: '}
                <Text style={screen.summaryVal}>{userInterfaceStyle}</Text>
              </Text>
            )}
          </View>

          {/* ── Controls panel ────────────────────────────────────── */}
          <View style={ctrl.panel} testID="test-controls-panel">

            {/* ── Tabs.Host props ──────────────────────────────────── */}
            <SectionHeading title="Tabs.Host — tab bar visibility" />

            <PropToggle
              label="tabBarHidden"
              value={tabBarHidden}
              testID="toggle-tab-bar-hidden"
              note="Hides/shows the native tab bar for all tabs."
              onChange={v => {
                setTabBarHidden(v);
                log(`tabBarHidden → ${v}`);
              }}
            />

            {Platform.OS === 'ios' && (
              <>
                <SectionHeading title="Tabs.Host — layout (iOS)" />

                <PropSelector
                  label="tabBarControllerMode"
                  options={TAB_BAR_CONTROLLER_MODE_OPTIONS}
                  selected={tabBarControllerMode}
                  testIDPrefix="select-tab-bar-controller-mode"
                  iosOnly
                  note="tabSideBar collapses to tabBar on iPhone — test on iPad."
                  onChange={v => {
                    setTabBarControllerMode(v);
                    log(`tabBarControllerMode → ${v}`);
                  }}
                />

                <PropSelector
                  label="tabBarMinimizeBehavior"
                  options={TAB_BAR_MINIMIZE_BEHAVIOR_OPTIONS}
                  selected={tabBarMinimizeBehavior}
                  testIDPrefix="select-tab-bar-minimize-behavior"
                  iosOnly
                  note="iOS 26+. Scroll this screen to observe minimize behaviour."
                  onChange={v => {
                    setTabBarMinimizeBehavior(v);
                    log(`tabBarMinimizeBehavior → ${v}`);
                  }}
                />
              </>
            )}

            {/* ── Tabs.Screen props ─────────────────────────────────── */}
            <SectionHeading title="Tabs.Screen — layout" />

            <PropSelector
              label="direction"
              options={DIRECTION_OPTIONS}
              selected={direction}
              testIDPrefix="select-direction"
              onChange={v => {
                setDirection(v);
                log(`direction → ${v}`);
              }}
            />

            <SectionHeading title="Tabs.Screen — appearance" />

            <PropSelector
              label="colorScheme"
              options={COLOR_SCHEME_OPTIONS}
              selected={colorScheme}
              testIDPrefix="select-color-scheme"
              onChange={v => {
                setColorScheme(v);
                log(`colorScheme → ${v}`);
              }}
            />

            {Platform.OS === 'ios' && (
              <PropSelector
                label="experimental_userInterfaceStyle"
                options={USER_INTERFACE_STYLE_OPTIONS}
                selected={userInterfaceStyle}
                testIDPrefix="select-user-interface-style"
                iosOnly
                onChange={v => {
                  setUiStyle(v);
                  log(`experimental_userInterfaceStyle → ${v}`);
                }}
              />
            )}

            {Platform.OS === 'android' && (
              <Text style={ctrl.note}>
                iOS-only props (tabBarControllerMode, tabBarMinimizeBehavior,
                experimental_userInterfaceStyle) are hidden on Android.
              </Text>
            )}

            {/* ── Callback log ─────────────────────────────────────── */}
            <StatusLog entries={logEntries} testIDPrefix="log-tab-bar" />

            <Pressable
              testID="btn-clear-log"
              onPress={() => setLogEntries([])}
              style={ctrl.clearBtn}>
              <Text style={ctrl.clearBtnText}>Clear log</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Tabs.Screen>

      {/* ── Tab 2 ─────────────────────────────────────────────────────── */}
      <Tabs.Screen
        testID="tab-screen-2"
        tabBarLabel="Tab 2"
        onAppear={() => log('tab2 onAppear')}
        onDisappear={() => log('tab2 onDisappear')}>
        <ScreenStackHeaderConfig title="Tab 2" />
        <View style={screen.placeholder} testID="tab-content-2">
          <Text style={screen.placeholderText}>Tab 2</Text>
        </View>
      </Tabs.Screen>

      {/* ── Tab 3 ─────────────────────────────────────────────────────── */}
      <Tabs.Screen
        testID="tab-screen-3"
        tabBarLabel="Tab 3"
        onAppear={() => log('tab3 onAppear')}
        onDisappear={() => log('tab3 onDisappear')}>
        <ScreenStackHeaderConfig title="Tab 3" />
        <View style={screen.placeholder} testID="tab-content-3">
          <Text style={screen.placeholderText}>Tab 3</Text>
        </View>
      </Tabs.Screen>

    </Tabs.Host>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const screen = StyleSheet.create({
  scroll: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  summary: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 14,
    gap: 4,
  },
  summaryRow: {
    fontSize: 13,
    color: '#555',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  summaryVal: {
    color: '#007AFF',
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 17,
    color: '#888',
  },
});

// Controls are intentionally simple — they are test infrastructure.
const ctrl = StyleSheet.create({
  panel: {
    gap: 14,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#888',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  group: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  label: {
    fontSize: 13,
    color: '#555',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  badge: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#FF9500',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
    fontWeight: '600',
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
    gap: 6,
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
  clearBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  clearBtnText: {
    fontSize: 12,
    color: '#555',
  },
});