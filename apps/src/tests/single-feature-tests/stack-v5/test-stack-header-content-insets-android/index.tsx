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
  type StackHeaderTypeAndroid,
  type StackHeaderTitleHorizontalGravityAndroid,
  type StackHeaderCollapsedTitleGravityModeAndroid,
  type StackHeaderToolbarMenuElementAndroid,
  ScrollViewMarker,
} from 'react-native-screens';

const HEADER_TITLE = I18nManager.isRTL ? 'الحواف' : 'Insets';

// Probes are rulers: a fixed dp width, printed on them, to judge offsets
// against. Note the toolbar lays the title out before start-gravity children,
// so on `small` the leading probe follows the title rather than the inset.
const RULER_PROBE_WIDTH = 40;
const WIDE_PROBE_WIDTH = 160;
const PROBE_HEIGHT = 32;

const LEADING_PROBE_ID = 'content-insets-leading-probe';
const CENTER_PROBE_ID = 'content-insets-center-probe';
const TRAILING_PROBE_ID = 'content-insets-trailing-probe';

// Each picker's options are the single source of truth; the option union type is
// derived from the array so the two can never drift apart.
const options = <const T extends string>(...values: T[]): T[] => values;

const DP_VALUES = options('default', '0', '16', '32', '64', '96');
const PROBE_SIZES = options('none', 'ruler', 'wide');
const CENTER_PROBE_SIZES = options('none', 'ruler');
const MENU_ITEMS_VALUES = options('0', '1', '2');
const HEADER_TYPES: StackHeaderTypeAndroid[] = ['small', 'medium', 'large'];
const HORIZONTAL_GRAVITY_OPTIONS: StackHeaderTitleHorizontalGravityAndroid[] = [
  'start',
  'center',
  'end',
];
const GRAVITY_MODES: StackHeaderCollapsedTitleGravityModeAndroid[] = [
  'entireSpace',
  'availableSpace',
];

export type DpValue = (typeof DP_VALUES)[number];
export type ProbeSize = (typeof PROBE_SIZES)[number];
export type CenterProbeSize = (typeof CENTER_PROBE_SIZES)[number];
export type MenuItemsValue = (typeof MENU_ITEMS_VALUES)[number];

interface Config {
  contentInsetStart: DpValue;
  contentInsetEnd: DpValue;
  type: StackHeaderTypeAndroid;
  titleCentered: boolean;
  collapsedTitleHorizontalGravity: StackHeaderTitleHorizontalGravityAndroid;
  collapsedTitleGravityMode: StackHeaderCollapsedTitleGravityModeAndroid;
  backButtonHidden: boolean;
  menuItems: MenuItemsValue;
  leadingSubview: ProbeSize;
  centerSubview: CenterProbeSize;
  trailingSubview: ProbeSize;
}

const DEFAULT_CONFIG: Config = {
  contentInsetStart: 'default',
  contentInsetEnd: 'default',
  type: 'small',
  titleCentered: false,
  collapsedTitleHorizontalGravity: 'start',
  collapsedTitleGravityMode: 'availableSpace',
  backButtonHidden: false,
  menuItems: '0',
  leadingSubview: 'ruler',
  centerSubview: 'none',
  trailingSubview: 'ruler',
};

// The reason the props exist: with `availableSpace` the collapsed title is
// centered within the inset-shrunk content area, so it reads as off-center
// until the insets are zeroed. Subviews stay off so the title is alone.
const OFF_CENTER_PRESET: Config = {
  ...DEFAULT_CONFIG,
  type: 'large',
  collapsedTitleHorizontalGravity: 'center',
  collapsedTitleGravityMode: 'availableSpace',
  leadingSubview: 'none',
  trailingSubview: 'none',
};

