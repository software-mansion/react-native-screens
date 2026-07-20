import React, { useLayoutEffect, useState, type ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScrollToTopGuard } from 'react-native-screens/experimental';
import { SettingsSwitch, SettingsPicker } from '@apps/shared';
import LongText from '@apps/shared/LongText';
import { Colors } from '@apps/shared/styling';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';

type RouteParamList = {
  Screen1: undefined;
};

const Stack = createNativeStackNavigator<RouteParamList>();

const HIT_SLOP_VALUES = ['0', '10', '30'] as const;
type HitSlopValue = (typeof HIT_SLOP_VALUES)[number];

// Per-subview configuration. `hidesSharedBackground` is only applicable to
// `left` / `right` bar-button subviews (see ScreenStackHeaderSubviewProps in
// react-native-screens types), so it is ignored for the `title` subview.
interface SubviewConfig {
  guarded: boolean;
  hitSlop: HitSlopValue;
  hidesSharedBackground: boolean;
}

const DEFAULT_SUBVIEW_CONFIG: SubviewConfig = {
  guarded: true,
  hitSlop: '0',
  hidesSharedBackground: false,
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
    <PressableWithFeedback onPress={() => console.log(`${label} pressed`)} hitSlop={Number(config.hitSlop)} pressRetentionOffset={0}>
      <Text>{label}</Text>
    </PressableWithFeedback>
  );

  const key = `${config.guarded}_${config.hitSlop}`;

  if (config.guarded) {
    return (
      <ScrollToTopGuard key={key}>
        {button}
      </ScrollToTopGuard>
    );
  }

  return <View key={key}>{button}</View>;
}

interface SubviewSettingsProps {
  label: string;
  config: SubviewConfig;
  onChange: (config: SubviewConfig) => void;
  // `title` subview has no shared background, so the toggle is hidden for it.
  supportsHidesSharedBackground: boolean;
}

function SubviewSettings({
  label,
  config,
  onChange,
  supportsHidesSharedBackground,
}: SubviewSettingsProps) {
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
      {supportsHidesSharedBackground && (
        <SettingsSwitch
          label="hidesSharedBackground"
          value={config.hidesSharedBackground}
          onValueChange={value =>
            onChange({ ...config, hidesSharedBackground: value })
          }
        />
      )}
    </View>
  );
}

function Screen1({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RouteParamList, 'Screen1'>;
}) {
  const [left, setLeft] = useState<SubviewConfig>(DEFAULT_SUBVIEW_CONFIG);
  const [right, setRight] = useState<SubviewConfig>(DEFAULT_SUBVIEW_CONFIG);
  const [title, setTitle] = useState<SubviewConfig>(DEFAULT_SUBVIEW_CONFIG);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => renderSubview('Title', title),
      unstable_headerLeftItems: () => [
        {
          type: 'custom',
          element: renderSubview('Left', left),
          hidesSharedBackground: left.hidesSharedBackground,
        },
      ],
      unstable_headerRightItems: () => [
        {
          type: 'custom',
          element: renderSubview('Right', right),
          hidesSharedBackground: right.hidesSharedBackground,
        },
      ],
    });
  }, [navigation, left, right, title]);

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

      <SubviewSettings
        label="Left"
        config={left}
        onChange={setLeft}
        supportsHidesSharedBackground
      />
      <SubviewSettings
        label="Right"
        config={right}
        onChange={setRight}
        supportsHidesSharedBackground
      />
      <SubviewSettings
        label="Title"
        config={title}
        onChange={setTitle}
        supportsHidesSharedBackground={false}
      />

      <LongText size="xl" />
      <LongText size="xl" />
      <LongText size="xl" />
    </ScrollView>
  );
}

function TestScrollToTopGuardHeaderSubviewsIOS() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Screen1" component={Screen1} options={{
          headerTransparent: true
        }} />
      </Stack.Navigator>
    </NavigationContainer>
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
