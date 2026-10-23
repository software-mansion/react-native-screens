import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { StackHeaderConfigProps } from 'react-native-screens/components/stack/header';
import { Button, ScrollView, Text, StyleSheet, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { SettingsSwitch, ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderAppearanceIOS,
  StackHeaderButtonAppearanceIOS,
  StackHeaderButtonStateAppearanceIOS,
} from 'react-native-screens';

// Predefined, visually distinct styles — one per scenario step. Each style
// pairs a unique color with a second attribute, so it is immediately visible
// which configuration a given label follows (derived vs overridden).
const BUTTON_STYLE: StackHeaderButtonStateAppearanceIOS = {
  fontColor: 'red',
  fontStyle: 'italic',
};
const PROMINENT_BUTTON_STYLE: StackHeaderButtonStateAppearanceIOS = {
  fontColor: 'orange',
  fontFamily: 'Courier New',
};
const SCROLL_EDGE_BUTTON_STYLE: StackHeaderButtonStateAppearanceIOS = {
  fontColor: 'green',
  fontSize: 22,
};
const SCROLL_EDGE_PROMINENT_BUTTON_STYLE: StackHeaderButtonStateAppearanceIOS =
  {
    fontColor: 'teal',
  };
const DISABLED_STYLE: StackHeaderButtonStateAppearanceIOS = {
  fontColor: 'purple',
  fontWeight: '100',
};
const SCROLL_EDGE_DISABLED_STYLE: StackHeaderButtonStateAppearanceIOS = {
  fontColor: 'red',
};
const HIGHLIGHTED_STYLE: StackHeaderButtonStateAppearanceIOS = {
  fontColor: 'blue',
  fontSize: 22,
};
const SCROLL_EDGE_HIGHLIGHTED_STYLE: StackHeaderButtonStateAppearanceIOS = {
  fontColor: 'magenta',
};

interface Config {
  // When enabled, items render short text labels instead of sfSymbol icons,
  // so that button appearance text attributes have visible effect.
  textItems: boolean;
  overflow: boolean;
  // Applied as a red `tintColor` to all four items.
  tintItems: boolean;
  // Per-step style presets.
  styleButtons: boolean;
  styleProminentButtons: boolean;
  styleScrollEdge: boolean;
  styleDisabled: boolean;
  styleHighlighted: boolean;
}

const DEFAULT_CONFIG: Config = {
  textItems: true,
  overflow: false,
  tintItems: false,
  styleButtons: true,
  styleProminentButtons: true,
  styleScrollEdge: true,
  styleDisabled: true,
  styleHighlighted: true,
};

function makeButtonAppearance(
  normal?: StackHeaderButtonStateAppearanceIOS,
  highlighted?: StackHeaderButtonStateAppearanceIOS,
  disabled?: StackHeaderButtonStateAppearanceIOS,
): StackHeaderButtonAppearanceIOS | undefined {
  if (!normal && !highlighted && !disabled) {
    return undefined;
  }
  return { normal, highlighted, disabled };
}

function buildAppearances(config: Config): {
  standardAppearance?: StackHeaderAppearanceIOS;
  scrollEdgeAppearance?: StackHeaderAppearanceIOS;
} {
  const standardButton = makeButtonAppearance(
    config.styleButtons ? BUTTON_STYLE : undefined,
    config.styleHighlighted ? HIGHLIGHTED_STYLE : undefined,
    config.styleDisabled ? DISABLED_STYLE : undefined,
  );
  const standardProminentButton = makeButtonAppearance(
    config.styleProminentButtons ? PROMINENT_BUTTON_STYLE : undefined,
    config.styleHighlighted ? HIGHLIGHTED_STYLE : undefined,
    config.styleDisabled ? DISABLED_STYLE : undefined,
  );
  // The scroll edge appearance is built only when its preset is enabled: an
  // explicit scrollEdgeAppearance is a standalone definition, so emitting one
  // that carries only per-state attributes would strip the normal-state
  // styling at the scroll edge.
  const scrollEdgeButton = config.styleScrollEdge
    ? makeButtonAppearance(
        SCROLL_EDGE_BUTTON_STYLE,
        config.styleHighlighted ? SCROLL_EDGE_HIGHLIGHTED_STYLE : undefined,
        config.styleDisabled ? SCROLL_EDGE_DISABLED_STYLE : undefined,
      )
    : undefined;
  const scrollEdgeProminentButton = config.styleScrollEdge
    ? makeButtonAppearance(
        SCROLL_EDGE_PROMINENT_BUTTON_STYLE,
        config.styleHighlighted ? SCROLL_EDGE_HIGHLIGHTED_STYLE : undefined,
        config.styleDisabled ? SCROLL_EDGE_DISABLED_STYLE : undefined,
      )
    : undefined;

  return {
    standardAppearance:
      standardButton || standardProminentButton
        ? { button: standardButton, prominentButton: standardProminentButton }
        : undefined,
    scrollEdgeAppearance:
      scrollEdgeButton || scrollEdgeProminentButton
        ? {
            button: scrollEdgeButton,
            prominentButton: scrollEdgeProminentButton,
          }
        : undefined,
  };
}

const ConfigContext = createContext<{
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
} | null>(null);

function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigContext.Provider');
  }
  return context;
}