const FIXED_PRESET: Config = {
  ...OFF_CENTER_PRESET,
  contentInsetStart: '0',
  contentInsetEnd: '0',
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

function resolveDp(value: DpValue): number | undefined {
  return value === 'default' ? undefined : Number(value);
}

function probeWidth(size: Exclude<ProbeSize, 'none'>): number {
  return size === 'wide' ? WIDE_PROBE_WIDTH : RULER_PROBE_WIDTH;
}

function makeProbe(size: ProbeSize, label: string, testID: string) {
  if (size === 'none') {
    return undefined;
  }

  const width = probeWidth(size);

  return {
    render: () => (
      <View testID={testID} style={[styles.probe, { width }]}>
        <Text style={styles.probeLabel}>{`${label}·${width}`}</Text>
      </View>
    ),
  };
}

function buildMenuItems(
  count: MenuItemsValue,
): StackHeaderToolbarMenuElementAndroid[] {
  return Array.from({ length: Number(count) }, (_, i) => ({
    type: 'menuItem',
    id: `menu-item-${i}`,
    title: `M${i}`,
    showAsAction: 'always',
  }));
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps {
  return {
    title: HEADER_TITLE,
    backButtonHidden: config.backButtonHidden,
    android: {
      type: config.type,
      contentInsetStart: resolveDp(config.contentInsetStart),
      contentInsetEnd: resolveDp(config.contentInsetEnd),
      titleCentered: config.titleCentered,
      collapsedTitleHorizontalGravity: config.collapsedTitleHorizontalGravity,
      collapsedTitleGravityMode: config.collapsedTitleGravityMode,
      leadingSubview: makeProbe(config.leadingSubview, 'L', LEADING_PROBE_ID),
      // Center subviews are supported only by the small header.
      centerSubview:
        config.type === 'small'
          ? makeProbe(config.centerSubview, 'C', CENTER_PROBE_ID)
          : undefined,
      trailingSubview: makeProbe(
        config.trailingSubview,
        'T',
        TRAILING_PROBE_ID,
      ),
      toolbarMenu:
        config.menuItems === '0'
          ? undefined
          : { children: buildMenuItems(config.menuItems) },
      // Keeps the collapsed state of medium/large reachable from any offset.
      scrollFlagEnterAlways: config.type === 'small' ? undefined : true,
    },
  };
}

function TestStackHeaderContentInsets() {
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
        routeConfigs={[
          { name: 'Root', element: <RootScreen /> },
          { name: 'Pushed', element: <PushedScreen /> },
        ]}
      />
    </ConfigContext.Provider>
  );
}

function Presets() {
  const { setConfig } = useContext(ConfigContext);

  return (
    <View style={styles.presets}>
      <Button
        title="Reset"
        testID="content-insets-preset-reset"
        onPress={() => setConfig(DEFAULT_CONFIG)}
      />
      <Button
        title="Off-center collapsed title"
        testID="content-insets-preset-off-center"
        onPress={() => setConfig(OFF_CENTER_PRESET)}
      />
      <Button
        title="Fixed with insets"
        testID="content-insets-preset-fixed"
        onPress={() => setConfig(FIXED_PRESET)}
      />
    </View>
  );
}

function RtlControls() {
  const [forceRtl, setForceRtl] = useState(I18nManager.isRTL);

  useEffect(() => {
    I18nManager.forceRTL(forceRtl);
  }, [forceRtl]);

  return (
    <>
      <Text style={styles.heading}>Layout direction</Text>
      <Text style={styles.note}>
        contentInsetStart/End are relative, so they swap under RTL. Restart or
        reload the app after toggling.
      </Text>
      <Text style={styles.note} testID="content-insets-is-rtl">
        {`I18nManager.isRTL == ${I18nManager.isRTL}`}
      </Text>
      <SettingsSwitch
        testID="content-insets-force-rtl-switch"
        label="forceRTL"
        value={forceRtl}
        onValueChange={setForceRtl}
      />
    </>
  );
}

function ConfigControls() {
  const { config, updateConfig } = useContext(ConfigContext);

  return (
    <>
      <Text style={styles.heading}>Presets</Text>
      <Presets />

      <Text style={styles.heading}>Content insets</Text>
      <SettingsPicker<DpValue>
        testID="content-inset-start-picker"
        label="contentInsetStart"
        value={config.contentInsetStart}
        onValueChange={v => updateConfig('contentInsetStart', v)}
        items={DP_VALUES}
      />
      <SettingsPicker<DpValue>
        testID="content-inset-end-picker"
        label="contentInsetEnd"
        value={config.contentInsetEnd}
        onValueChange={v => updateConfig('contentInsetEnd', v)}
        items={DP_VALUES}
      />

      <Text style={styles.heading}>Header</Text>
      <SettingsPicker<StackHeaderTypeAndroid>
        testID="header-type-picker"
        label="type"
        value={config.type}
        onValueChange={v => updateConfig('type', v)}
        items={HEADER_TYPES}
      />
      <SettingsSwitch
        testID="title-centered-switch"
        label="titleCentered"
        value={config.titleCentered}
        onValueChange={v => updateConfig('titleCentered', v)}
      />
      <SettingsPicker<StackHeaderTitleHorizontalGravityAndroid>
        testID="collapsed-title-gravity-picker"
        label="collapsedTitleHorizontalGravity"
        value={config.collapsedTitleHorizontalGravity}
        onValueChange={v => updateConfig('collapsedTitleHorizontalGravity', v)}
        items={HORIZONTAL_GRAVITY_OPTIONS}
      />
      <SettingsPicker<StackHeaderCollapsedTitleGravityModeAndroid>
        testID="collapsed-title-gravity-mode-picker"
        label="collapsedTitleGravityMode"
        value={config.collapsedTitleGravityMode}
        onValueChange={v => updateConfig('collapsedTitleGravityMode', v)}
        items={GRAVITY_MODES}
      />
      <SettingsSwitch
        testID="back-button-hidden-switch"
        label="backButtonHidden"
        value={config.backButtonHidden}
        onValueChange={v => updateConfig('backButtonHidden', v)}
      />
      <SettingsPicker<MenuItemsValue>
        testID="menu-items-picker"
        label="menuItems"
        value={config.menuItems}
        onValueChange={v => updateConfig('menuItems', v)}
        items={MENU_ITEMS_VALUES}
      />

      <Text style={styles.heading}>Probe subviews</Text>
      <Text style={styles.note}>
        {`Fixed-width rulers (${RULER_PROBE_WIDTH}dp / ${WIDE_PROBE_WIDTH}dp). The trailing gap is the end inset. On small the title is laid out first, so the title marks the start inset and the leading probe follows it.`}
      </Text>
      <SettingsPicker<ProbeSize>
        testID="leading-subview-picker"
        label="leadingSubview"
        value={config.leadingSubview}
        onValueChange={v => updateConfig('leadingSubview', v)}
        items={PROBE_SIZES}
      />
      <SettingsPicker<CenterProbeSize>
        testID="center-subview-picker"
        label="centerSubview"
        value={config.centerSubview}
        onValueChange={v => updateConfig('centerSubview', v)}
        items={CENTER_PROBE_SIZES}
      />
      <SettingsPicker<ProbeSize>
        testID="trailing-subview-picker"
        label="trailingSubview"
        value={config.trailingSubview}
        onValueChange={v => updateConfig('trailingSubview', v)}
        items={PROBE_SIZES}
      />

      <RtlControls />
    </>
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

function ConfigScreen({ pushTitle }: { pushTitle: string }) {
  const { push } = useStackNavigationContext();
  useApplyHeaderConfig();

  return (
    <ScrollViewMarker style={styles.scrollViewMarker}>
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        testID="content-insets-scrollview">
        <ConfigControls />
        <Text style={styles.heading}>Navigation</Text>
        <Button title={pushTitle} onPress={() => push('Pushed')} />
        <LongText size="lg" />
        {/* Bottom sentinel: lets e2e assert the content actually scrolled. */}
        <Text testID="content-insets-bottom-marker">End of content</Text>
      </ScrollView>
    </ScrollViewMarker>
  );
}

function RootScreen() {
  return <ConfigScreen pushTitle="Push screen (adds a back button)" />;
}

function PushedScreen() {
  return <ConfigScreen pushTitle="Push another" />;
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
  note: {
    fontSize: 13,
    marginBottom: 4,
  },
  presets: {
    gap: 4,
  },
  probe: {
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

export default createScenario(
  TestStackHeaderContentInsets,
  scenarioDescription,
);
