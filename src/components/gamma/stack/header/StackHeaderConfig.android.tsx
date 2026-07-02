import React, {
  ComponentRef,
  forwardRef,
  Ref,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Image,
  type NativeSyntheticEvent,
  processColor,
  StyleSheet,
} from 'react-native';
import type {
  StackHeaderConfigProps,
  StackHeaderConfigRef,
} from './StackHeaderConfig.types';
import StackHeaderConfigAndroidNativeComponent, {
  Commands as StackHeaderConfigAndroidNativeCommands,
} from '../../../../fabric/gamma/stack/StackHeaderConfigAndroidNativeComponent';
import type {
  NativeProps as StackHeaderConfigAndroidNativeComponentProps,
  StackHeaderToolbarMenuBaseAndroid as NativeToolbarMenuBaseAndroid,
  StackHeaderToolbarMenuElementAndroid as NativeToolbarMenuElementAndroid,
  StackHeaderToolbarMenuItemPressEventAndroid,
  StackHeaderToolbarMenuGroupSelectionChangeEventAndroid,
  StackHeaderToolbarMenuElementOptionsAndroid as NativeToolbarMenuElementOptionsAndroid,
} from '../../../../fabric/gamma/stack/StackHeaderConfigAndroidNativeComponent';
import StackHeaderSubview from './android/StackHeaderSubview.android';
import type {
  StackHeaderConfigPropsAndroid,
  StackHeaderToolbarMenuBaseAndroid,
  StackHeaderToolbarMenuElementAndroid,
  StackHeaderToolbarMenuItemAndroid,
  StackHeaderToolbarMenuItemBaseAndroid,
  StackHeaderTypeAndroid,
  StackHeaderToolbarMenuElementOptionsAndroid,
  StackHeaderToolbarMenuGroupAndroid,
} from './StackHeaderConfig.android.types';
import { parseAndroidIconToNativeProps } from '../../../shared';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHeaderConfig(
  props: StackHeaderConfigProps,
  forwardedRef: Ref<StackHeaderConfigRef>,
) {
  // ios props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { android, ios, ...baseProps } = props;

  const ref = useHeaderConfigRef(forwardedRef);

  const {
    backgroundSubview,
    leadingSubview,
    centerSubview,
    trailingSubview,
    backButtonIcon,
    scrollFlagScroll,
    scrollFlagEnterAlways,
    scrollFlagEnterAlwaysCollapsed,
    scrollFlagExitUntilCollapsed,
    scrollFlagSnap,
    toolbarMenu,
    toolbarMenuGroupDividerEnabled,
    ...filteredAndroidProps
  } = android ?? {};

  const parsedToolbarMenu = parseToolbarMenuToNativeProps(toolbarMenu);
  const handleToolbarMenuItemPress = (
    event: NativeSyntheticEvent<StackHeaderToolbarMenuItemPressEventAndroid>,
  ) => {
    const element = findToolbarMenuElementById(
      toolbarMenu?.children,
      event.nativeEvent.id,
    );
    if (element?.type === 'menuItem') {
      element.onPress?.();
    }
  };

  const handleToolbarMenuGroupSelectionChange = (
    event: NativeSyntheticEvent<StackHeaderToolbarMenuGroupSelectionChangeEventAndroid>,
  ) => {
    const { groupId, selectedIds } = event.nativeEvent;
    const group = findToolbarMenuGroupById(toolbarMenu, groupId);
    group?.onSelectionChange?.(selectedIds);
  };

  const backButtonIconProps = parseBackButtonIconToNativeProps(backButtonIcon);
  const scrollFlagProps = resolveScrollFlags(filteredAndroidProps.type, {
    scrollFlagScroll,
    scrollFlagEnterAlways,
    scrollFlagEnterAlwaysCollapsed,
    scrollFlagExitUntilCollapsed,
    scrollFlagSnap,
  });

  return (
    <StackHeaderConfigAndroidNativeComponent
      ref={ref}
      collapsable={false}
      style={StyleSheet.absoluteFill}
      toolbarMenu={parsedToolbarMenu}
      toolbarMenuGroupDividerEnabled={toolbarMenuGroupDividerEnabled}
      onToolbarMenuItemPress={handleToolbarMenuItemPress}
      onToolbarMenuGroupSelectionChange={handleToolbarMenuGroupSelectionChange}
      {...baseProps}
      {...filteredAndroidProps}
      {...backButtonIconProps}
      {...scrollFlagProps}>
      {/*
        Please note that the order of the subviews MUST match
        the order in native StackHeaderConfig.getConfigSubviewAt.
        */}
      {backgroundSubview && (
        <StackHeaderSubview
          type="background"
          collapseMode={backgroundSubview.collapseMode}>
          {backgroundSubview.render()}
        </StackHeaderSubview>
      )}
      {leadingSubview && (
        <StackHeaderSubview type="leading">
          {leadingSubview.render()}
        </StackHeaderSubview>
      )}
      {centerSubview && (
        <StackHeaderSubview type="center">
          {centerSubview.render()}
        </StackHeaderSubview>
      )}
      {trailingSubview && (
        <StackHeaderSubview type="trailing">
          {trailingSubview.render()}
        </StackHeaderSubview>
      )}
    </StackHeaderConfigAndroidNativeComponent>
  );
}

