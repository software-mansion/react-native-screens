import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';
import type {
  StackHeaderBackButtonDisplayModeIOS,
  StackHeaderConfigProps,
} from 'react-native-screens';

const TITLES = [undefined, 'Custom title', 'Longer custom title'];
const BACK_TITLES = [undefined, 'Custom title', 'Longer custom title'];
const DISPLAY_MODES: StackHeaderBackButtonDisplayModeIOS[] = [
  'default',
  'generic',
  'minimal',
];
const MAX_TRAILING_ITEMS_COUNT = 3;

interface BackButtonConfig {
  title: string | undefined;
  backButtonTitle: string | undefined;
  displayMode: StackHeaderBackButtonDisplayModeIOS;
  trailingItemsCount: number;
}

const INITIAL_CONFIG: BackButtonConfig = {
  title: undefined,
  backButtonTitle: undefined,
  displayMode: 'default',
  trailingItemsCount: 0,
};

interface BackButtonConfigContextPayload {
  currentConfig: BackButtonConfig;
  nextConfig: BackButtonConfig;
  setCurrentConfig: React.Dispatch<React.SetStateAction<BackButtonConfig>>;
  setNextConfig: React.Dispatch<React.SetStateAction<BackButtonConfig>>;
}

const BackButtonConfigContext =
  React.createContext<BackButtonConfigContextPayload | null>(null);

function useBackButtonConfigContext() {
  const context = React.useContext(BackButtonConfigContext);
  if (context === null) {
    throw new Error('BackButtonConfigContext must be used inside its provider');
  }
  return context;
}

function buildHeaderConfig(
  defaultTitle: string,
  config: BackButtonConfig,
): StackHeaderConfigProps {
  return {
    title: config.title ?? defaultTitle,
    ios: {
      backButtonTitle: config.backButtonTitle,
      backButtonDisplayMode: config.displayMode,
      trailingItems: Array.from(
        { length: config.trailingItemsCount },
        (_, index) => ({
          type: 'item' as const,
          id: `trailing-item-${index}`,
          title: `Item ${index + 1}`,
        }),
      ),
    },
  };
}

function TestStackBackButtonIOS() {
  const [currentConfig, setCurrentConfig] = React.useState(INITIAL_CONFIG);
  const [nextConfig, setNextConfig] = React.useState(INITIAL_CONFIG);

  const contextPayload = React.useMemo(
    () => ({ currentConfig, nextConfig, setCurrentConfig, setNextConfig }),
    [currentConfig, nextConfig],
  );

  const routeConfigs = React.useMemo(
    () => [
      {
        name: 'Home',
        element: <HomeScreen />,
        options: {
          headerConfig: { title: 'Home' } satisfies StackHeaderConfigProps,
        },
      },
      {
        name: 'First',
        element: <FirstScreen />,
        options: {
          headerConfig: buildHeaderConfig('First', INITIAL_CONFIG),
        },
      },
      {
        name: 'Second',
        element: <SecondScreen />,
        options: {
          headerConfig: buildHeaderConfig('Second', nextConfig),
        },
      },
      {
        // Intentionally no headerConfig — exercises clearing of back button
        // configuration left on the previous screen by an earlier push.
        name: 'Bare',
        element: <BareScreen />,
      },
    ],
    [nextConfig],
  );

  return (
    <BackButtonConfigContext.Provider value={contextPayload}>
      <StackContainer routeConfigs={routeConfigs} />
    </BackButtonConfigContext.Provider>
  );
}

function HomeScreen() {
  const { push } = useStackNavigationContext();

  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight40 }}>
      <StackRouteInformation routeName="Home" />
      <Button title="Push First" onPress={() => push('First')} />
    </CenteredLayoutView>
  );
}

function BackButtonConfigSection(props: {
  label: string;
  config: BackButtonConfig;
  onChange: React.Dispatch<React.SetStateAction<BackButtonConfig>>;
}) {
  const { label, config, onChange } = props;

  const cycleTitle = () =>
    onChange(prev => ({
      ...prev,
      title: TITLES[(TITLES.indexOf(prev.title) + 1) % TITLES.length],
    }));

  const cycleBackTitle = () =>
    onChange(prev => ({
      ...prev,
      backButtonTitle:
        BACK_TITLES[
          (BACK_TITLES.indexOf(prev.backButtonTitle) + 1) % BACK_TITLES.length
        ],
    }));

  const cycleDisplayMode = () =>
    onChange(prev => ({
      ...prev,
      displayMode:
        DISPLAY_MODES[
          (DISPLAY_MODES.indexOf(prev.displayMode) + 1) % DISPLAY_MODES.length
        ],
    }));

  const cycleTrailingItemsCount = () =>
    onChange(prev => ({
      ...prev,
      trailingItemsCount:
        (prev.trailingItemsCount + 1) % (MAX_TRAILING_ITEMS_COUNT + 1),
    }));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Button
        title={`title: ${config.title ?? 'undefined'}`}
        onPress={cycleTitle}
      />
      <Button
        title={`backButtonTitle: ${config.backButtonTitle ?? 'undefined'}`}
        onPress={cycleBackTitle}
      />
      <Button
        title={`displayMode: ${config.displayMode}`}
        onPress={cycleDisplayMode}
      />
      <Button
        title={`trailingItemsCount: ${config.trailingItemsCount}`}
        onPress={cycleTrailingItemsCount}
      />
    </View>
  );
}

function FirstScreen() {
  const { routeKey, push, pop, setRouteOptions } = useStackNavigationContext();
  const { currentConfig, nextConfig, setCurrentConfig, setNextConfig } =
    useBackButtonConfigContext();

  React.useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: buildHeaderConfig('First', currentConfig),
    });
  }, [currentConfig, setRouteOptions, routeKey]);

  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <StackRouteInformation routeName="First" />
      <BackButtonConfigSection
        label="Current screen — back button to Home, updates live"
        config={currentConfig}
        onChange={setCurrentConfig}
      />
      <BackButtonConfigSection
        label="Next screen — back button to First, applied on push"
        config={nextConfig}
        onChange={setNextConfig}
      />
      <Button title="Push Second" onPress={() => push('Second')} />
      <Button
        title="Push Bare (no header config)"
        onPress={() => push('Bare')}
      />
      <Button title="Pop" onPress={() => pop(routeKey)} />
    </CenteredLayoutView>
  );
}

function BareScreen() {
  const { routeKey, push, pop } = useStackNavigationContext();

  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight80 }}>
      <StackRouteInformation routeName="Bare" />
      <Text style={styles.note}>
        This screen has no header config, so the header is hidden. Push Second
        on top and long-press its back button — the menu entries for the screens
        below must not retain back button configuration from previously popped
        screens.
      </Text>
      <Button title="Push Second" onPress={() => push('Second')} />
      <Button title="Pop" onPress={() => pop(routeKey)} />
    </CenteredLayoutView>
  );
}

function SecondScreen() {
  const { routeKey, push, pop } = useStackNavigationContext();

  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.GreenLight100 }}>
      <StackRouteInformation routeName="Second" />
      <Text style={styles.note}>
        The back button reflects the "next screen" config chosen on First.
      </Text>
      <Button
        title="Push Bare (no header config)"
        onPress={() => push('Bare')}
      />
      <Button title="Pop" onPress={() => pop(routeKey)} />
    </CenteredLayoutView>
  );
}

export default createScenario(TestStackBackButtonIOS, scenarioDescription);

const styles = StyleSheet.create({
  section: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  sectionLabel: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  note: {
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
});
