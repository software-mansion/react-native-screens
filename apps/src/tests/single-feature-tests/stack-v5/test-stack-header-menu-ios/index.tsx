import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { StackHeaderConfigProps } from 'react-native-screens/components/gamma/stack/header';
import type {
  StackHeaderConfigRef,
  StackHeaderMenuActionOptionsIOS,
  StackHeaderMenuOptionsIOS,
} from 'react-native-screens/components/gamma/stack/header';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import LongText from '@apps/shared/LongText';
import { scenarioDescription } from './scenario-description';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { SettingsPicker, ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';

const ACTION_IDS = [
  'subitem-1-1',
  'toggle-1-1',
  'toggle-1-2',
  'toggle-1-3',
  'radio-1-1',
  'radio-1-2',
  'radio-1-3',
  'title-action-1',
  'title-action-2',
] as const;
type ActionId = (typeof ACTION_IDS)[number];

const MENU_IDS = ['menu-1', 'submenu-1', 'subsubmenu-1', 'title-menu'] as const;
type MenuId = (typeof MENU_IDS)[number];

const TITLE_OPTIONS = [
  'no change',
  'Changed',
  'New Title',
  'undefined',
] as const;
type TitleOption = (typeof TITLE_OPTIONS)[number];

const ICON_OPTIONS = [
  'no change',
  'star.fill',
  'heart.fill',
  'bell.fill',
  'undefined',
] as const;
type IconOption = (typeof ICON_OPTIONS)[number];

const TOGGLE_STATE_OPTIONS = ['no change', 'true', 'false'] as const;
type ToggleStateOption = (typeof TOGGLE_STATE_OPTIONS)[number];

const DEFAULT_TRAILING_ITEMS_COUNT = 2;
const NO_CHANGE = 'NO_CHANGE';

function resolveTitle(
  option: TitleOption,
): StackHeaderMenuActionOptionsIOS['title'] | typeof NO_CHANGE {
  if (option === 'no change') return NO_CHANGE;
  return option === 'undefined' ? undefined : option;
}

function resolveIcon(
  option: IconOption,
): StackHeaderMenuActionOptionsIOS['icon'] | typeof NO_CHANGE {
  if (option === 'no change') return NO_CHANGE;
  if (option === 'undefined') return undefined;
  return { type: 'sfSymbol', name: option };
}

function resolveToggleState(
  option: ToggleStateOption,
): boolean | undefined | typeof NO_CHANGE {
  if (option === 'no change') return NO_CHANGE;
  return option === 'true';
}

function TestStackHeaderMenuIOS() {
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

function buildHeaderConfig(
  trailingItemsCount: number,
  showToast: (text: string) => void,
  keepsMenuPresented: boolean,
): StackHeaderConfigProps {
  const trailingItems: NonNullable<
    StackHeaderConfigProps['ios']
  >['trailingItems'] = Array.from({ length: trailingItemsCount }).map(
    (_, i) => ({
      type: 'item',
      id: `trailing-${i}`,
      title: `Menu ${i}`,
      // every second item is custom
      ...(i % 2 === 0 && {
        render: () => (
          <PressableWithFeedback style={{ width: 30, height: 30 }} />
        ),
      }),
      menu: {
        type: 'menu',
        id: `menu-${i}`,
        onSelectionChange: selection =>
          showToast('Selected "' + selection.join('", "') + '"'),
        children: [
          {
            id: `subitem-${i}-1`,
            type: 'menuItem',
            itemType: 'action',
            title: `Action ${i}-1`,
            keepsMenuPresented,
            onPress: () => showToast(`Clicked Action ${i}-1`),
          },
          {
            id: `toggle-${i}-1`,
            type: 'menuItem',
            itemType: 'toggle',
            title: `Toggle ${i}-1`,
            keepsMenuPresented,
          },
          {
            id: `toggle-${i}-2`,
            type: 'menuItem',
            itemType: 'toggle',
            title: `Toggle ${i}-2`,
            keepsMenuPresented,
          },
          {
            id: `toggle-${i}-3`,
            type: 'menuItem',
            itemType: 'toggle',
            title: `Toggle ${i}-3`,
            keepsMenuPresented,
          },
          {
            id: `submenu-${i}`,
            type: 'menu',
            title: `Submenu with Radio`,
            singleSelection: true,
            onSelectionChange: selection =>
              showToast(`Selected unique "${selection}"`),
            children: [
              {
                id: `radio-${i}-1`,
                type: 'menuItem',
                title: `Radio ${i}-1`,
                initialToggleState: true,
              },
              {
                id: `subsubmenu-${i}`,
                type: 'menu',
                title: `SubSubMenu with Radio`,
                children: [
                  {
                    id: `radio-${i}-2`,
                    type: 'menuItem',
                    title: `Radio ${i}-2`,
                  },
                  {
                    id: `radio-${i}-3`,
                    type: 'menuItem',
                    title: `Radio ${i}-3`,
                  },
                ],
              },
            ],
          },
        ],
      },
    }),
  );

  return {
    title: 'Header Menu',
    ios: {
      trailingItems,
      titleMenu: {
        type: 'menu',
        id: 'title-menu',
        onSelectionChange: selection =>
          showToast('Title menu selected "' + selection.join('", "') + '"'),
        children: [
          {
            id: 'title-action-1',
            type: 'menuItem',
            itemType: 'action',
            title: 'Title Action 1',
            onPress: () => showToast('Clicked "Title Action 1"'),
          },
          {
            id: 'title-action-2',
            type: 'menuItem',
            itemType: 'action',
            title: 'Title Action 2',
            onPress: () => showToast('Clicked "Title Action 2"'),
          },
        ],
      },
    },
  };
}

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const toast = useToast();
  const [trailingItemsCount, setTrailingItemsCount] = useState<number>(
    DEFAULT_TRAILING_ITEMS_COUNT,
  );
  const [keepsMenuPresented, setKeepsMenuPresented] = useState(false);

  const showToast = useCallback(
    (text: string) => {
      toast.push({ backgroundColor: Colors.GreenDark120, message: text });
    },
    [toast],
  );

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(
    () => buildHeaderConfig(trailingItemsCount, showToast, keepsMenuPresented),
    [trailingItemsCount, showToast, keepsMenuPresented],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
      headerConfigRef,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  const [actionId, setActionId] = useState<ActionId>('subitem-1-1');
  const [actionTitle, setActionTitle] = useState<TitleOption>('no change');
  const [actionIcon, setActionIcon] = useState<IconOption>('no change');
  const [actionToggle, setActionToggle] =
    useState<ToggleStateOption>('no change');

  const [menuId, setMenuId] = useState<MenuId>('submenu-1');
  const [menuTitle, setMenuTitle] = useState<TitleOption>('no change');
  const [menuIcon, setMenuIcon] = useState<IconOption>('no change');

  const sendActionCommand = useCallback(() => {
    const options: StackHeaderMenuActionOptionsIOS = {};
    const resolvedTitle = resolveTitle(actionTitle);
    if (resolvedTitle !== NO_CHANGE) options.title = resolvedTitle;
    const resolvedIcon = resolveIcon(actionIcon);
    if (resolvedIcon !== NO_CHANGE) options.icon = resolvedIcon;
    const resolvedToggleState = resolveToggleState(actionToggle);
    if (resolvedToggleState !== NO_CHANGE) options.toggleState = resolvedToggleState;

    headerConfigRef.current?.ios?.setMenuItemOptions(actionId, options);
  }, [actionId, actionTitle, actionIcon, actionToggle]);

  const sendMenuCommand = useCallback(() => {
    const options: StackHeaderMenuOptionsIOS = {};
    const resolvedTitle = resolveTitle(menuTitle);
    if (resolvedTitle !== NO_CHANGE) options.title = resolvedTitle;
    const resolvedIcon = resolveIcon(menuIcon);
    if (resolvedIcon !== NO_CHANGE) options.icon = resolvedIcon;

    headerConfigRef.current?.ios?.setMenuOptions(menuId, options);
  }, [menuId, menuTitle, menuIcon]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title={`Toggle trailing items count (${trailingItemsCount}/4)`}
        onPress={() => setTrailingItemsCount(count => (count + 1) % 5)}
      />
      <Button
        title={`keepsMenuPresented: ${keepsMenuPresented}`}
        onPress={() => setKeepsMenuPresented(prev => !prev)}
      />

      <Text style={styles.heading}>setMenuItemOptions (Menu 1)</Text>
      <SettingsPicker<ActionId>
        label="target id"
        value={actionId}
        items={[...ACTION_IDS]}
        onValueChange={setActionId}
      />
      <SettingsPicker<TitleOption>
        label="title"
        value={actionTitle}
        items={[...TITLE_OPTIONS]}
        onValueChange={setActionTitle}
      />
      <SettingsPicker<IconOption>
        label="icon"
        value={actionIcon}
        items={[...ICON_OPTIONS]}
        onValueChange={setActionIcon}
      />
      <SettingsPicker<ToggleStateOption>
        label="toggleState"
        value={actionToggle}
        items={[...TOGGLE_STATE_OPTIONS]}
        onValueChange={setActionToggle}
      />
      <Button title="Send setMenuItemOptions" onPress={sendActionCommand} />

      <Text style={styles.heading}>setMenuOptions (Menu 1)</Text>
      <SettingsPicker<MenuId>
        label="target id"
        value={menuId}
        items={[...MENU_IDS]}
        onValueChange={setMenuId}
      />
      <SettingsPicker<TitleOption>
        label="title"
        value={menuTitle}
        items={[...TITLE_OPTIONS]}
        onValueChange={setMenuTitle}
      />
      <SettingsPicker<IconOption>
        label="icon"
        value={menuIcon}
        items={[...ICON_OPTIONS]}
        onValueChange={setMenuIcon}
      />
      <Button title="Send setMenuOptions" onPress={sendMenuCommand} />

      <LongText />
    </ScrollView>
  );
}

export default createScenario(TestStackHeaderMenuIOS, scenarioDescription);

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 10,
  },
});
