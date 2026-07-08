import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { StackHeaderConfigProps } from 'react-native-screens/components/gamma/stack/header';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Button, ScrollView, StyleSheet } from 'react-native';
import { SettingsSwitch } from '@apps/shared/SettingsSwitch';
import { SettingsPicker } from '@apps/shared/SettingsPicker';
import { Colors } from '@apps/shared/styling';
import LongText from '@apps/shared/LongText';
import { scenarioDescription } from './scenario-description';

const SHORT_TITLE = 'Title';
const LONG_TITLE = 'A quick brown fox jumped over the lazy dog';
const VIEW_TITLE = 'Neither short nor long';

const HIT_SLOP_VALUES = ['0', '10', '30'];
const PRESS_RETENTION_VALUES = ['0', '20', '50'];
const TITLE_OPTIONS = ['short', 'long', 'view'];
const LARGE_TITLE_OPTIONS = ['none', 'short', 'long'];
const LARGE_SUBTITLE_OPTIONS = ['none', 'short', 'long', 'view'];

type HitSlopValue = (typeof HIT_SLOP_VALUES)[number];
type PressRetentionValue = (typeof PRESS_RETENTION_VALUES)[number];
type TitleOption = (typeof TITLE_OPTIONS)[number];
type LargeTitleOption = (typeof LARGE_TITLE_OPTIONS)[number];
type LargeSubtitleOption = (typeof LARGE_SUBTITLE_OPTIONS)[number];

interface PressableProps {
  hitSlop: number;
  pressRetentionOffset: number;
}

interface PressablePropsContext {
  setPressableProps: (value: PressableProps) => void;
  pressableProps: PressableProps;
}

const PressableContext = createContext<PressablePropsContext | null>(null);

function ResizingItem() {
  const { pressableProps } = useContext(PressableContext)!;
  const [large, setLarge] = useState<boolean>(false);

  return (
    <PressableWithFeedback
      onPress={() => setLarge(lg => !lg)}
      {...pressableProps}
      style={{
        width: large ? 60 : 20,
        height: large ? 30 : 20,
      }}
    />
  );
}

function LargeHorizontalItem() {
  const { pressableProps } = useContext(PressableContext)!;

  return (
    <PressableWithFeedback
      {...pressableProps}
      style={{ width: 100, height: 20 }}
    />
  );
}

function SmallHorizontalItem() {
  const { pressableProps } = useContext(PressableContext)!;

  return (
    <PressableWithFeedback
      {...pressableProps}
      style={{ width: 80, height: 10 }}
    />
  );
}

interface Config {
  enabled: boolean;
  hidden: boolean;
  largeTitleEnabled: boolean;
  largeTitle: LargeTitleOption;
  largeSubtitle: LargeSubtitleOption;
  leadingItemsCount: number;
  trailingItemsCount: number;
  title: TitleOption;
  subtitle: TitleOption;
  hitSlop: HitSlopValue;
  pressRetentionOffset: PressRetentionValue;
}

function resolveTitle(
  value: TitleOption | LargeTitleOption | LargeSubtitleOption,
) {
  switch (value) {
    case 'short':
      return SHORT_TITLE;
    case 'long':
      return LONG_TITLE;
    case 'view':
      return VIEW_TITLE;
    default:
      return undefined;
  }
}

const DEFAULT_CONFIG: Config = {
  enabled: true,
  hidden: false,
  largeTitleEnabled: false,
  largeTitle: 'none',
  largeSubtitle: 'none',
  leadingItemsCount: 2,
  trailingItemsCount: 2,
  title: 'short',
  subtitle: 'short',
  hitSlop: '0',
  pressRetentionOffset: '0',
};

function TestStackSubviewsIOS() {
  return <StackSetup />;
}