const buildHeaderConfig = (
  config: Config,
  title: string,
  showToast: (text: string) => void,
): StackHeaderConfigProps => {
  const itemContent = (
    textTitle: string,
    iconTitle: string,
    sfSymbol: string,
  ) =>
    config.textItems
      ? { title: textTitle }
      : {
          title: iconTitle,
          icon: { type: 'sfSymbol', name: sfSymbol } as const,
        };

  const tintColor = config.tintItems ? 'red' : undefined;

  return {
    title,
    ios: {
      ...buildAppearances(config),
      trailingItems: [
        {
          type: 'item',
          id: 'prominent-disabled-item',
          ...itemContent('dd', 'Prominent Disabled', '4.circle'),
          variant: 'prominent',
          tintColor,
          disabled: true,
          onPress: () => showToast('Prominent disabled item pressed'),
        },
        {
          type: 'spacer',
          id: 'spacer-0',
          sizing: 'flexible',
        },
        {
          type: 'item',
          id: 'prominent-item',
          ...itemContent('cc', 'Prominent', '3.circle'),
          variant: 'prominent',
          tintColor,
          onPress: () => showToast('Prominent item pressed'),
        },
        {
          type: 'spacer',
          id: 'spacer-1',
          sizing: 'flexible',
        },
        {
          type: 'item',
          id: 'disabled-item',
          ...itemContent('bb', 'Disabled', '2.circle'),
          tintColor,
          disabled: true,
          onPress: () => showToast('Disabled item pressed'),
        },
        {
          type: 'spacer',
          id: 'spacer-2',
          sizing: 'flexible',
        },
        {
          type: 'item',
          id: 'regular-item',
          ...itemContent('aa', 'Regular', '1.circle'),
          tintColor,
          onPress: () => showToast('Regular item pressed'),
        },
        ...(config.overflow
          ? [
              {
                type: 'item',
                id: 'wide-custom-item',
                render: () => <View style={styles.wideCustomItem} />,
              } as const,
            ]
          : []),
      ],
    },
  };
};

function useApplyHeaderConfig(title: string) {
  const { config } = useConfig();
  const { setRouteOptions, routeKey } = useStackNavigationContext();
  const toast = useToast();

  const showToast = useCallback(
    (text: string) => {
      toast.push({ backgroundColor: Colors.GreenDark120, message: text });
    },
    [toast],
  );

  const headerConfig = useMemo(
    () => buildHeaderConfig(config, title, showToast),
    [config, title, showToast],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);
}

function ConfigControls() {
  const { config, setConfig } = useConfig();

  const makeToggle = (key: keyof Config, label: string, testID?: string) => (
    <SettingsSwitch
      label={label}
      testID={testID}
      value={config[key]}
      onValueChange={v => setConfig(prev => ({ ...prev, [key]: v }))}
    />
  );

  return (
    <>
      <Button
        title="Reset appearance"
        onPress={() =>
          setConfig(prev => ({
            ...prev,
            styleButtons: false,
            styleProminentButtons: false,
            styleScrollEdge: false,
            styleDisabled: false,
            styleHighlighted: false,
          }))
        }
      />
      {makeToggle('textItems', 'Use text items')}
      {makeToggle('overflow', 'Push to overflow', 'push-to-overflow-switch')}
      {makeToggle('tintItems', 'Tint items (red)')}
      {makeToggle('styleButtons', 'Style buttons (red italic)')}
      {makeToggle(
        'styleProminentButtons',
        'Style prominent buttons (orange Courier)',
      )}
      {makeToggle('styleScrollEdge', 'Style scroll edge (green 22pt / teal)')}
      {makeToggle('styleDisabled', 'Style disabled (purple thin; red at edge)')}
      {makeToggle(
        'styleHighlighted',
        'Style highlighted (blue 24pt; magenta at edge)',
      )}
    </>
  );
}

function HomeScreen() {
  const navigation = useStackNavigationContext();

  useApplyHeaderConfig('Item Appearance');

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={styles.container}>
      <Text style={styles.label}>
        Header shows 4 items: regular (aa/1), disabled (bb/2), prominent (cc/3),
        prominent disabled (dd/4)
      </Text>
      <Button
        testID="push-details-button"
        title="Push details screen"
        onPress={() => navigation.push('Details')}
      />
      <ConfigControls />
    </ScrollView>
  );
}

function DetailsScreen() {
  useApplyHeaderConfig('Details');

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={styles.container}>
      <Text style={styles.label}>
        Back button is visible alongside the header items. With text items
        enabled, button attributes apply to the plain items (and the back button
        title on iOS below 26); prominentButton attributes apply to the
        prominent items.
      </Text>
      <ConfigControls />
    </ScrollView>
  );
}

function TestStackHeaderItemAppearanceIOS() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const contextValue = useMemo(() => ({ config, setConfig }), [config]);

  return (
    <ToastProvider>
      <ConfigContext.Provider value={contextValue}>
        <StackContainer
          routeConfigs={[
            {
              name: 'Home',
              element: <HomeScreen />,
            },
            {
              name: 'Details',
              element: <DetailsScreen />,
            },
          ]}
        />
      </ConfigContext.Provider>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 6,
    paddingBottom: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  wideCustomItem: {
    width: 500,
    height: 20,
    backgroundColor: 'black',
  },
});

export default createScenario(
  TestStackHeaderItemAppearanceIOS,
  scenarioDescription,
);
