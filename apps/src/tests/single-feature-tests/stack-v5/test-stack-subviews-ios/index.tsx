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
import { Button, ScrollView, StyleSheet } from 'react-native';
import { SettingsSwitch } from '@apps/shared/SettingsSwitch';
import { SettingsPicker } from '@apps/shared/SettingsPicker';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'Stack Subviews (iOS)',
  key: 'test-stack-subviews-ios',
  details: 'Tests header config and subview customization.',
  platforms: ['ios'],
};

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
  leftItemsCount: number;
  rightItemsCount: number;
  title: TitleOption;
  subtitle: TitleOption;
  hitSlop: HitSlopValue;
  pressRetentionOffset: PressRetentionValue;
}

const DEFAULT_CONFIG: Config = {
  enabled: true,
  hidden: false,
  largeTitleEnabled: false,
  leftItemsCount: 2,
  rightItemsCount: 2,
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

  let leftItems: NonNullable<StackHeaderConfigProps['ios']>['leftItems'] =
    Array.from({
      length: config.leftItemsCount,
    }).map((_, i) => ({
      type: 'item',
      key: `left-${i}`,
      label: `left-${i}`,
      component: ResizingItem,
    }));
  if (leftItems.length > 1) {
    leftItems.splice(1, 0, {
      type: 'spacer',
      key: 'spacer-left-1',
      sizing: 'fixed',
      width: 100,
    });
  }

  let rightItems: NonNullable<StackHeaderConfigProps['ios']>['rightItems'] =
    Array.from({ length: config.rightItemsCount }).map((_, i) => ({
      type: 'item',
      key: `right-${i}`,
      label: `right-${i}`,
      component: ResizingItem,
    }));
  if (rightItems.length > 1) {
    rightItems.splice(1, 0, {
      type: 'spacer',
      key: 'spacer-right-1',
      sizing: 'fixed',
      width: 100,
    });
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
              label: 'title',
              component: LargeHorizontalItem,
            }
          : undefined,
      subtitleItem:
        config.subtitle === 'view'
          ? {
              key: 'subtitle',
              label: 'subtitle',
              component: SmallHorizontalItem,
            }
          : undefined,
      largeSubtitleItem:
        config.subtitle === 'view'
          ? {
              key: 'largeSubtitle',
              component: LargeHorizontalItem,
            }
          : undefined,
      leftItems,
      rightItems,
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
      <Button
        title={`Toggle left items count (${config.leftItemsCount}/3)`}
        onPress={() => {
          updateConfig('leftItemsCount', (config.leftItemsCount + 1) % 4);
        }}
      />
      <Button
        title={`Toggle right items count (${config.rightItemsCount}/3)`}
        onPress={() => {
          updateConfig('rightItemsCount', (config.rightItemsCount + 1) % 4);
        }}
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
