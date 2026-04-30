import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import { ShiftTransition } from '../../../../../../react-navigation/packages/bottom-tabs/src/TransitionConfigs/TransitionPresets';

const SHORT_TITLE = 'Title';
const LONG_TITLE = 'A quick brown fox jumped over the lazy dog';

const HIT_SLOP_VALUES = ['0', '10', '30'];
const PRESS_RETENTION_VALUES = ['0', '20', '50'];
const TITLE_OPTIONS = ['short', 'long', 'view'];

type HitSlopValue = (typeof HIT_SLOP_VALUES)[number];
type PressRetentionValue = (typeof PRESS_RETENTION_VALUES)[number];
type TitleOption = (typeof TITLE_OPTIONS)[number];

interface PressableProps {
  hitSlop: number;
  pressRetentionOffset: number;
}

interface PressablePropsContext {
  setPressableProps: (value: PressableProps) => void;
  pressableProps: PressableProps;
}

const PressableContext = createContext<PressablePropsContext | null>(null);

function ItemBlueComponent() {
  const { pressableProps } = useContext(PressableContext)!;

  return (
    <PressableWithFeedback
      {...pressableProps}
      style={{ width: 30, height: 30, backgroundColor: 'blue' }}
    />
  );
}

function HorizontalGreenItem() {
  const { pressableProps } = useContext(PressableContext)!;

  return (
    <PressableWithFeedback
      {...pressableProps}
      style={{ width: 100, height: 20, backgroundColor: 'green' }}
    />
  );
}

function HorizontalPinkItem() {
  const { pressableProps } = useContext(PressableContext)!;

  return (
    <PressableWithFeedback
      {...pressableProps}
      style={{ width: 80, height: 10, backgroundColor: 'pink' }}
    />
  );
}

function ItemRedComponent() {
  const { pressableProps } = useContext(PressableContext)!;

  return (
    <PressableWithFeedback
      {...pressableProps}
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

interface Config {
  enabled: boolean;
  hidden: boolean;
  largeTitleEnabled: boolean;
  title: TitleOption;
  subtitle: TitleOption;
  hitSlop: HitSlopValue;
  pressRetentionOffset: PressRetentionValue;
}

const DEFAULT_CONFIG: Config = {
  enabled: true,
  hidden: false,
  largeTitleEnabled: false,
  title: 'short',
  subtitle: 'short',
  hitSlop: '0',
  pressRetentionOffset: '0',
};

export function App() {
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
        ]}
      />
    </PressableContext.Provider>
  );
}

function buildHeaderConfig(config: Config): StackHeaderConfigProps | undefined {
  if (!config.enabled) {
    return undefined;
  }

  return {
    title: config.title === 'short' ? SHORT_TITLE : LONG_TITLE,
    subtitle: config.subtitle === 'short' ? SHORT_TITLE : LONG_TITLE,
    hidden: config.hidden,
    ios: {
      largeTitleEnabled: config.largeTitleEnabled,
      titleItem:
        config.title === 'view'
          ? {
              key: 'title',
              component: HorizontalGreenItem,
            }
          : undefined,
      subtitleItem:
        config.subtitle === 'view'
          ? {
              key: 'subtitle',
              component: HorizontalPinkItem,
            }
          : undefined,
      largeSubtitleItem:
        config.subtitle === 'view'
          ? {
              key: 'largeSubtitle',
              component: HorizontalGreenItem,
            }
          : undefined,
      leftItems: [
        {
          key: 'left-0',
          component: ItemRedComponent,
        },
        { key: 'left-1', spacer: 'fixed', width: 100 },
        {
          key: 'left-2',
          component: ItemRedComponent,
        },
        {
          key: 'left-3',
          component: ItemBlueComponent,
        },
        { key: 'left-4', label: 'An item' },
      ],
      rightItems: [
        {
          key: 'right-0',
          component: ItemRedComponent,
        },
      ],
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

  useEffect(() => {
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
