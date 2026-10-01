import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  I18nManager,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import LongText from '@apps/shared/LongText';
import { Colors } from '@apps/shared/styling';
import {
  type StackHeaderConfigProps,
  type StackHeaderTitleHorizontalGravityAndroid,
  type StackHeaderToolbarMenuBaseAndroid,
  type StackHeaderTypeAndroid,
  type StackHostDirection,
  ScrollViewMarker,
} from 'react-native-screens';

// Probes are fixed-width boxes with their width printed on them: the edge a
// probe sits on is the whole point of this test, so they must be
// distinguishable from the title and from each other at a glance.
const PROBE_WIDTH = 48;
const PROBE_HEIGHT = 32;

const PUSH_LABEL = 'Push screen (adds a back button)';

// Each picker's options are the single source of truth; the option union type is
// derived from the array so the two can never drift apart.
const options = <const T extends string>(...values: T[]): T[] => values;

const DIRECTIONS: StackHostDirection[] = ['inherit', 'ltr', 'rtl'];
const MENU_OPTIONS = options('none', 'action + overflow');
// medium is the same Collapsing branch as large, differing only in type scale.
const HEADER_TYPES: StackHeaderTypeAndroid[] = ['small', 'large'];
const HORIZONTAL_GRAVITY_OPTIONS: StackHeaderTitleHorizontalGravityAndroid[] = [
  'start',
  'center',
  'end',
];

export type MenuOption = (typeof MENU_OPTIONS)[number];

interface Config {
  direction: StackHostDirection;
  type: StackHeaderTypeAndroid;
  centerSubview: boolean;
  titleCentered: boolean;
  subtitleCentered: boolean;
  expandedTitleHorizontalGravity: StackHeaderTitleHorizontalGravityAndroid;
  collapsedTitleHorizontalGravity: StackHeaderTitleHorizontalGravityAndroid;
  menu: MenuOption;
}

const DEFAULT_CONFIG: Config = {
  direction: 'inherit',
  type: 'small',
  centerSubview: false,
  titleCentered: false,
  subtitleCentered: false,
  expandedTitleHorizontalGravity: 'start',
  collapsedTitleHorizontalGravity: 'start',
  menu: 'none',
};

const ConfigContext = React.createContext<{
  config: Config;
  updateConfig: <K extends keyof Config>(key: K, value: Config[K]) => void;
  setConfig: (config: Config) => void;
}>({
  config: DEFAULT_CONFIG,
  updateConfig: () => {},
  setConfig: () => {},
});

function makeProbe(label: string) {
  return {
    render: () => (
      <View style={styles.probe}>
        <Text style={styles.probeLabel}>{`${label}·${PROBE_WIDTH}`}</Text>
      </View>
    ),
  };
}

function buildMenu(
  option: MenuOption,
): StackHeaderToolbarMenuBaseAndroid | undefined {
  if (option === 'none') {
    return undefined;
  }

  return {
    children: [
      {
        type: 'menuItem',
        id: 'action-1',
        title: 'Act',
        showAsAction: 'always',
      },
      { type: 'menuItem', id: 'overflow-1', title: 'Overflow one' },
      { type: 'menuItem', id: 'overflow-2', title: 'Overflow two' },
    ],
  };
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  const isSmall = config.type === 'small';

  return {
    title: 'Direction',
    subtitle: 'Subtitle',
    android: {
      type: config.type,
      titleCentered: config.titleCentered,
      subtitleCentered: config.subtitleCentered,
      expandedTitleHorizontalGravity: config.expandedTitleHorizontalGravity,
      collapsedTitleHorizontalGravity: config.collapsedTitleHorizontalGravity,
      leadingSubview: makeProbe('L'),
      // Center subviews are supported only by the small header.
      centerSubview:
        isSmall && config.centerSubview ? makeProbe('C') : undefined,
      trailingSubview: makeProbe('T'),
      toolbarMenu: buildMenu(config.menu),
      // Keeps the collapsed state of the large header reachable from any offset.
      scrollFlagEnterAlways: isSmall ? undefined : true,
    },
  };
}

