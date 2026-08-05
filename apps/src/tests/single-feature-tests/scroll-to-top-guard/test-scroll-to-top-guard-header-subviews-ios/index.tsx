import React, {
  useLayoutEffect,
  useMemo,
  useState,
  type ReactElement,
} from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScrollToTopGuard } from 'react-native-screens/experimental';
import { StackHeaderConfigProps } from 'react-native-screens/components/gamma/stack/header';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { SettingsSwitch, SettingsPicker } from '@apps/shared';
import LongText from '@apps/shared/LongText';
import { Colors } from '@apps/shared/styling';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';

const HIT_SLOP_VALUES = ['0', '10', '30'] as const;
type HitSlopValue = (typeof HIT_SLOP_VALUES)[number];

// Per-subview configuration.
interface SubviewConfig {
  guarded: boolean;
  hitSlop: HitSlopValue;
}

const DEFAULT_SUBVIEW_CONFIG: SubviewConfig = {
  guarded: true,
  hitSlop: '0',
};

// Builds the header subview element. When `guarded` is set, the button is
// wrapped in <ScrollToTopGuard> so tapping it does NOT scroll the underlying
// list to top on iPadOS 26+ / iPhone iOS 27+.
//
// The `key` (composed from the config) forces a full remount of the subview
// whenever a value changes. This is required because the guard / hitSlop are
// applied when the native subview mounts and do not update in place (the same
// remount-by-key pattern is used in Test3446 and test-stack-subviews-ios).
function renderSubview(label: string, config: SubviewConfig): ReactElement {
  const button = (
    <PressableWithFeedback
      onPress={() => console.log(`${label} pressed`)}
      hitSlop={Number(config.hitSlop)}
      pressRetentionOffset={0}>
      <Text>{label}</Text>
    </PressableWithFeedback>
  );

  const key = `${config.guarded}_${config.hitSlop}`;

  if (config.guarded) {
    return <ScrollToTopGuard key={key}>{button}</ScrollToTopGuard>;
  }

  return <View key={key}>{button}</View>;
}

interface SubviewSettingsProps {
  label: string;
  config: SubviewConfig;
  onChange: (config: SubviewConfig) => void;
}

function SubviewSettings({ label, config, onChange }: SubviewSettingsProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeading}>{label}</Text>
      <SettingsSwitch
        label="guarded"
        value={config.guarded}
        onValueChange={value => onChange({ ...config, guarded: value })}
      />
      <SettingsPicker<HitSlopValue>
        label="hitSlop"
        value={config.hitSlop}
        onValueChange={value => onChange({ ...config, hitSlop: value })}
        items={[...HIT_SLOP_VALUES]}
      />
    </View>
  );
}

function Screen1() {
  const { routeKey, setRouteOptions } = useStackNavigationContext();

  const [left, setLeft] = useState<SubviewConfig>(DEFAULT_SUBVIEW_CONFIG);
  const [right, setRight] = useState<SubviewConfig>(DEFAULT_SUBVIEW_CONFIG);
  const [title, setTitle] = useState<SubviewConfig>(DEFAULT_SUBVIEW_CONFIG);

  const headerConfig = useMemo<StackHeaderConfigProps>(
    () => ({
      transparent: true,
      ios: {
        titleItem: {
          id: 'title',
          render: () => renderSubview('Title', title),
        },
        leadingItems: [
          {
            type: 'item',
            id: 'left',
            render: () => renderSubview('Left', left),
          },
        ],
        trailingItems: [
          {
            type: 'item',
            id: 'right',
            render: () => renderSubview('Right', right),
          },
        ],
      },
    }),
    [left, right, title],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.heading}>
        Use iPadOS 26+ or iPhone (iOS 27+). Scroll down, then tap a header
        subview. A subview with `guarded` enabled (wrapped in
        &lt;ScrollToTopGuard&gt;) must NOT scroll the list to top. Unguarded
        subviews and the bare header area still scroll to top.
      </Text>

      <SubviewSettings label="Left" config={left} onChange={setLeft} />
      <SubviewSettings label="Right" config={right} onChange={setRight} />
      <SubviewSettings label="Title" config={title} onChange={setTitle} />

      <LongText size="xl" />
      <LongText size="xl" />
      <LongText size="xl" />
    </ScrollView>
  );
}

function TestScrollToTopGuardHeaderSubviewsIOS() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Screen1',
          Component: Screen1,
          options: {},
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  group: {
    gap: 4,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.cardBorder,
  },
  groupHeading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default createScenario(
  TestScrollToTopGuardHeaderSubviewsIOS,
  scenarioDescription,
);