function parseBackButtonIconToNativeProps(
  icon: StackHeaderConfigPropsAndroid['backButtonIcon'],
): Pick<
  StackHeaderConfigAndroidNativeComponentProps,
  'backButtonImageIconResource' | 'backButtonDrawableIconResourceName'
> {
  if (!icon) {
    return {};
  }

  if (icon.type === 'imageSource') {
    const resolved = Image.resolveAssetSource(icon.imageSource);
    if (!resolved) {
      console.error(
        '[RNScreens] failed to resolve an asset for back button icon',
      );
    }
    return {
      backButtonImageIconResource: resolved || undefined,
    };
  } else if (icon.type === 'drawableResource') {
    return {
      backButtonDrawableIconResourceName: icon.name,
    };
  } else {
    throw new Error(
      '[RNScreens] Incorrect icon format for Android. You must provide `imageSource` or `drawableResource`.',
    );
  }
}

type ScrollFlagFields = {
  scrollFlagScroll: boolean;
  scrollFlagEnterAlways: boolean;
  scrollFlagEnterAlwaysCollapsed: boolean;
  scrollFlagExitUntilCollapsed: boolean;
  scrollFlagSnap: boolean;
};

const SCROLL_FLAG_DEFAULTS_BY_TYPE: Record<
  StackHeaderTypeAndroid,
  ScrollFlagFields
> = {
  small: {
    scrollFlagScroll: false,
    scrollFlagEnterAlways: false,
    scrollFlagEnterAlwaysCollapsed: false,
    scrollFlagExitUntilCollapsed: false,
    scrollFlagSnap: false,
  },
  medium: {
    scrollFlagScroll: true,
    scrollFlagEnterAlways: false,
    scrollFlagEnterAlwaysCollapsed: false,
    scrollFlagExitUntilCollapsed: true,
    scrollFlagSnap: true,
  },
  large: {
    scrollFlagScroll: true,
    scrollFlagEnterAlways: false,
    scrollFlagEnterAlwaysCollapsed: false,
    scrollFlagExitUntilCollapsed: true,
    scrollFlagSnap: true,
  },
};

function resolveScrollFlags(
  type: StackHeaderTypeAndroid | undefined,
  overrides: Pick<StackHeaderConfigPropsAndroid, keyof ScrollFlagFields>,
): ScrollFlagFields {
  const defaults = SCROLL_FLAG_DEFAULTS_BY_TYPE[type ?? 'small'];
  return {
    scrollFlagScroll: overrides.scrollFlagScroll ?? defaults.scrollFlagScroll,
    scrollFlagEnterAlways:
      overrides.scrollFlagEnterAlways ?? defaults.scrollFlagEnterAlways,
    scrollFlagEnterAlwaysCollapsed:
      overrides.scrollFlagEnterAlwaysCollapsed ??
      defaults.scrollFlagEnterAlwaysCollapsed,
    scrollFlagExitUntilCollapsed:
      overrides.scrollFlagExitUntilCollapsed ??
      defaults.scrollFlagExitUntilCollapsed,
    scrollFlagSnap: overrides.scrollFlagSnap ?? defaults.scrollFlagSnap,
  };
}

function useHeaderConfigRef(forwardedRef: Ref<StackHeaderConfigRef>) {
  const ref =
    useRef<ComponentRef<typeof StackHeaderConfigAndroidNativeComponent>>(null);

  useImperativeHandle(forwardedRef, () => ({
    android: {
      setToolbarMenuElementOptions: (id, options) => {
        if (!ref.current) {
          console.warn(
            '[RNScreens] Reference to native header config component has not been updated yet.',
          );
          return;
        }

        StackHeaderConfigAndroidNativeCommands.setToolbarMenuElementOptions(
          ref.current,
          id,
          parseToolbarMenuElementOptionsToNativeProps(options),
        );
      },
    },
  }));

  return ref;
}

