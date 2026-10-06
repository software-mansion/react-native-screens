import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { StackHeaderConfigProps } from 'react-native-screens/components/stack/header';
import { Button, ScrollView, Text, View, StyleSheet } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import { type PlatformIconIOS } from 'react-native-screens';

type LoadingMode = 'automatic' | 'synchronous' | undefined;

type IconVariant = 'sfSymbol' | 'xcasset' | 'imageSource' | 'templateSource';

const ICON_VARIANTS: IconVariant[] = [
  'sfSymbol',
  'xcasset',
  'imageSource',
  'templateSource',
];

function iconForVariant(
  variant: IconVariant,
  preferredLoadingMode: LoadingMode,
): PlatformIconIOS {
  switch (variant) {
    case 'sfSymbol':
      return { type: 'sfSymbol', name: 'star.fill' };
    case 'xcasset':
      return { type: 'xcasset', name: 'custom-icon-fill' };
    case 'imageSource':
      return {
        type: 'imageSource',
        ...(preferredLoadingMode !== undefined && { preferredLoadingMode }),
        imageSource: require('@assets/search_black.png'),
      };
    case 'templateSource':
      return {
        type: 'templateSource',
        ...(preferredLoadingMode !== undefined && { preferredLoadingMode }),
        templateSource: require('@assets/variableIcons/icon.png'),
      };
  }
}

function nextVariant(current: IconVariant): IconVariant {
  const idx = ICON_VARIANTS.indexOf(current);
  return ICON_VARIANTS[(idx + 1) % ICON_VARIANTS.length]!;
}