function TestStackLayoutDirection() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  const updateConfig = useCallback(
    <K extends keyof Config>(key: K, value: Config[K]) => {
      setConfig(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  return (
    <ConfigContext.Provider value={{ config, updateConfig, setConfig }}>
      <StackContainer
        direction={config.direction}
        routeConfigs={[
          { name: 'Root', element: <ConfigScreen /> },
          { name: 'Pushed', element: <ConfigScreen /> },
        ]}
      />
    </ConfigContext.Provider>
  );
}

function ConfigControls() {
  const { config, updateConfig, setConfig } = useContext(ConfigContext);
  const [forceRtl, setForceRtl] = useState(I18nManager.isRTL);
  const isSmall = config.type === 'small';

  useEffect(() => {
    I18nManager.forceRTL(forceRtl);
  }, [forceRtl]);

  return (
    <>
      <Text style={styles.heading}>React Native</Text>
      <Text style={styles.readout}>
        {`I18nManager.isRTL == ${I18nManager.isRTL}`}
      </Text>
      <SettingsSwitch
        testID="layout-direction-force-rtl-switch"
        label="forceRTL"
        value={forceRtl}
        onValueChange={setForceRtl}
      />

      <Text style={styles.heading}>StackHost</Text>
      <SettingsPicker<StackHostDirection>
        testID="direction-picker"
        label="direction"
        value={config.direction}
        onValueChange={v => updateConfig('direction', v)}
        items={DIRECTIONS}
      />

      <Text style={styles.heading}>Header</Text>
      <SettingsPicker<StackHeaderTypeAndroid>
        testID="header-type-picker"
        label="type"
        value={config.type}
        onValueChange={v => updateConfig('type', v)}
        items={HEADER_TYPES}
      />
      <SettingsPicker<MenuOption>
        testID="menu-picker"
        label="menu"
        value={config.menu}
        onValueChange={v => updateConfig('menu', v)}
        items={MENU_OPTIONS}
      />
      {isSmall ? (
        <>
          <SettingsSwitch
            testID="title-centered-switch"
            label="titleCentered"
            value={config.titleCentered}
            onValueChange={v => updateConfig('titleCentered', v)}
          />
          <SettingsSwitch
            testID="subtitle-centered-switch"
            label="subtitleCentered"
            value={config.subtitleCentered}
            onValueChange={v => updateConfig('subtitleCentered', v)}
          />
          <SettingsSwitch
            testID="center-subview-switch"
            label="centerSubview"
            value={config.centerSubview}
            onValueChange={v => updateConfig('centerSubview', v)}
          />
        </>
      ) : (
        <>
          <SettingsPicker<StackHeaderTitleHorizontalGravityAndroid>
            testID="expanded-title-gravity-picker"
            label="expandedTitleHorizontalGravity"
            value={config.expandedTitleHorizontalGravity}
            onValueChange={v =>
              updateConfig('expandedTitleHorizontalGravity', v)
            }
            items={HORIZONTAL_GRAVITY_OPTIONS}
          />
          <SettingsPicker<StackHeaderTitleHorizontalGravityAndroid>
            testID="collapsed-title-gravity-picker"
            label="collapsedTitleHorizontalGravity"
            value={config.collapsedTitleHorizontalGravity}
            onValueChange={v =>
              updateConfig('collapsedTitleHorizontalGravity', v)
            }
            items={HORIZONTAL_GRAVITY_OPTIONS}
          />
        </>
      )}
      <Button title="Reset" onPress={() => setConfig(DEFAULT_CONFIG)} />
    </>
  );
}

// Makes the screen content's own direction readable without measuring the
// header: the row is laid out by Yoga, so START/END swap sides with it.
function ContentDirectionMarker() {
  return (
    <View style={styles.marker}>
      <Text style={styles.markerLabel}>START</Text>
      <Text style={styles.markerLabel}>END</Text>
    </View>
  );
}

function useApplyHeaderConfig() {
  const { config } = useContext(ConfigContext);
  const { setRouteOptions, routeKey } = useStackNavigationContext();
  const headerConfig = useMemo(() => buildHeaderConfig(config), [config]);

  useEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);
}

function ConfigScreen() {
  const { push } = useStackNavigationContext();
  useApplyHeaderConfig();

  return (
    <ScrollViewMarker style={styles.scrollViewMarker}>
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        // The controls stick below the header so they stay reachable at any
        // scroll offset.
        testID="layout-direction-scrollview">
        <ContentDirectionMarker />
        <ConfigControls />
        <Text style={styles.heading}>Navigation</Text>
        <Button title={PUSH_LABEL} onPress={() => push('Pushed')} />
        <LongText size="lg" />
        {/* Bottom sentinel: lets e2e assert the content actually scrolled. */}
        <Text testID="layout-direction-bottom-marker">End of content</Text>
      </ScrollView>
    </ScrollViewMarker>
  );
}

const styles = StyleSheet.create({
  scrollViewMarker: {
    flex: 1,
  },
  scroll: {
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 16,
    gap: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  readout: {
    fontSize: 13,
    marginBottom: 4,
  },
  marker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 8,
  },
  markerLabel: {
    fontWeight: 'bold',
  },
  probe: {
    width: PROBE_WIDTH,
    height: PROBE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.PurpleLight60,
  },
  probeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default createScenario(TestStackLayoutDirection, scenarioDescription);
