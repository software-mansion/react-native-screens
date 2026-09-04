import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import LongText from '@apps/shared/LongText';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  type TabRouteConfig,
  TabsContainer,
} from '@apps/shared/containers/tabs';
import {
  StackContainer,
  useStackNavigationContext,
  type StackRouteConfig,
} from '@apps/shared/containers/stack';
import type {
  StackHeaderToolbarMenuBaseAndroid,
  StackHeaderTypeAndroid,
  StackHostColorScheme,
} from 'react-native-screens';
import { Colors } from '@apps/shared/styling';
import { SafeAreaView } from 'react-native-screens/experimental';

const HEADER_TYPES: StackHeaderTypeAndroid[] = ['small', 'medium', 'large'];

const PersistenceContext = createContext<{
  titleVersion: number;
  bumpTitleVersion: () => void;
  hostColorScheme: StackHostColorScheme;
  setHostColorScheme: (val: StackHostColorScheme) => void;
  headerType: StackHeaderTypeAndroid;
  setHeaderType: (val: StackHeaderTypeAndroid) => void;
  trailingSubviewEnabled: boolean;
  setTrailingSubviewEnabled: (val: boolean) => void;
  headerHidden: boolean;
  setHeaderHidden: (val: boolean) => void;
}>({
  titleVersion: 1,
  bumpTitleVersion: () => {},
  hostColorScheme: 'inherit',
  setHostColorScheme: () => {},
  headerType: 'medium',
  setHeaderType: () => {},
  trailingSubviewEnabled: false,
  setTrailingSubviewEnabled: () => {},
  headerHidden: false,
  setHeaderHidden: () => {},
});

function ColorSchemePicker() {
  const { hostColorScheme, setHostColorScheme } =
    useContext(PersistenceContext);

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>StackHost color scheme</Text>
      <SettingsPicker<StackHostColorScheme>
        label={'colorScheme'}
        value={hostColorScheme}
        onValueChange={setHostColorScheme}
        items={['inherit', 'light', 'dark']}
      />
    </View>
  );
}

// Every one of these forces a header rebuild, unlike a title change which is applied
// as a delta to the live header.
function RebuildControls() {
  const {
    headerType,
    setHeaderType,
    trailingSubviewEnabled,
    setTrailingSubviewEnabled,
    headerHidden,
    setHeaderHidden,
  } = useContext(PersistenceContext);

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Header rebuild triggers</Text>
      <SettingsPicker<StackHeaderTypeAndroid>
        label={'type'}
        value={headerType}
        onValueChange={setHeaderType}
        items={HEADER_TYPES}
      />
      <SettingsSwitch
        label="trailing subview"
        value={trailingSubviewEnabled}
        onValueChange={setTrailingSubviewEnabled}
      />
      <SettingsSwitch
        label="hidden"
        value={headerHidden}
        onValueChange={setHeaderHidden}
      />
    </View>
  );
}

function buildToolbarMenu(
  onSelectionChange: (selectedIds: string[]) => void,
): StackHeaderToolbarMenuBaseAndroid {
  return {
    groups: [{ groupId: 'filters', onSelectionChange }],
    children: [
      {
        type: 'menuItem',
        id: 'filterA',
        title: 'Filter A',
        groupId: 'filters',
        initialToggleState: true,
      },
      {
        type: 'menuItem',
        id: 'filterB',
        title: 'Filter B',
        groupId: 'filters',
      },
    ],
  };
}