function findToolbarMenuGroupById(
  menu: StackHeaderToolbarMenuBaseAndroid | undefined,
  groupId: string,
): StackHeaderToolbarMenuGroupAndroid | null {
  if (!menu) {
    return null;
  }
  for (const group of menu.groups ?? []) {
    if (group.groupId === groupId) {
      return group;
    }
  }
  for (const element of menu.children ?? []) {
    if (element.type === 'menu') {
      const found = findToolbarMenuGroupById(element, groupId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function findToolbarMenuElementById(
  elements: StackHeaderToolbarMenuElementAndroid[] | undefined,
  id: string,
): StackHeaderToolbarMenuElementAndroid | null {
  if (!elements) {
    return null;
  }
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }
    if (element.type === 'menu') {
      const found = findToolbarMenuElementById(element.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function parseToolbarMenuToNativeProps(
  menu: StackHeaderToolbarMenuBaseAndroid | undefined,
): NativeToolbarMenuBaseAndroid | undefined {
  if (!menu?.children?.length) {
    return undefined;
  }
  assertUniqueItemIds(menu.children);
  assertUniqueGroupIds(menu);
  assertGroupIdReferencesExist(menu);
  assertRadioInitialSelection(menu);
  return {
    groups: parseGroupsToNativeProps(menu.groups),
    children: menu.children.map(parseElementToNativeProps),
  };
}

function parseGroupsToNativeProps(
  groups: StackHeaderToolbarMenuGroupAndroid[] | undefined,
) {
  if (!groups?.length) {
    return undefined;
  }
  return groups.map(({ groupId, singleSelection }) => ({
    groupId,
    singleSelection,
  }));
}

function parseElementToNativeProps(
  element: StackHeaderToolbarMenuElementAndroid,
): NativeToolbarMenuElementAndroid {
  if (element.type === 'menu') {
    const { type, children, groups, ...baseProps } = element;
    return {
      type,
      ...parseBaseItemToNativeProps(baseProps),
      groups: parseGroupsToNativeProps(groups),
      children: children?.map(parseElementToNativeProps),
    };
  }

  assertItemTypeGroupIdConsistency(element);
  assertNoOnPressOnToggleItem(element);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, onPress, groupId, itemType, initialToggleState, ...baseProps } =
    element;
  return {
    type,
    groupId,
    itemType,
    initialToggleState,
    ...parseBaseItemToNativeProps(baseProps),
  };
}

function assertUniqueItemIds(
  elements: StackHeaderToolbarMenuElementAndroid[],
  seen: Set<string> = new Set(),
): void {
  for (const element of elements) {
    if (seen.has(element.id)) {
      throw new Error(
        `[RNScreens] Duplicate toolbar menu item id: '${element.id}'. ` +
          `Item IDs must be unique across the entire menu.`,
      );
    }
    seen.add(element.id);
    if (element.type === 'menu' && element.children) {
      assertUniqueItemIds(element.children, seen);
    }
  }
}

function assertUniqueGroupIds(
  menu: StackHeaderToolbarMenuBaseAndroid,
  seen: Set<string> = new Set(),
): void {
  if (menu.groups) {
    for (const group of menu.groups) {
      if (seen.has(group.groupId)) {
        throw new Error(
          `[RNScreens] Duplicate toolbar menu group id: '${group.groupId}'. ` +
            `Group IDs must be unique across the entire menu.`,
        );
      }
      seen.add(group.groupId);
    }
  }
  if (menu.children) {
    for (const element of menu.children) {
      if (element.type === 'menu') {
        assertUniqueGroupIds(element, seen);
      }
    }
  }
}

function assertGroupIdReferencesExist(
  menu: StackHeaderToolbarMenuBaseAndroid,
): void {
  const localGroupIds = new Set(menu.groups?.map(g => g.groupId));
  if (menu.children) {
    for (const element of menu.children) {
      if (element.type === 'menuItem' && element.groupId != null) {
        if (!localGroupIds.has(element.groupId)) {
          throw new Error(
            `[RNScreens] Menu item '${element.id}' references group ` +
              `'${element.groupId}' which is not defined at the same ` +
              `menu level. Groups cannot span submenus.`,
          );
        }
      }
      if (element.type === 'menu') {
        assertGroupIdReferencesExist(element);
      }
    }
  }
}

function assertRadioInitialSelection(
  menu: StackHeaderToolbarMenuBaseAndroid,
): void {
  if (menu.groups && menu.children) {
    for (const group of menu.groups) {
      if (!group.singleSelection) {
        continue;
      }
      let count = 0;
      for (const element of menu.children) {
        if (
          element.type === 'menuItem' &&
          element.groupId === group.groupId &&
          element.initialToggleState
        ) {
          count++;
        }
      }
      if (count > 1) {
        throw new Error(
          `[RNScreens] Radio group '${group.groupId}' has ${count} items ` +
            `with initialToggleState=true. At most 1 is allowed for ` +
            `single-selection groups.`,
        );
      }
    }
  }
  if (menu.children) {
    for (const element of menu.children) {
      if (element.type === 'menu') {
        assertRadioInitialSelection(element);
      }
    }
  }
}

function assertItemTypeGroupIdConsistency(
  element: StackHeaderToolbarMenuItemAndroid,
): void {
  if (element.itemType === 'toggle' && element.groupId == null) {
    throw new Error(
      `[RNScreens] Menu item '${element.id}' has itemType='toggle' ` +
        `but no groupId. Toggle items must belong to a group.`,
    );
  }

  if (element.itemType === 'action' && element.groupId != null) {
    throw new Error(
      `[RNScreens] Menu item '${element.id}' has itemType='action' ` +
        `and belongs to group '${element.groupId}'. ` +
        `Action items cannot belong to groups.`,
    );
  }
}

function assertNoOnPressOnToggleItem(
  element: StackHeaderToolbarMenuItemAndroid,
): void {
  if (!element.onPress) {
    return;
  }

  const effectiveItemType = element.itemType ?? 'automatic';

  if (effectiveItemType === 'toggle') {
    throw new Error(
      `[RNScreens] Menu item '${element.id}' has itemType='toggle' and defines onPress. ` +
        `Toggle items do not emit press events. Use onSelectionChange on the group instead.`,
    );
  }

  if (effectiveItemType === 'automatic' && element.groupId != null) {
    throw new Error(
      `[RNScreens] Menu item '${element.id}' belongs to group '${element.groupId}' ` +
        `and defines onPress. Items in a group behave as toggles and do not emit press events. ` +
        `Use onSelectionChange on the group instead.`,
    );
  }
}

function parseBaseItemToNativeProps({
  icon,
  iconTintColorNormal,
  iconTintColorPressed,
  iconTintColorFocused,
  iconTintColorDisabled,
  ...rest
}: StackHeaderToolbarMenuItemBaseAndroid) {
  return {
    ...rest,
    ...parseAndroidIconToNativeProps(icon),
    iconTintColorNormal: processColor(iconTintColorNormal),
    iconTintColorPressed: processColor(iconTintColorPressed),
    iconTintColorFocused: processColor(iconTintColorFocused),
    iconTintColorDisabled: processColor(iconTintColorDisabled),
  };
}

function parseToolbarMenuElementOptionsToNativeProps(
  options: StackHeaderToolbarMenuElementOptionsAndroid,
): NativeToolbarMenuElementOptionsAndroid[] {
  const nativeOptions: NativeToolbarMenuElementOptionsAndroid =
    Object.fromEntries(
      Object.entries(options).flatMap(([key, value]): [string, unknown][] => {
        const typedKey =
          key as keyof StackHeaderToolbarMenuElementOptionsAndroid;

        switch (typedKey) {
          case 'iconTintColorNormal':
          case 'iconTintColorPressed':
          case 'iconTintColorFocused':
          case 'iconTintColorDisabled':
            return [
              [
                key,
                processColor(
                  value as StackHeaderToolbarMenuElementOptionsAndroid[typeof typedKey],
                ) ?? null,
              ],
            ];

          case 'icon': {
            const iconValue =
              value as StackHeaderToolbarMenuElementOptionsAndroid['icon'];

            // Explicit `undefined` means "reset the icon". The native side treats
            // an absent key as "no change", so to clear the icon we must send every
            // native icon key explicitly as `null`.
            if (iconValue === undefined) {
              const noIcon: Pick<
                NativeToolbarMenuElementOptionsAndroid,
                'imageIconResource' | 'drawableIconResourceName'
              > = {
                imageIconResource: null,
                drawableIconResourceName: null,
              };
              return Object.entries(noIcon);
            }

            return Object.entries(parseAndroidIconToNativeProps(iconValue));
          }
        }

        if (
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        ) {
          throw new Error(`[RNScreens] Unexpected nested object.`);
        }

        return [
          [
            key,
            // We need to replace explicit `undefined` with `null`
            // so that we're able to read that information on the native side.
            value === undefined ? null : value,
          ],
        ];
      }),
    );

  // For some reason Codegen requires passing an array (we can't use plain object).
  return [nativeOptions];
}

export default forwardRef<StackHeaderConfigRef, StackHeaderConfigProps>(
  StackHeaderConfig,
);
