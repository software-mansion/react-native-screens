import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderConfigProps,
  StackHeaderMode,
} from 'react-native-screens';

const ROUTE_NAMES = ['Home', 'First', 'Second'] as const;
type RouteName = (typeof ROUTE_NAMES)[number];

const HEADER_MODES: StackHeaderMode[] = ['float', 'screen'];

const ROUTE_COLORS: Record<RouteName, string> = {
  Home: Colors.YellowLight40,
  First: Colors.GreenLight40,
  Second: Colors.BlueLight40,
};

interface RouteConfig {
  headerMode: StackHeaderMode;
  hidden: boolean;
}

type Config = Record<RouteName, RouteConfig>;

const INITIAL_CONFIG: Config = {
  Home: { headerMode: 'float', hidden: false },
  First: { headerMode: 'screen', hidden: false },
  Second: { headerMode: 'screen', hidden: false },
};

interface ConfigContextPayload {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

const ConfigContext = React.createContext<ConfigContextPayload | null>(null);

function useConfigContext() {
  const context = React.useContext(ConfigContext);
  if (context === null) {
    throw new Error('ConfigContext must be used inside its provider');
  }
  return context;
}

function buildHeaderConfig(
  routeName: RouteName,
  routeConfig: RouteConfig,
  onInfoPress?: () => void,
): StackHeaderConfigProps {
  return {
    title: `${routeName} (${routeConfig.headerMode})`,
    hidden: routeConfig.hidden,
    headerMode: routeConfig.headerMode,
    ios: {
      backButtonTitle: routeName === 'Second' ? 'Back' : undefined,
      trailingItems: [
        {
          type: 'item',
          id: `${routeName}-info`,
          icon: { type: 'sfSymbol', name: 'info.circle' },
          onPress: onInfoPress,
        },
      ],
    },
  };
}

function TestStackHeaderMode() {
  const [config, setConfig] = React.useState(INITIAL_CONFIG);

  const contextPayload = React.useMemo(() => ({ config, setConfig }), [config]);

  const routeConfigs = React.useMemo(
    () =>
      ROUTE_NAMES.map(routeName => ({
        name: routeName,
        element: <RouteScreen routeName={routeName} />,
        options: {
          headerConfig: buildHeaderConfig(routeName, config[routeName]),
          // Android only: the default preset fades the screens, a slide makes
          // it easier to see that the header moves together with its screen.
          animation: 'slideFromRight' as const,
        },
      })),
    [config],
  );

  return (
    <ConfigContext.Provider value={contextPayload}>
      <StackContainer routeConfigs={routeConfigs} />
    </ConfigContext.Provider>
  );
}

function RouteScreen({ routeName }: { routeName: RouteName }) {
  const { push, pop, routeKey, setRouteOptions } = useStackNavigationContext();
  const { config, setConfig } = useConfigContext();
  const nextRouteName =
    ROUTE_NAMES[ROUTE_NAMES.indexOf(routeName) + 1] ?? undefined;

  // Route configs are applied on push only - keep the header of an already
  // pushed screen in sync with the settings.
  const routeConfig = config[routeName];
  const [infoPressCount, setInfoPressCount] = React.useState(0);
  React.useEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: buildHeaderConfig(routeName, routeConfig, () =>
        setInfoPressCount(count => count + 1),
      ),
    });
  }, [routeConfig, routeName, routeKey, setRouteOptions]);

  const updateRoute = (name: RouteName, patch: Partial<RouteConfig>) =>
    setConfig(prev => ({ ...prev, [name]: { ...prev[name], ...patch } }));

  return (
    <ScrollView
      style={{ backgroundColor: ROUTE_COLORS[routeName] }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <Text testID={`${routeName}-content-top`} style={styles.marker}>
        Top of {routeName} content
      </Text>
      <Text testID={`${routeName}-info-press-count`}>
        info item pressed: {infoPressCount}
      </Text>
      {nextRouteName !== undefined && (
        <Button
          testID={`${routeName}-push`}
          title={`Push ${nextRouteName}`}
          onPress={() => push(nextRouteName)}
        />
      )}
      {routeName !== 'Home' && (
        <Button
          testID={`${routeName}-pop`}
          title="Pop"
          onPress={() => pop(routeKey)}
        />
      )}
      {ROUTE_NAMES.map(name => (
        <View key={name} style={styles.section}>
          <Text style={styles.heading}>
            {name === routeName ? `${name} (current)` : name}
          </Text>
          <SettingsPicker<StackHeaderMode>
            testID={`${routeName}-${name}-header-mode`}
            label="headerMode"
            value={config[name].headerMode}
            onValueChange={headerMode => updateRoute(name, { headerMode })}
            items={HEADER_MODES}
          />
          <SettingsSwitch
            label="hidden"
            value={config[name].hidden}
            onValueChange={hidden => updateRoute(name, { hidden })}
          />
        </View>
      ))}
      {Array.from({ length: 20 }, (_, index) => (
        <Text key={index} style={styles.filler}>
          {routeName} filler row {index + 1}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 8,
  },
  marker: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    gap: 4,
  },
  heading: {
    fontWeight: '600',
  },
  filler: {
    paddingVertical: 8,
  },
});

export default createScenario(TestStackHeaderMode, scenarioDescription);
