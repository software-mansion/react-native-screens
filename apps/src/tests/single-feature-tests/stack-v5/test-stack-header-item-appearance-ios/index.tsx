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
import {
  SettingsPicker,
  SettingsSwitch,
  ToastProvider,
  useToast,
} from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import {
  COLOR_OPTIONS,
  HeaderAppearanceSection,
  buildHeaderAppearance,
  makeDefaultHeaderAppearanceConfig,
  resolveColor,
  type ColorOption,
  type HeaderAppearanceConfig,
} from '@apps/tests/shared/components/stack-v5/HeaderAppearanceControls';

const BUTTON_SLOTS = [
  'button',
  'buttonHighlighted',
  'buttonDisabled',
  'buttonFocused',
  'prominentButton',
  'prominentButtonHighlighted',
  'prominentButtonDisabled',
  'prominentButtonFocused',
  'backButton',
  'backButtonHighlighted',
  'backButtonFocused',
] as const;

type ButtonSlotKey = (typeof BUTTON_SLOTS)[number];

type AppearanceKey = 'standard' | 'scrollEdge';

interface Config {
  // When enabled, items render short text labels instead of sfSymbol icons,
  // so that button appearance text attributes have visible effect.
  textItems: boolean;
  overflow: boolean;
  // Applied as `tintColor` to all four items.
  itemTint: ColorOption;
  standard: HeaderAppearanceConfig<ButtonSlotKey>;
  scrollEdge: HeaderAppearanceConfig<ButtonSlotKey>;
}

const DEFAULT_CONFIG: Config = {
  textItems: false,
  overflow: false,
  itemTint: 'default',
  standard: makeDefaultHeaderAppearanceConfig(BUTTON_SLOTS),
  scrollEdge: makeDefaultHeaderAppearanceConfig(BUTTON_SLOTS),
};

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

  const tintColor = resolveColor(config.itemTint);

  return {
    title,
    ios: {
      backButtonTitle: "Back",
      standardAppearance: buildHeaderAppearance(config.standard),
      scrollEdgeAppearance: buildHeaderAppearance(config.scrollEdge),
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

  const updateAppearance = useCallback(
    (
      appearance: AppearanceKey,
      next: HeaderAppearanceConfig<ButtonSlotKey>,
    ) => {
      setConfig(prev => ({ ...prev, [appearance]: next }));
    },
    [setConfig],
  );

  return (
    <>
      <Button
        title="Reset appearance"
        onPress={() =>
          setConfig(prev => ({
            ...prev,
            standard: makeDefaultHeaderAppearanceConfig(BUTTON_SLOTS),
            scrollEdge: makeDefaultHeaderAppearanceConfig(BUTTON_SLOTS),
          }))
        }
      />
      <SettingsSwitch
        label="Use text items"
        value={config.textItems}
        onValueChange={v => setConfig(prev => ({ ...prev, textItems: v }))}
      />
      <SettingsSwitch
        label="Push to overflow"
        testID="push-to-overflow-switch"
        value={config.overflow}
        onValueChange={v => setConfig(prev => ({ ...prev, overflow: v }))}
      />

      <SettingsPicker<ColorOption>
        label="item tintColor"
        value={config.itemTint}
        onValueChange={v => setConfig(prev => ({ ...prev, itemTint: v }))}
        items={COLOR_OPTIONS}
      />
      <HeaderAppearanceSection
        label="standardAppearance"
        slotKeys={BUTTON_SLOTS}
        value={config.standard}
        onChange={next => updateAppearance('standard', next)}
      />
      <HeaderAppearanceSection
        label="scrollEdgeAppearance"
        slotKeys={BUTTON_SLOTS}
        value={config.scrollEdge}
        onChange={next => updateAppearance('scrollEdge', next)}
      />
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
  useApplyHeaderConfig("");

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={styles.container}>
      <Text style={styles.label}>
        Back button is visible alongside the header items. With text items
        enabled, button attributes apply to the plain items (and the back button
        title on iOS below 26); prominentButton attributes apply to the
        prominent items. backButton attributes apply only to the back button
        title (iOS below 26), overriding the button ones.
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
              options: {
                headerConfig: {
                  ios: {
                    backButtonTitle: "Back",
                    backButtonDisplayMode: "default"
                  }
                }
              },
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
