import React, { useCallback, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  useTabsNavigationContext,
  type TabRouteConfig,
  type TabRouteOptions,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  TabsScreenIconTintingAndroid,
  TabsScreenIconImageRenderingModeIOS,
} from 'react-native-screens';

type IconSizeOption = 'default' | '24' | '32' | '44' | '56';

const ICON_SIZE_OPTIONS: IconSizeOption[] = ['default', '24', '32', '44', '56'];

type IndicatorWidthOption = 'auto' | '40' | '56' | '64' | '84' | '96';

const INDICATOR_WIDTH_OPTIONS: IndicatorWidthOption[] = [
  'auto',
  '40',
  '56',
  '64',
  '84',
  '96',
];

type IndicatorHeightOption = 'auto' | '24' | '32' | '36' | '52' | '64';

const INDICATOR_HEIGHT_OPTIONS: IndicatorHeightOption[] = [
  'auto',
  '24',
  '32',
  '36',
  '52',
  '64',
];

const RENDERING_MODE_OPTIONS: TabsScreenIconImageRenderingModeIOS[] = [
  'default',
  'template',
  'original',
];

const TINTING_OPTIONS: TabsScreenIconTintingAndroid[] = [
  'default',
  'tinted',
  'original',
];

type ControlsConfig = {
  renderingMode: TabsScreenIconImageRenderingModeIOS;
  tinting: TabsScreenIconTintingAndroid;
  iconSize: IconSizeOption;
  indicatorWidth: IndicatorWidthOption;
  indicatorHeight: IndicatorHeightOption;
  hasBadge: boolean;
};

const INITIAL_CONTROLS_CONFIG: ControlsConfig = {
  renderingMode: 'template',
  tinting: 'tinted',
  iconSize: 'default',
  indicatorWidth: 'auto',
  indicatorHeight: 'auto',
  hasBadge: false,
};

function controlsRouteOptions({
  renderingMode,
  tinting,
  iconSize,
  indicatorWidth,
  indicatorHeight,
  hasBadge,
}: ControlsConfig): Partial<TabRouteOptions> {
  return {
    badgeValue: hasBadge ? '1' : undefined,
    ios: {
      icon: {
        type: 'imageSource',
        imageSource: require('@assets/variableIcons/icon.png'),
        renderingMode,
      },
    },
    android: {
      icon: {
        type: 'drawableResource',
        name: 'person_walking',
        tinting,
      },
      standardAppearance: {
        tabBarItemIconSize:
          iconSize === 'default' ? undefined : Number(iconSize),
        tabBarItemActiveIndicatorWidth:
          indicatorWidth === 'auto' ? undefined : Number(indicatorWidth),
        tabBarItemActiveIndicatorHeight:
          indicatorHeight === 'auto' ? undefined : Number(indicatorHeight),
      },
    },
  };
}

function SizedTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Per-tab icon size</Text>
      <Text style={styles.hint}>
        `icon`: drawableResource swm_logo (wide logo){'\n'}
        `tabBarItemIconSize`: 44{'\n'}
        {'\n'}
        The icon box of the whole bar fits the largest icon and the tallest
        active indicator across tabs.{'\n'}
        The logo renders at 44dp.{'\n'}
        This tab&apos;s active indicator wraps the logo: 52dp tall, its width
        capped by the tab item width.
      </Text>
    </View>
  );
}

function MulticolorTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Original colors when selected</Text>
      <Text style={styles.hint}>
        `icon`: drawableResource person_walking, `tinting` NOT set (default:
        tinted)
        {'\n'}
        `selectedIcon`: drawableResource person_walking, `tinting`: original
        {'\n'}
        `tabBarItemIconSize`: 30{'\n'}
        {'\n'}
        Selected: the walker keeps its own colors.{'\n'}
        Unselected: a single-color silhouette in the system theme color.{'\n'}
        The icon renders at 30dp, centered in the shared icon box. This
        tab&apos;s active indicator wraps the 30dp icon.
      </Text>
    </View>
  );
}

function ImageTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>
        {Platform.OS === 'ios'
          ? 'Image Source (Default)'
          : 'Image in original colors when selected'}
      </Text>
      <Text style={styles.hint}>
        {Platform.OS === 'ios' ? (
          <>
            `icon`: imageSource icon.png, `renderingMode` NOT set (default:
            original colors)
            {'\n'}
            {'\n'}
            The icon renders in its original black color in both states. The
            host <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text> tint
            is ignored.
          </>
        ) : (
          <>
            `icon`: imageSource icon.png, `tinting` NOT set (default: tinted)
            {'\n'}
            `selectedIcon`: imageSource icon.png, `tinting`: original{'\n'}
            {'\n'}
            Selected: the icon renders in its original black color.{'\n'}
            Unselected: the icon renders in the system theme color.
          </>
        )}
      </Text>
    </View>
  );
}

function ImageTemplateTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Template Image Source</Text>
      <Text style={styles.hint}>
        Host `tabBarTintColor`:{' '}
        <Text style={{ color: Colors.GreenDark100 }}>GreenDark100</Text>
        {'\n'}
        `icon`: imageSource icon.png, `renderingMode`: template{'\n'}
        {'\n'}
        The icon is used as a template image.{'\n'}
        Selected: tinted{' '}
        <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text>.{'\n'}
        Unselected: the icon renders in the system theme color.
      </Text>
    </View>
  );
}

function SymbolTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Custom SF Symbol</Text>
      <Text style={styles.hint}>
        Host `tabBarTintColor`:{' '}
        <Text style={{ color: Colors.GreenDark100 }}>GreenDark100</Text>
        {'\n'}
        `icon`: sfSymbol nano.swm, `renderingMode` NOT set (default){'\n'}
        {'\n'}
        nano.swm is a custom symbol from the app asset catalog, not a system SF
        Symbol. It resolves via the asset catalog fallback.{'\n'}
        Selected: tinted{' '}
        <Text style={{ color: Colors.GreenDark100 }}>GREEN</Text>.{'\n'}
        Unselected: the icon renders in the system theme color.
      </Text>
    </View>
  );
}

function MixedTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Original colors when selected</Text>
      <Text style={styles.hint}>
        `icon`: sfSymbol heart.fill, `renderingMode`: monochrome{'\n'}
        `selectedIcon`: sfSymbol heart.fill, `renderingMode`: original{'\n'}
        {'\n'}
        Selected: the system multicolor heart, RED, not tinted.{'\n'}
        Unselected: a single-color heart in the system theme color.
      </Text>
    </View>
  );
}

function IndicatorTab() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Explicit active indicator size</Text>
      <Text style={styles.hint}>
        `icon`: drawableResource star_big_off{'\n'}
        `selectedIcon`: drawableResource star_big_on{'\n'}
        `tabBarItemIconSize` NOT set (system default){'\n'}
        `tabBarItemActiveIndicatorWidth`: 56{'\n'}
        `tabBarItemActiveIndicatorHeight`: 36{'\n'}
        {'\n'}
        This tab&apos;s active indicator is 56x36dp. The other tabs&apos; active
        indicators wrap their own icons.{'\n'}
        The tab bar height does not change when switching tabs. Use the Controls
        tab to change the sizes at runtime.
      </Text>
    </View>
  );
}

function ControlsTab() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();
  const [config, setConfig] = useState<ControlsConfig>(INITIAL_CONTROLS_CONFIG);

  const updateConfig = useCallback(
    (changes: Partial<ControlsConfig>) => {
      const nextConfig = { ...config, ...changes };
      setConfig(nextConfig);
      setRouteOptions(routeKey, controlsRouteOptions(nextConfig));
    },
    [config, routeKey, setRouteOptions],
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.label}>Runtime icon updates</Text>
      <Text style={styles.hint}>
        {Platform.OS === 'ios'
          ? '`icon`: imageSource icon.png'
          : '`icon`: drawableResource person_walking'}
      </Text>
      {Platform.OS === 'ios' && (
        <SettingsPicker<TabsScreenIconImageRenderingModeIOS>
          testID="icon-tint-and-size-rendering-mode-picker"
          label="renderingMode"
          value={config.renderingMode}
          onValueChange={renderingMode => updateConfig({ renderingMode })}
          items={RENDERING_MODE_OPTIONS}
        />
      )}
      {Platform.OS === 'android' && (
        <>
          <SettingsPicker<TabsScreenIconTintingAndroid>
            testID="icon-tint-and-size-tinting-picker"
            label="tinting"
            value={config.tinting}
            onValueChange={tinting => updateConfig({ tinting })}
            items={TINTING_OPTIONS}
          />
          <SettingsPicker<IconSizeOption>
            testID="icon-tint-and-size-icon-size-picker"
            label="tabBarItemIconSize"
            value={config.iconSize}
            onValueChange={iconSize => updateConfig({ iconSize })}
            items={ICON_SIZE_OPTIONS}
          />
          <SettingsPicker<IndicatorWidthOption>
            testID="icon-tint-and-size-controls-indicator-width-picker"
            label="tabBarItemActiveIndicatorWidth"
            value={config.indicatorWidth}
            onValueChange={indicatorWidth => updateConfig({ indicatorWidth })}
            items={INDICATOR_WIDTH_OPTIONS}
          />
          <SettingsPicker<IndicatorHeightOption>
            testID="icon-tint-and-size-controls-indicator-height-picker"
            label="tabBarItemActiveIndicatorHeight"
            value={config.indicatorHeight}
            onValueChange={indicatorHeight => updateConfig({ indicatorHeight })}
            items={INDICATOR_HEIGHT_OPTIONS}
          />
          <SettingsSwitch
            testID="icon-tint-and-size-badge-switch"
            label="badgeValue"
            value={config.hasBadge}
            onValueChange={hasBadge => updateConfig({ hasBadge })}
          />
        </>
      )}
    </ScrollView>
  );
}

