import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { SettingsPicker } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderConfigRef,
  StackHeaderToolbarMenuElementAndroid,
  StackHeaderToolbarMenuElementOptionsAndroid,
} from 'react-native-screens/experimental';
import { scenarioDescription } from './scenario-description';

const ALL_IDS = [
  'action-item',
  'overflow-item',
  'submenu',
  'sub-item',
] as const;
type AllIds = (typeof ALL_IDS)[number];

type LabelOption = 'no change' | 'Updated label' | 'undefined';
const LABEL_OPTIONS: LabelOption[] = [
  'no change',
  'Updated label',
  'undefined',
];

function buildMenu(
  onPress: (id: string) => void,
): StackHeaderToolbarMenuElementAndroid[] {
  return [
    {
      type: 'menuItem',
      id: 'action-item',
      title: 'Alpha',
      accessibilityLabel: 'Accessibility for Alpha',
      showAsAction: 'always',
      icon: {
        type: 'imageSource',
        imageSource: require('@assets/search_black.png'),
      },
      onPress: () => onPress('action-item'),
    },
    {
      type: 'menuItem',
      id: 'overflow-item',
      title: 'Beta',
      accessibilityLabel: 'Accessibility for Beta',
      onPress: () => onPress('overflow-item'),
    },
    {
      type: 'menu',
      id: 'submenu',
      title: 'Gamma',
      accessibilityLabel: 'Accessibility for Gamma',
      children: [
        {
          type: 'menuItem',
          id: 'sub-item',
          title: 'Delta',
          accessibilityLabel: 'Accessibility for Delta',
          onPress: () => onPress('sub-item'),
        },
      ],
    },
  ];
}

const HEADER_TITLE = 'Toolbar Menu A11y';

function TestStackToolbarMenuA11y() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Main',
          Component: MainScreen,
          options: {
            headerConfig: {
              title: HEADER_TITLE,
              android: {
                toolbarMenu: {
                  children: buildMenu(() => {}),
                },
              },
            },
          },
        },
      ]}
    />
  );
}

function MainScreen() {
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  const [cmdTargetId, setCmdTargetId] = useState<AllIds>('action-item');
  const [cmdLabel, setCmdLabel] = useState<LabelOption>('no change');

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const { setRouteOptions, routeKey } = useStackNavigationContext();

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: HEADER_TITLE,
        android: {
          toolbarMenu: {
            children: buildMenu(setLastClicked),
          },
        },
      },
      headerConfigRef,
    });
  }, [setRouteOptions, routeKey]);

  const sendCommand = useCallback(() => {
    const options: StackHeaderToolbarMenuElementOptionsAndroid = {
      ...(cmdLabel !== 'no change' && {
        accessibilityLabel: cmdLabel === 'undefined' ? undefined : cmdLabel,
      }),
    };
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: cmdTargetId,
      options,
    });
  }, [cmdTargetId, cmdLabel]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Result</Text>
      <Text style={styles.result}>Last clicked: {lastClicked ?? '—'}</Text>

      <Text style={styles.heading}>Send Command</Text>
      <SettingsPicker<AllIds>
        label="target id"
        value={cmdTargetId}
        items={[...ALL_IDS]}
        onValueChange={setCmdTargetId}
        testID="cmd-target-picker"
      />
      <SettingsPicker<LabelOption>
        label="accessibilityLabel"
        value={cmdLabel}
        items={LABEL_OPTIONS}
        onValueChange={setCmdLabel}
        testID="cmd-label-picker"
      />
      <Button
        title="Send Command"
        onPress={sendCommand}
        testID="send-command-button"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 10,
    paddingBottom: 50,
    gap: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  result: {
    fontSize: 15,
    paddingHorizontal: 10,
  },
});

export default createScenario(TestStackToolbarMenuA11y, scenarioDescription);