function HomeScreen() {
  const { push, setRouteOptions, routeKey } = useStackNavigationContext();
  const { titleVersion, headerType, trailingSubviewEnabled, headerHidden } =
    useContext(PersistenceContext);
  const [lastSelection, setLastSelection] = useState<string | null>(null);
  // `medium`/`large` headers snap by default, so the app bar can never rest at a
  // partial offset. Turning it off is what makes the fractional case testable.
  const [snapEnabled, setSnapEnabled] = useState(true);

  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setLastSelection(JSON.stringify(selectedIds));
  }, []);

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: `Home v${titleVersion}`,
        subtitle: 'Tab persistence',
        hidden: headerHidden,
        android: {
          type: headerType,
          scrollFlagScroll: true,
          scrollFlagExitUntilCollapsed: true,
          scrollFlagSnap: snapEnabled,
          toolbarMenu: buildToolbarMenu(handleSelectionChange),
          trailingSubview: trailingSubviewEnabled
            ? {
                render: () => (
                  <View style={styles.subview}>
                    <Text style={styles.subviewLabel}>T</Text>
                  </View>
                ),
              }
            : undefined,
        },
      },
    });
  }, [
    setRouteOptions,
    routeKey,
    titleVersion,
    handleSelectionChange,
    headerType,
    trailingSubviewEnabled,
    headerHidden,
    snapEnabled,
  ]);

  return (
    // Without a header there is nothing keeping the content below the status
    // bar, so the top inset has to take over while `hidden` is set.
    <SafeAreaView edges={{ top: headerHidden }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        nestedScrollEnabled>
        <View style={styles.section}>
          <Text style={styles.text}>
            Switch to the Other tab and back: the collapsing header above must
            survive every round trip, including its title, toolbar menu
            selections and scroll behavior.
          </Text>
          <Text style={styles.text}>
            Last menu selection: {lastSelection ?? 'none yet'}
          </Text>
        </View>

        <View style={styles.section}>
          <SettingsSwitch
            label="scrollFlagSnap"
            value={snapEnabled}
            onValueChange={setSnapEnabled}
          />
        </View>

        <ColorSchemePicker />

        <View style={styles.section}>
          <Button title="Push Details" onPress={() => push('Details')} />
        </View>

        <LongText size="xl" />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.text}>
          Switch tabs while this screen is on top: both this header and the Home
          header underneath must survive the round trip.
        </Text>
      </View>
    </ScrollView>
  );
}

function OtherTabScreen() {
  const { bumpTitleVersion, titleVersion } = useContext(PersistenceContext);

  return (
    <SafeAreaView edges={{ top: true }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.text}>
            Change the nested stack configuration while its tab is detached,
            then switch back to verify the change was applied.
          </Text>
          <Button
            title={`Change Home title (v${titleVersion} → v${
              titleVersion + 1
            })`}
            onPress={bumpTitleVersion}
          />
        </View>

        <RebuildControls />

        <ColorSchemePicker />
      </ScrollView>
    </SafeAreaView>
  );
}

const STACK_ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Home',
    element: <HomeScreen />,
  },
  {
    name: 'Details',
    element: <DetailsScreen />,
    options: {
      headerConfig: {
        title: 'Details',
      },
    },
  },
];

function StackTabScreen() {
  const { hostColorScheme } = useContext(PersistenceContext);

  return (
    <StackContainer
      routeConfigs={STACK_ROUTE_CONFIGS}
      colorScheme={hostColorScheme}
    />
  );
}

const TABS_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Stack',
    element: <StackTabScreen />,
    options: {
      title: 'Stack',
      ...DEFAULT_TAB_ROUTE_OPTIONS,
    },
  },
  {
    name: 'Other',
    element: <OtherTabScreen />,
    options: {
      title: 'Other',
      ...DEFAULT_TAB_ROUTE_OPTIONS,
    },
  },
];

export function TestStackTabsStackInTabsHeaderPersistence() {
  const [titleVersion, setTitleVersion] = useState(1);
  const [hostColorScheme, setHostColorScheme] =
    useState<StackHostColorScheme>('inherit');
  const [headerType, setHeaderType] =
    useState<StackHeaderTypeAndroid>('medium');
  const [trailingSubviewEnabled, setTrailingSubviewEnabled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);

  const bumpTitleVersion = useCallback(
    () => setTitleVersion(version => version + 1),
    [],
  );

  return (
    <PersistenceContext.Provider
      value={{
        titleVersion,
        bumpTitleVersion,
        hostColorScheme,
        setHostColorScheme,
        headerType,
        setHeaderType,
        trailingSubviewEnabled,
        setTrailingSubviewEnabled,
        headerHidden,
        setHeaderHidden,
      }}>
      <TabsContainer routeConfigs={TABS_ROUTE_CONFIGS} />
    </PersistenceContext.Provider>
  );
}

export default createScenario(
  TestStackTabsStackInTabsHeaderPersistence,
  scenarioDescription,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  text: {
    color: 'gray',
    marginBottom: 10,
  },
  subview: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.4)',
  },
  subviewLabel: {
    fontWeight: 'bold',
  },
});