const IOS_ROUTES: TabRouteConfig[] = [
  {
    name: 'Symbol',
    Component: SymbolTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Symbol',
      ios: {
        icon: { type: 'sfSymbol', name: 'nano.swm' },
      },
    },
  },
  {
    name: 'Image',
    Component: ImageTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Image',
      ios: {
        icon: {
          type: 'imageSource',
          imageSource: require('@assets/variableIcons/icon.png'),
        },
      },
    },
  },
  {
    name: 'ImageTemplate',
    Component: ImageTemplateTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Template',
      ios: {
        icon: {
          type: 'imageSource',
          imageSource: require('@assets/variableIcons/icon.png'),
          renderingMode: 'template',
        },
      },
    },
  },
  {
    name: 'Mixed',
    Component: MixedTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Mixed',
      ios: {
        icon: {
          type: 'sfSymbol',
          name: 'heart.fill',
          renderingMode: 'monochrome',
        },
        selectedIcon: {
          type: 'sfSymbol',
          name: 'heart.fill',
          renderingMode: 'original',
        },
      },
    },
  },
  {
    name: 'Controls',
    Component: ControlsTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      ...controlsRouteOptions(INITIAL_CONTROLS_CONFIG),
      title: 'Controls',
    },
  },
];

const ANDROID_ROUTES: TabRouteConfig[] = [
  {
    name: 'Sized',
    Component: SizedTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Sized',
      android: {
        icon: { type: 'drawableResource', name: 'swm_logo' },
        standardAppearance: { tabBarItemIconSize: 44 },
      },
    },
  },
  {
    name: 'Multicolor',
    Component: MulticolorTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Multicolor',
      android: {
        icon: { type: 'drawableResource', name: 'person_walking' },
        selectedIcon: {
          type: 'drawableResource',
          name: 'person_walking',
          tinting: 'original',
        },
        standardAppearance: { tabBarItemIconSize: 30 },
      },
    },
  },
  {
    name: 'Image',
    Component: ImageTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Image',
      android: {
        icon: {
          type: 'imageSource',
          imageSource: require('@assets/variableIcons/icon.png'),
        },
        selectedIcon: {
          type: 'imageSource',
          imageSource: require('@assets/variableIcons/icon.png'),
          tinting: 'original',
        },
      },
    },
  },
  {
    name: 'Indicator',
    Component: IndicatorTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Indicator',
      android: {
        icon: { type: 'drawableResource', name: 'star_big_off' },
        selectedIcon: { type: 'drawableResource', name: 'star_big_on' },
        standardAppearance: {
          tabBarItemActiveIndicatorWidth: 56,
          tabBarItemActiveIndicatorHeight: 36,
        },
      },
    },
  },
  {
    name: 'Controls',
    Component: ControlsTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      ...controlsRouteOptions(INITIAL_CONTROLS_CONFIG),
      title: 'Controls',
    },
  },
];

const ROUTE_CONFIGS = Platform.select({
  ios: IOS_ROUTES,
  android: ANDROID_ROUTES,
  default: IOS_ROUTES,
});

function TestTabsItemIconTintAndSize() {
  return (
    <TabsContainerWithHostConfigContext
      routeConfigs={ROUTE_CONFIGS}
      ios={{ tabBarTintColor: Colors.GreenDark100 }}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: Colors.LightOffNavy,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default createScenario(TestTabsItemIconTintAndSize, scenarioDescription);
