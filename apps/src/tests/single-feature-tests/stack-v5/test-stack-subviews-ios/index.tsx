import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createScenario,
  ScenarioDescription,
} from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { StackHeaderConfigProps } from 'react-native-screens/components/gamma/stack/header';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { ScrollView, StyleSheet } from 'react-native';
import { SettingsSwitch } from '@apps/shared/SettingsSwitch';
import { SettingsPicker } from '@apps/shared/SettingsPicker';
import { Colors } from '@apps/shared/styling';

const SHORT_TITLE = 'Title';
const LONG_TITLE = 'A quick brown fox jumped over the lazy dog';

const HIT_SLOP_VALUES: HitSlopValue[] = ['0', '10', '30'];
const PRESS_RETENTION_VALUES: PressRetentionValue[] = ['0', '20', '50'];
const TITLE_OPTIONS: TitleOption[] = ['short', 'long'];

interface PressableProps {
  hitSlop: number;
  pressRetentionOffset: number;
}

function ItemBlueComponent(props: PressableProps) {
  return (
    <PressableWithFeedback
      hitSlop={props.hitSlop}
      pressRetentionOffset={props.pressRetentionOffset}
      style={{ width: 30, height: 30, backgroundColor: 'blue' }}
    />
  );
}

function HorizontalGreenItem(props: PressableProps) {
  return (
    <PressableWithFeedback
      hitSlop={props.hitSlop}
      pressRetentionOffset={props.pressRetentionOffset}
      style={{ width: 100, height: 20, backgroundColor: 'green' }}
    />
  );
}

function HorizontalPinkItem(props: PressableProps) {
  return (
    <PressableWithFeedback
      hitSlop={props.hitSlop}
      pressRetentionOffset={props.pressRetentionOffset}
      style={{ width: 80, height: 10, backgroundColor: 'pink' }}
    />
  );
}

function ItemRedComponent(props: PressableProps) {
  return (
    <PressableWithFeedback
      hitSlop={props.hitSlop}
      pressRetentionOffset={props.pressRetentionOffset}
      style={{
        width: 20,
        height: 20,
        backgroundColor: 'red',
      }}
    />
  );
}

const scenarioDescription: ScenarioDescription = {
  name: 'Stack Subviews',
  key: 'test-stack-subviews-ios',
  details: 'Tests header config and subview customization.',
  platforms: ['ios'],
};

type HitSlopValue = '0' | '10' | '30';
type PressRetentionValue = '0' | '20' | '50';
type TitleOption = 'short' | 'long';

interface Config {
  enabled: boolean;
  hidden: boolean;
  title: TitleOption;
  hitSlop: HitSlopValue;
  pressRetentionOffset: PressRetentionValue;
}

const DEFAULT_CONFIG: Config = {
  enabled: true,
  hidden: false,
  title: 'short',
  hitSlop: '0',
  pressRetentionOffset: '0',
};

export function App() {
  return <StackSetup />;
}

function StackSetup() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          Component: ConfigScreen,
          options: {},
        },
      ]}
    />
  );
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps | undefined {
  if (!config.enabled) {
    return undefined;
  }

  const hitSlop = Number(config.hitSlop);
  const pressRetentionOffset = Number(config.pressRetentionOffset);

  const pressableProps: PressableProps = {
    hitSlop,
    pressRetentionOffset,
  };

  return {
    title: config.title === 'short' ? SHORT_TITLE : LONG_TITLE,
    hidden: config.hidden,
    ios: {
      largeTitleEnabled: true,
      titleItem: {
        key: 'title',
        component: () => <HorizontalGreenItem {...pressableProps} />,
      },
      subtitleItem: {
        key: 'subtitle',
        component: () => <HorizontalPinkItem {...pressableProps} />,
      },
      largeSubtitleItem: {
        key: 'largeSubtitle',
        component: () => <HorizontalGreenItem {...pressableProps} />,
      },
      leftItems: [
        {
          key: 'left-0',
          component: () => <ItemRedComponent {...pressableProps} />,
        },
        { key: 'left-1', spacer: 'fixed', width: 100 },
        {
          key: 'left-2',
          component: () => <ItemRedComponent {...pressableProps} />,
        },
        {
          key: 'left-3',
          component: () => <ItemBlueComponent {...pressableProps} />,
        },
        { key: 'left-4', label: 'An item' },
      ],
      rightItems: [
        {
          key: 'right-0',
          component: () => <ItemRedComponent {...pressableProps} />,
        },
      ],
    },
  };
}

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  const updateConfig = useCallback(
    <K extends keyof Config>(key: K, value: Config[K]) => {
      setConfig(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(() => buildHeaderConfig(config), [config]);

  useEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
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
      <SettingsPicker<TitleOption>
        label="title"
        value={config.title}
        onValueChange={v => updateConfig('title', v)}
        items={TITLE_OPTIONS}
      />
      <SettingsPicker<HitSlopValue>
        label="hitSlop"
        value={config.hitSlop}
        onValueChange={v => updateConfig('hitSlop', v)}
        items={HIT_SLOP_VALUES}
      />
      <SettingsPicker<PressRetentionValue>
        label="pressRetentionOffset"
        value={config.pressRetentionOffset}
        onValueChange={v => updateConfig('pressRetentionOffset', v)}
        items={PRESS_RETENTION_VALUES}
      />
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

export default createScenario(App, scenarioDescription);