function StackSetup() {
  const [pressableProps, setPressableProps] = useState<PressableProps>({
    hitSlop: 0,
    pressRetentionOffset: 0,
  });

  return (
    <PressableContext.Provider value={{ pressableProps, setPressableProps }}>
      <StackContainer
        routeConfigs={[
          {
            name: 'Home',
            Component: ConfigScreen,
            options: {},
          },
          {
            name: 'Second',
            Component: ConfigScreen,
            options: {},
          },
        ]}
      />
    </PressableContext.Provider>
  );
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps | undefined {
  if (!config.enabled) {
    return undefined;
  }

  let leadingItems: NonNullable<StackHeaderConfigProps['ios']>['leadingItems'] =
    Array.from({
      length: config.leadingItemsCount,
    }).map((_, i) => ({
      type: 'item',
      id: `leading-${i}`,
      render: () => <ResizingItem />,
    }));
  if (leadingItems.length > 1) {
    leadingItems.splice(1, 0, {
      type: 'spacer',
      id: 'spacer-leading-1',
      sizing: 'fixed',
      width: 100,
    });
  }

  let trailingItems: NonNullable<
    StackHeaderConfigProps['ios']
  >['trailingItems'] = Array.from({ length: config.trailingItemsCount }).map(
    (_, i) => ({
      type: 'item',
      id: `trailing-${i}`,
      render: () => <ResizingItem />,
    }),
  );
  if (trailingItems.length > 1) {
    trailingItems.splice(1, 0, {
      type: 'spacer',
      id: 'spacer-trailing-1',
      sizing: 'flexible',
    });
  }

  return {
    title: resolveTitle(config.title),
    subtitle: resolveTitle(config.subtitle),
    hidden: config.hidden,
    ios: {
      largeTitleEnabled: config.largeTitleEnabled,
      largeTitle: resolveTitle(config.largeTitle),
      largeSubtitle: resolveTitle(config.largeSubtitle),
      titleItem:
        config.title === 'view'
          ? {
              id: 'title',
              render: () => <LargeHorizontalItem />,
            }
          : undefined,
      subtitleItem:
        config.subtitle === 'view'
          ? {
              id: 'subtitle',
              render: () => <SmallHorizontalItem />,
            }
          : undefined,
      largeSubtitleItem:
        config.largeSubtitle === 'view'
          ? {
              id: 'largeSubtitle',
              render: () => <LargeHorizontalItem />,
            }
          : undefined,
      leadingItems,
      trailingItems,
    },
  };
}

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const { setPressableProps } = useContext(PressableContext)!;

  const updateConfig = useCallback(
    <K extends keyof Config>(key: K, value: Config[K]) => {
      setConfig(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  useEffect(() => {
    setPressableProps({
      hitSlop: Number(config.hitSlop),
      pressRetentionOffset: Number(config.pressRetentionOffset),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.hitSlop, config.pressRetentionOffset]);

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(() => buildHeaderConfig(config), [config]);

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic">
      <SettingsSwitch
        label="headerConfig enabled"
        value={config.enabled}
        onValueChange={v => updateConfig('enabled', v)}
      />
      <SettingsSwitch
        label="hidden"
        value={config.hidden}
        onValueChange={v => updateConfig('hidden', v)}
      />
      <SettingsSwitch
        label="large header enabled"
        value={config.largeTitleEnabled}
        onValueChange={v => updateConfig('largeTitleEnabled', v)}
      />
      <SettingsPicker<TitleOption>
        label="title"
        value={config.title}
        onValueChange={v => updateConfig('title', v)}
        items={TITLE_OPTIONS}
      />
      <SettingsPicker<TitleOption>
        label="subtitle"
        value={config.subtitle}
        onValueChange={v => updateConfig('subtitle', v)}
        items={TITLE_OPTIONS}
      />
      <SettingsPicker<LargeTitleOption>
        label="large title"
        value={config.largeTitle}
        onValueChange={v => updateConfig('largeTitle', v)}
        items={LARGE_TITLE_OPTIONS}
      />
      <SettingsPicker<LargeSubtitleOption>
        label="large subtitle"
        value={config.largeSubtitle}
        onValueChange={v => updateConfig('largeSubtitle', v)}
        items={LARGE_SUBTITLE_OPTIONS}
      />
      <SettingsPicker<HitSlopValue>
        label="hit slop"
        value={config.hitSlop}
        onValueChange={v => updateConfig('hitSlop', v)}
        items={HIT_SLOP_VALUES}
      />
      <SettingsPicker<PressRetentionValue>
        label="press retention offset"
        value={config.pressRetentionOffset}
        onValueChange={v => updateConfig('pressRetentionOffset', v)}
        items={PRESS_RETENTION_VALUES}
      />
      <Button
        title={`Toggle leading items count (${config.leadingItemsCount}/3)`}
        onPress={() => {
          updateConfig('leadingItemsCount', (config.leadingItemsCount + 1) % 4);
        }}
      />
      <Button
        title={`Toggle trailing items count (${config.trailingItemsCount}/3)`}
        onPress={() => {
          updateConfig(
            'trailingItemsCount',
            (config.trailingItemsCount + 1) % 4,
          );
        }}
      />
      {routeKey.includes('Home') && (
        <Button
          title="Go to Second"
          onPress={() => navigation.push('Second')}
        />
      )}
      <LongText />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  subviewLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  backgroundContainer: {
    flex: 1,
  },
});

export default createScenario(TestStackSubviewsIOS, scenarioDescription);
