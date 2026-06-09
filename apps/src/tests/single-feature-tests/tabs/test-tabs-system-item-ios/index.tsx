import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { Colors } from '@apps/shared/styling';

function StaticSystemItemScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Static System Item</Text>
      <Text style={styles.hint}>
        This tab uses a systemItem: `bookmarks`{'\n'}with no custom title or icon override.
        {'\n'}
        {'\n'}
        The system-provided icon (open book) and localized title (`Bookmarks`) are displayed.
      </Text>
    </View>
  );
}

type SystemItemOption = 'favorites' | 'history' | 'search';
type TitleOption = 'system' | 'custom' | 'hidden';
type IconOption = 'system' | 'house' | 'heart';

type RuntimeConfig = {
  systemItem: SystemItemOption;
  title: TitleOption;
  icon: IconOption;
};

const INITIAL_CONFIG: RuntimeConfig = {
  systemItem: 'favorites',
  title: 'system',
  icon: 'system',
};

const SYSTEM_ITEM_OPTIONS: SystemItemOption[] = ['favorites', 'history', 'search'];
const TITLE_OPTIONS: TitleOption[] = ['system', 'custom', 'hidden'];
const ICON_OPTIONS: IconOption[] = ['system', 'house', 'heart'];

function OptionRow<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: T[];
  value: T;
  onSelect: (option: T) => void;
}) {
  return (
    <View style={styles.buttonRow}>
      {options.map(option => {
        const isActive = value === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.optionButton, isActive && styles.optionButtonActive]}
            onPress={() => onSelect(option)}>
            <Text
              style={[styles.optionText, isActive && styles.optionTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function RuntimeConfigScreen() {
  const { routeKey, setRouteOptions } = useTabsNavigationContext();
  const [config, setConfig] = useState<RuntimeConfig>(INITIAL_CONFIG);

  const apply = (next: RuntimeConfig) => {
    setConfig(next);
    setRouteOptions(routeKey, {
      title:
        next.title === 'custom' ? 'Custom' : next.title === 'hidden' ? '' : undefined,
      ios: {
        systemItem: next.systemItem,
        icon:
          next.icon === 'house'
            ? { type: 'sfSymbol', name: 'house' }
            : next.icon === 'heart'
              ? { type: 'sfSymbol', name: 'heart' }
              : undefined,
        selectedIcon:
          next.icon === 'house'
            ? { type: 'sfSymbol', name: 'house.fill' }
            : next.icon === 'heart'
              ? { type: 'sfSymbol', name: 'heart.fill' }
              : undefined,
      },
    });
  };

  const setSystemItem = (systemItem: SystemItemOption) =>
    apply({ ...config, systemItem });
  const setTitle = (title: TitleOption) => apply({ ...config, title });
  const setIcon = (icon: IconOption) => apply({ ...config, icon });

  const titleDisplay =
    config.title === 'custom'
      ? '"Custom"'
      : config.title === 'hidden'
        ? "'' (hidden)"
        : 'undefined (system)';
  const iconDisplay =
    config.icon === 'system' ? 'system (from systemItem)' : `custom \`${config.icon}\``;

  return (
    <ScrollView style={styles.screen}>
      <View >
        <Text style={styles.label}>Runtime Config</Text>
        <Text style={styles.hint}>
          Configure systemItem, title and icon at runtime{'\n'}in different combinations.
          {'\n'}
          {'\n'}
          systemItem: `{config.systemItem}`{'\n'}
          title: {titleDisplay}
          {'\n'}
          icon: {iconDisplay}
        </Text>

        <Text style={styles.groupLabel}>systemItem</Text>
        <OptionRow
          options={SYSTEM_ITEM_OPTIONS}
          value={config.systemItem}
          onSelect={setSystemItem}
        />

        <Text style={styles.groupLabel}>title</Text>
        <OptionRow
          options={TITLE_OPTIONS}
          value={config.title}
          onSelect={setTitle}
        />

        <Text style={styles.groupLabel}>icon</Text>
        <OptionRow
          options={ICON_OPTIONS}
          value={config.icon}
          onSelect={setIcon}
        />

        <Text style={styles.instructions}>
          Mix systemItem, title and icon freely. A custom icon{'\n'}overrides the systemItem
          icon; `system` icon falls back{'\n'}to the systemItem default (no stale image).
        </Text>
      </View>
    </ScrollView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'StaticSystemItem',
    Component: StaticSystemItemScreen,
    options: {
      ios: {
        systemItem: 'bookmarks',
      },
    },
  },
  {
    name: 'RuntimeConfig',
    Component: RuntimeConfigScreen,
    options: {
      ios: {
        systemItem: INITIAL_CONFIG.systemItem,
      },
    },
  },
];

export function App() {
  return (
    <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    fontSize: 13,
    color: Colors.LightOffNavy,
    textAlign: 'center',
    lineHeight: 20,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  optionTextActive: {
    color: Colors.White,
  },
  instructions: {
    fontSize: 12,
    color: Colors.LightOffNavy,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default createScenario(App, scenarioDescription);
