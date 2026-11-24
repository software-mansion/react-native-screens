import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import type {
  StackHeaderConfigProps,
  StackHeaderMenuIOS,
  StackHeaderMenuElementIOS,
} from 'react-native-screens/components/stack/header';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { SettingsSwitch } from '@apps/shared/SettingsSwitch';
import { SettingsPicker } from '@apps/shared/SettingsPicker';
import { ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

const MENU_MODES = ['none', 'single', 'multi'] as const;
type MenuMode = (typeof MENU_MODES)[number];

const TITLE_VARIANTS = ['foo', 'bar', 'long'] as const;
type TitleVariant = (typeof TITLE_VARIANTS)[number];

interface ItemConfig {
  titleVariant: TitleVariant;
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

const CUSTOM_VIEW_SIZE = 30;
const LARGE_CUSTOM_VIEW_WIDTH = 60;

interface HeaderLayout {
  reversed: boolean;
  largeCustomViews: boolean;
  firstItemLeading: boolean;
}

// The third item is toggled from both screens of the stack, so its state lives above them.
const ThirdItemContext = createContext<{
  showThirdItem: boolean;
  toggleThirdItem: () => void;
  addThirdItem: () => void;
}>({
  showThirdItem: false,
  toggleThirdItem: () => {},
  addThirdItem: () => {},
});

function itemTitle(index: number, variant: TitleVariant): string {
  switch (variant) {
    case 'foo':
      return `Foo ${index + 1}`;
    case 'bar':
      return `Bar ${index + 1}`;
    case 'long':
      return `Longer title ${index + 1}`;
  }
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
  layout: HeaderLayout,
  showToast: (text: string) => void,
): StackHeaderConfigProps {
  const itemGroups: StackHeaderItems[] = items.map((item, i) => {
    const menu =
      item.menuMode !== 'none'
        ? buildMenu(i, item.menuMode, showToast)
        : undefined;

    let outItems: StackHeaderItems = [];

    if (item.customView) {
      outItems.push({
        type: 'custom',
        id: `trailing-${i}`,
        render: () => (
          <PressableWithFeedback
            testID={`custom-item-${i}`}
            style={{
              width: layout.largeCustomViews
                ? LARGE_CUSTOM_VIEW_WIDTH
                : CUSTOM_VIEW_SIZE,
              height: CUSTOM_VIEW_SIZE,
            }}
          />
        ),
        menu,
      });
    } else {
      outItems.push({
        type: 'button',
        id: `trailing-${i}`,
        title: itemTitle(i, item.titleVariant),
        onPress: () => showToast(`Pressed Item ${i + 1}`),
        menu,
      });
    }

    outItems.push({ type: 'spacer', id: `spacer-${i}`, sizing: 'flexible' });

    return outItems;
  });

  const leadingItems = layout.firstItemLeading ? itemGroups[0] : [];
  const trailingGroups = layout.firstItemLeading
    ? itemGroups.slice(1)
    : itemGroups;
  if (layout.reversed) {
    trailingGroups.reverse();
  }

  return {
    title: 'Selective Updates',
    ios: {
      leadingItems,
      trailingItems: trailingGroups.flat(),
    },
  };
}

export function TestStackHeaderSelectiveUpdatesIOS() {
  const [showThirdItem, setShowThirdItem] = useState(false);
  const thirdItemContext = useMemo(
    () => ({
      showThirdItem,
      toggleThirdItem: () => setShowThirdItem(prev => !prev),
      addThirdItem: () => setShowThirdItem(true),
    }),
    [showThirdItem],
  );

  return (
    <ToastProvider>
      <ThirdItemContext.Provider value={thirdItemContext}>
        <StackContainer
          routeConfigs={[
            {
              name: 'Home',
              element: <ConfigScreen />,
            },
            {
              name: 'Details',
              element: <DetailsScreen />,
              options: {
                headerConfig: {
                  title: 'Details',
                },
              },
            },
          ]}
        />
      </ThirdItemContext.Provider>
    </ToastProvider>
  );
}

function ThirdItemButton() {
  const { showThirdItem, toggleThirdItem } = useContext(ThirdItemContext);
  return (
    <Button
      testID="toggle-item-3-button"
      title={showThirdItem ? 'Remove Item 3' : 'Add Item 3'}
      onPress={toggleThirdItem}
    />
  );
}

function DetailsScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ThirdItemButton />
      <StackNavigationButtons routeNames={[]} isPopEnabled />
    </ScrollView>
  );
}

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const toast = useToast();
  const [items, setItems] = useState<ItemConfig[]>(DEFAULT_ITEMS);
  const { showThirdItem, addThirdItem } = useContext(ThirdItemContext);
  const [reversed, setReversed] = useState(false);
  const [largeCustomViews, setLargeCustomViews] = useState(false);
  const [firstItemLeading, setFirstItemLeading] = useState(false);
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
    () =>
      buildHeaderConfig(
        allItems,
        { reversed, largeCustomViews, firstItemLeading },
        showToast,
      ),
    [allItems, reversed, largeCustomViews, firstItemLeading, showToast],
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
      {allItems.map((item, i) => (
        <View key={i} style={styles.itemSection}>
          <Text style={styles.heading}>Item {i + 1}</Text>
          <SettingsPicker<TitleVariant>
            testID={`title-picker-${i}`}
            label="Title"
            value={item.titleVariant}
            onValueChange={v => updateItem(i, { titleVariant: v })}
            items={[...TITLE_VARIANTS]}
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
      <ThirdItemButton />
      <Button
        testID="lengthen-and-add-button"
        title="Lengthen Item 1 title and add Item 3"
        onPress={() => {
          // Both changes land in one header update.
          updateItem(0, { titleVariant: 'long' });
          addThirdItem();
        }}
      />
      <SettingsSwitch
        testID="reversed-switch"
        label="Reversed order"
        value={reversed}
        onValueChange={setReversed}
      />
      <SettingsSwitch
        testID="large-custom-views-switch"
        label="Large custom views"
        value={largeCustomViews}
        onValueChange={setLargeCustomViews}
      />
      <SettingsSwitch
        testID="first-item-leading-switch"
        label="Item 1 on the leading side"
        value={firstItemLeading}
        onValueChange={setFirstItemLeading}
      />
      <StackNavigationButtons routeNames={['Details']} isPopEnabled={false} />
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