function buildHeaderConfig(
  itemIconVariant: IconVariant,
  menuIconVariant: IconVariant,
  preferredLoadingMode: LoadingMode,
  cycleMenuIcons: () => void,
  showToast: (text: string) => void,
): StackHeaderConfigProps {
  const itemIcon = iconForVariant(itemIconVariant, preferredLoadingMode);
  const menuIcon = iconForVariant(menuIconVariant, preferredLoadingMode);

  return {
    title: 'Header Icons',
    ios: {
      trailingItems: [
        {
          type: 'item',
          id: 'icon-item',
          title: 'Actions',
          icon: itemIcon,
          onPress: () => showToast('Item pressed'),
          menu: {
            type: 'menu',
            id: 'main-menu',
            onSelectionChange: selection =>
              showToast('Selected: ' + selection.join(', ')),
            children: [
              {
                id: 'cycle-action',
                type: 'menuItem',
                itemType: 'action',
                title: `Cycle icons (${menuIconVariant})`,
                keepsMenuPresented: true,
                onPress: cycleMenuIcons,
              },
              {
                id: 'toggle-1',
                type: 'menuItem',
                itemType: 'toggle',
                title: 'Toggle 1',
                icon: menuIcon,
                keepsMenuPresented: true,
              },
              {
                id: 'toggle-2',
                type: 'menuItem',
                itemType: 'toggle',
                title: 'Toggle 2',
                icon: menuIcon,
                keepsMenuPresented: true,
              },
              {
                id: 'toggle-3',
                type: 'menuItem',
                itemType: 'toggle',
                title: 'Toggle 3',
                icon: menuIcon,
                keepsMenuPresented: true,
              },
              {
                id: 'submenu',
                type: 'menu',
                title: 'Submenu',
                icon: menuIcon,
                children: [
                  {
                    id: 'sub-toggle-1',
                    type: 'menuItem',
                    itemType: 'toggle',
                    title: 'Sub Toggle 1',
                    icon: menuIcon,
                    keepsMenuPresented: true,
                  },
                  {
                    id: 'sub-toggle-2',
                    type: 'menuItem',
                    itemType: 'toggle',
                    title: 'Sub Toggle 2',
                    icon: menuIcon,
                    keepsMenuPresented: true,
                  },
                  {
                    id: 'sub-toggle-3',
                    type: 'menuItem',
                    itemType: 'toggle',
                    title: 'Sub Toggle 3',
                    icon: menuIcon,
                    keepsMenuPresented: true,
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  };
}

type ConfigScreenProps = {
  itemIconVariant: IconVariant;
  setItemIconVariant: React.Dispatch<React.SetStateAction<IconVariant>>;
  menuIconVariant: IconVariant;
  setMenuIconVariant: React.Dispatch<React.SetStateAction<IconVariant>>;
  preferredLoadingMode: LoadingMode;
  setPreferredLoadingMode: React.Dispatch<React.SetStateAction<LoadingMode>>;
};

function ConfigScreen({
  itemIconVariant,
  setItemIconVariant,
  menuIconVariant,
  setMenuIconVariant,
  preferredLoadingMode,
  setPreferredLoadingMode,
}: ConfigScreenProps) {
  const navigation = useStackNavigationContext();
  const toast = useToast();

  const showToast = useCallback(
    (text: string) => {
      toast.push({ backgroundColor: Colors.GreenDark120, message: text });
    },
    [toast],
  );

  const cycleMenuIcons = useCallback(() => {
    setMenuIconVariant(v => nextVariant(v));
  }, [setMenuIconVariant]);

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(
    () =>
      buildHeaderConfig(
        itemIconVariant,
        menuIconVariant,
        preferredLoadingMode,
        cycleMenuIcons,
        showToast,
      ),
    [
      itemIconVariant,
      menuIconVariant,
      preferredLoadingMode,
      cycleMenuIcons,
      showToast,
    ],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}>
      <View style={styles.section}>
        <Text testID="current-loading-mode" style={styles.current}>
          {preferredLoadingMode ?? 'omitted'}
        </Text>
        <Button
          testID="cycle-loading-mode-button"
          title="Cycle image loading preference"
          onPress={() =>
            setPreferredLoadingMode(mode =>
              mode === undefined
                ? 'synchronous'
                : mode === 'synchronous'
                ? 'automatic'
                : undefined,
            )
          }
        />
        <Text>
          Use a Release build to exercise bundled PNG loading. Debug assets may
          come from Metro over HTTP. Icon visibility alone does not prove
          synchronous loading.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Bar Button Item Icon</Text>
        <Text testID="current-item-icon" style={styles.current}>
          {itemIconVariant}
        </Text>
        <Button
          testID="cycle-item-icon-button"
          title="Cycle item icon"
          onPress={() => setItemIconVariant(nextVariant)}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Menu Toggles + Submenu Icon</Text>
        <Text testID="current-menu-icon" style={styles.current}>
          {menuIconVariant}
        </Text>
        <Button
          testID="cycle-menu-icons-button"
          title="Cycle menu icons"
          onPress={cycleMenuIcons}
        />
      </View>
      <View style={styles.section}>
        <Button
          testID="push-another-screen-button"
          title="Push another screen"
          onPress={() => navigation.push('Home')}
        />
      </View>
    </ScrollView>
  );
}

function TestStackHeaderIconIOS() {
  // This navigator only accepts a route name when pushing. Keep the selected
  // icons and loading preference here so each pushed screen uses the same case.
  const [itemIconVariant, setItemIconVariant] =
    useState<IconVariant>('sfSymbol');
  const [menuIconVariant, setMenuIconVariant] =
    useState<IconVariant>('sfSymbol');
  const [preferredLoadingMode, setPreferredLoadingMode] =
    useState<LoadingMode>();

  return (
    <ToastProvider>
      <StackContainer
        routeConfigs={[
          {
            name: 'Home',
            element: (
              <ConfigScreen
                itemIconVariant={itemIconVariant}
                setItemIconVariant={setItemIconVariant}
                menuIconVariant={menuIconVariant}
                setMenuIconVariant={setMenuIconVariant}
                preferredLoadingMode={preferredLoadingMode}
                setPreferredLoadingMode={setPreferredLoadingMode}
              />
            ),
          },
        ]}
      />
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  current: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.GreenDark120,
  },
});

export default createScenario(TestStackHeaderIconIOS, scenarioDescription);
