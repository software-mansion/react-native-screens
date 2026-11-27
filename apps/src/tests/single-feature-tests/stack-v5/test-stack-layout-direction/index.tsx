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
  Platform,
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
  type StackDirection,
  ScrollViewMarker,
} from 'react-native-screens';

// Probes are fixed-width boxes with their width printed on them: the edge a
// probe sits on is the whole point of this test, so they must be
// distinguishable from the title and from each other at a glance.
const PROBE_WIDTH = 48;
const PROBE_HEIGHT = 32;

const PUSH_LABEL = 'Push screen (adds a back button)';
const PUSH_NESTED_LABEL = 'Push nested stack';

// Each picker's options are the single source of truth; the option union type is
// derived from the array so the two can never drift apart.
const options = <const T extends string>(...values: T[]): T[] => values;

const DIRECTIONS: StackDirection[] = ['inherit', 'ltr', 'rtl'];
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
  // Omitted keeps the StackContainer default, which follows I18nManager.isRTL.
  direction?: StackDirection;
  type: StackHeaderTypeAndroid;
  centerSubview: boolean;
  titleCentered: boolean;
  subtitleCentered: boolean;
  expandedTitleHorizontalGravity: StackHeaderTitleHorizontalGravityAndroid;
  collapsedTitleHorizontalGravity: StackHeaderTitleHorizontalGravityAndroid;
  menu: MenuOption;
}

const DEFAULT_CONFIG: Config = {
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
    ios: {
      leadingItems: [{ type: 'item', id: 'leading-probe', ...makeProbe('L') }],
      trailingItems: [
        { type: 'item', id: 'trailing-probe', ...makeProbe('T') },
      ],
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
        {...(config.direction !== undefined && {
          direction: config.direction,
        })}
        routeConfigs={[
          { name: 'Root', element: <ConfigScreen /> },
          { name: 'Pushed', element: <ConfigScreen /> },
          {
            name: 'Nested',
            element: <NestedStackScreen />,
            options: { headerConfig: { title: 'Outer' } },
          },
        ]}
      />
    </ConfigContext.Provider>
  );
}

function ConfigControls() {
  const { config, updateConfig, setConfig } = useContext(ConfigContext);
  // React Native stores both values across launches but exposes neither, so
  // the switches start from `isRTL` and React Native's default and write only
  // when toggled.
  const [forceRtl, setForceRtl] = useState(I18nManager.isRTL);
  const [allowRtl, setAllowRtl] = useState(true);

  const onForceRtlChange = (value: boolean) => {
    setForceRtl(value);
    I18nManager.forceRTL(value);
  };

  const onAllowRtlChange = (value: boolean) => {
    setAllowRtl(value);
    I18nManager.allowRTL(value);
  };

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
        onValueChange={onForceRtlChange}
      />
      <SettingsSwitch
        testID="layout-direction-allow-rtl-switch"
        label="allowRTL"
        value={allowRtl}
        onValueChange={onAllowRtlChange}
      />

      <Text style={styles.heading}>StackHost</Text>
      <SettingsPicker<StackDirection>
        testID="direction-picker"
        label="direction"
        value={config.direction ?? (I18nManager.isRTL ? 'rtl' : 'ltr')}
        onValueChange={v => updateConfig('direction', v)}
        items={DIRECTIONS}
      />

      {Platform.OS === 'android' ? <AndroidHeaderControls /> : null}
      <Button title="Reset" onPress={() => setConfig(DEFAULT_CONFIG)} />
    </>
  );
}

function AndroidHeaderControls() {
  const { config, updateConfig } = useContext(ConfigContext);
  const isSmall = config.type === 'small';

  return (
    <>
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
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}
        contentContainerStyle={styles.content}
        // The controls stick below the header so they stay reachable at any
        // scroll offset.
        testID="layout-direction-scrollview">
        <ContentDirectionMarker />
        <ConfigControls />
        <Text style={styles.heading}>Navigation</Text>
        <Button title={PUSH_LABEL} onPress={() => push('Pushed')} />
        <Button title={PUSH_NESTED_LABEL} onPress={() => push('Nested')} />
        <LongText size="lg" />
        {/* Bottom sentinel: lets e2e assert the content actually scrolled. */}
        <Text testID="layout-direction-bottom-marker">End of content</Text>
      </ScrollView>
    </ScrollViewMarker>
  );
}

// A stack inside a screen of the outer stack, with its own direction: it shows
// whether `inherit` follows the outer stack.
function NestedStackScreen() {
  const [direction, setDirection] = useState<StackDirection | undefined>(
    undefined,
  );

  return (
    <NestedDirectionContext.Provider value={{ direction, setDirection }}>
      <StackContainer
        {...(direction !== undefined && { direction })}
        routeConfigs={[{ name: 'NestedRoot', element: <NestedScreen /> }]}
      />
    </NestedDirectionContext.Provider>
  );
}

const NestedDirectionContext = React.createContext<{
  direction: StackDirection | undefined;
  setDirection: (direction: StackDirection) => void;
}>({ direction: undefined, setDirection: () => {} });

const NESTED_HEADER_CONFIG: StackHeaderConfigProps = {
  title: 'Nested',
  ios: {
    leadingItems: [{ type: 'item', id: 'nested-probe', ...makeProbe('L') }],
  },
  android: { leadingSubview: makeProbe('L') },
};

function NestedScreen() {
  const { direction, setDirection } = useContext(NestedDirectionContext);
  const { setRouteOptions, routeKey } = useStackNavigationContext();

  useEffect(() => {
    setRouteOptions(routeKey, { headerConfig: NESTED_HEADER_CONFIG });
  }, [setRouteOptions, routeKey]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scroll}
      contentContainerStyle={styles.content}>
      <ContentDirectionMarker />
      <SettingsPicker<StackDirection>
        testID="nested-direction-picker"
        label="nested direction"
        value={direction ?? (I18nManager.isRTL ? 'rtl' : 'ltr')}
        onValueChange={setDirection}
        items={DIRECTIONS}
      />
    </ScrollView>
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
