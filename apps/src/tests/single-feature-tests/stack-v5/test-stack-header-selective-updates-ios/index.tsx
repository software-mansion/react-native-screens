import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import type {
  StackHeaderConfigProps,
  StackHeaderMenuIOS,
  StackHeaderMenuElementIOS,
} from 'react-native-screens/components/gamma/stack/header';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { SettingsSwitch } from '@apps/shared/SettingsSwitch';
import { SettingsPicker } from '@apps/shared/SettingsPicker';
import { ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';

const MENU_MODES = ['none', 'single', 'multi'] as const;
type MenuMode = (typeof MENU_MODES)[number];

interface ItemConfig {
  titleVariant: 'foo' | 'bar';
  customView: boolean;
  menuMode: MenuMode;
}

const DEFAULT_ITEMS: ItemConfig[] = [
  { titleVariant: 'foo', customView: false, menuMode: 'none' },
  { titleVariant: 'foo', customView: false, menuMode: 'none' },
];

const THIRD_ITEM_DEFAULT: ItemConfig = {
  titleVariant: 'foo',
  customView: false,
  menuMode: 'none',
};

function itemTitle(index: number, variant: 'foo' | 'bar'): string {
  return variant === 'foo' ? `Foo ${index + 1}` : `Bar ${index + 1}`;
}

function buildMenu(
  itemIndex: number,
  menuMode: 'single' | 'multi',
  showToast: (text: string) => void,
): StackHeaderMenuIOS {
  const singleSelection = menuMode === 'single';

  const children: StackHeaderMenuElementIOS[] = [
    {
      id: `Option-${itemIndex}-A`,
      type: 'menuItem',
      itemType: 'toggle',
      initialToggleState: true,
      title: `Option-${itemIndex}-A`,
    },
    {
      id: `Option-${itemIndex}-B`,
      type: 'menuItem',
      itemType: 'toggle',
      title: `Option-${itemIndex}-B`,
    },
    {
      id: `Option-${itemIndex}-C`,
      type: 'menuItem',
      itemType: 'toggle',
      title: `Option-${itemIndex}-C`,
    },
  ];

  return {
    type: 'menu',
    id: `menu-${itemIndex}`,
    singleSelection,
    onSelectionChange: selection =>
      showToast(
        `Item ${itemIndex + 1} [${menuMode}]: "${selection.join('", "')}"`,
      ),
    children,
  };
}

type StackHeaderItems = NonNullable<
  StackHeaderConfigProps['ios']
>['trailingItems'];

function buildHeaderConfig(
  items: ItemConfig[],
  showToast: (text: string) => void,
): StackHeaderConfigProps {
  const trailingItems: StackHeaderItems = items.flatMap((item, i) => {
    const menu =
      item.menuMode !== 'none'
        ? buildMenu(i, item.menuMode, showToast)
        : undefined;

    let outItems: StackHeaderItems = [];

    if (item.customView) {
      outItems.push({
        type: 'item',
        id: `trailing-${i}`,
        render: () => (
          <PressableWithFeedback
            testID={`custom-item-${i}`}
            style={{ width: 30, height: 30 }}
          />
        ),
        menu,
      });
    } else {
      outItems.push({
        type: 'item',
        id: `trailing-${i}`,
        title: itemTitle(i, item.titleVariant),
        onPress: () => showToast(`Pressed Item ${i + 1}`),
        menu,
      });
    }

    outItems.push({ type: 'spacer', id: `spacer-${i}`, sizing: 'flexible' });

    return outItems;
  });

  return {
    title: 'Selective Updates',
    ios: {
      trailingItems,
    },
  };
}

export function TestStackHeaderSelectiveUpdatesIOS() {
  return (
    <ToastProvider>
      <StackContainer
        routeConfigs={[
          {
            name: 'Home',
            Component: ConfigScreen,
            options: {},
          },
        ]}
      />
    </ToastProvider>
  );
}

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const toast = useToast();
  const [items, setItems] = useState<ItemConfig[]>(DEFAULT_ITEMS);
  const [showThirdItem, setShowThirdItem] = useState(false);
  const [thirdItemConfig, setThirdItemConfig] =
    useState<ItemConfig>(THIRD_ITEM_DEFAULT);

  const allItems = useMemo(
    () => (showThirdItem ? [...items, thirdItemConfig] : items),
    [items, showThirdItem, thirdItemConfig],
  );

  const showToast = useCallback(
    (text: string) => {
      toast.push({ backgroundColor: Colors.GreenDark120, message: text });
    },
    [toast],
  );

  const updateItem = useCallback(
    (index: number, update: Partial<ItemConfig>) => {
      if (index === 2) {
        setThirdItemConfig(prev => ({ ...prev, ...update }));
      } else {
        setItems(prev =>
          prev.map((item, i) => (i === index ? { ...item, ...update } : item)),
        );
      }
    },
    [],
  );

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(
    () => buildHeaderConfig(allItems, showToast),
    [allItems, showToast],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic">
      <Text>
        On iOS 26 and above, item update is visible as visual flash / blur.
        Updating single item should NOT make other items flash. Updating the
        menu should NOT make any item flash. Updating the title when custom item
        is set should NOT make it flash.
      </Text>
      {allItems.map((item, i) => (
        <View key={i} style={styles.itemSection}>
          <Text style={styles.heading}>Item {i + 1}</Text>
          <SettingsPicker<'foo' | 'bar'>
            testID={`title-picker-${i}`}
            label="Title"
            value={item.titleVariant}
            onValueChange={v => updateItem(i, { titleVariant: v })}
            items={['foo', 'bar']}
          />
          <SettingsSwitch
            testID={`custom-view-switch-${i}`}
            label="Custom view"
            value={item.customView}
            onValueChange={v => updateItem(i, { customView: v })}
          />
          <SettingsPicker<MenuMode>
            testID={`menu-picker-${i}`}
            label="Menu"
            value={item.menuMode}
            onValueChange={v => updateItem(i, { menuMode: v })}
            items={[...MENU_MODES]}
          />
        </View>
      ))}
      <Button
        testID="toggle-item-3-button"
        title={showThirdItem ? 'Remove Item 3' : 'Add Item 3'}
        onPress={() => setShowThirdItem(prev => !prev)}
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
    gap: 12,
  },
  itemSection: {
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default createScenario(
  TestStackHeaderSelectiveUpdatesIOS,
  scenarioDescription,
);
