import React, {
  type ComponentRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import type { StackHeaderConfigProps } from './StackHeaderConfig.types';
import StackHeaderConfigIOSNativeComponent, {
  Commands as StackHeaderConfigIOSNativeCommands,
  ButtonAppearance,
  ButtonStateAppearance,
  HeaderAppearance,
  MenuItemPressEvent,
  MenuSelectionChangeEvent,
  NativeMenuElementOptionsIOS,
} from '../../../fabric/stack/StackHeaderConfigIOSNativeComponent';
import type { StackHeaderItemPlacement } from './ios/StackHeaderItem.ios.types';
import { StackHeaderItemSpacerPlacement } from './ios/StackHeaderItemSpacer.ios.types';
import StackHeaderItemSpacer from './ios/StackHeaderItemSpacer.ios';
import StackHeaderItem from './ios/StackHeaderItem.ios';
import {
  NativeSyntheticEvent,
  StyleSheet,
  processColor,
  type TextStyle,
} from 'react-native';
import type {
  StackHeaderAppearanceIOS,
  StackHeaderButtonAppearanceIOS,
  StackHeaderButtonStateAppearanceIOS,
  StackHeaderInlineCustomItemIOS,
  StackHeaderInlineItemIOS,
  StackHeaderMenuItemOptionsIOS,
  StackHeaderMenuOptionsIOS,
  StackHeaderSpacerItemIOS,
  StackHeaderTitleCustomItemIOS,
} from './StackHeaderConfig.ios.types';
import { findMenuElementByIdInMenus, validateMenuCallbacks } from './utils';
import { resolveIconAssetSources, resolveMenuIcons } from './ios/iconUtils.ios';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHeaderConfig(props: StackHeaderConfigProps) {
  // android props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref: forwardedRef, ios, android, ...restProps } = props;

  const {
    leadingItems,
    trailingItems,
    titleItem,
    titleMenu,
    subtitleItem,
    largeSubtitleItem,
    largeTitle,
    largeSubtitle,
    largeTitleEnabled,
    prompt,
    minimizationBehavior,
    restorationBehavior,
    backButtonTitle,
    backButtonDisplayMode,
    backButtonMenuEnabled,
    standardAppearance,
    scrollEdgeAppearance,
  } = ios ?? {};

  const nativeRef =
    useRef<ComponentRef<typeof StackHeaderConfigIOSNativeComponent>>(null);

  useImperativeHandle(forwardedRef, () => ({
    ios: {
      setMenuItemOptions: (
        menuElementId: string,
        options: StackHeaderMenuItemOptionsIOS,
      ) => {
        if (!nativeRef.current) {
          console.warn(
            '[RNScreens] Reference to native header config component has not been updated yet.',
          );
          return;
        }
        StackHeaderConfigIOSNativeCommands.setMenuItemOptions(
          nativeRef.current,
          menuElementId,
          parseMenuElementOptionsToNative(options),
        );
      },
      setMenuOptions: (
        menuElementId: string,
        options: StackHeaderMenuOptionsIOS,
      ) => {
        if (!nativeRef.current) {
          console.warn(
            '[RNScreens] Reference to native header config component has not been updated yet.',
          );
          return;
        }
        StackHeaderConfigIOSNativeCommands.setMenuOptions(
          nativeRef.current,
          menuElementId,
          parseMenuElementOptionsToNative(options),
        );
      },
    },
  }));

  const allMenus = useMemo(
    () =>
      [
        ...(leadingItems ?? [])
          .filter(it => it && it.type === 'item')
          .flatMap(it => [it.menu, it.menuRepresentation]),
        ...(trailingItems ?? [])
          .filter(it => it && it.type === 'item')
          .flatMap(it => [it.menu, it.menuRepresentation]),
        titleMenu,
      ].filter(it => !!it),
    [leadingItems, trailingItems, titleMenu],
  );

  const handleMenuItemPress = useCallback(
    (event: NativeSyntheticEvent<MenuItemPressEvent>) => {
      const menuElement = findMenuElementByIdInMenus(
        allMenus,
        event.nativeEvent.menuItemId,
      );
      if (menuElement && menuElement.type === 'menuItem') {
        menuElement.onPress?.();
      }
    },
    [allMenus],
  );

  const handleSelectionChange = useCallback(
    (event: NativeSyntheticEvent<MenuSelectionChangeEvent>) => {
      const { menuId, selectedMenuItemIds } = event.nativeEvent;
      const menu = findMenuElementByIdInMenus(allMenus, menuId);
      if (menu && menu.type === 'menu') {
        menu.onSelectionChange?.(selectedMenuItemIds);
      }
    },
    [allMenus],
  );

  useEffect(() => {
    for (const menu of allMenus) {
      validateMenuCallbacks(menu);
    }
  }, [allMenus]);

  const resolvedTitleMenu = useMemo(
    () => (titleMenu != null ? resolveMenuIcons(titleMenu) : undefined),
    [titleMenu],
  );

  return (
    <StackHeaderConfigIOSNativeComponent
      ref={nativeRef}
      {...restProps}
      collapsable={false}
      backButtonTitle={backButtonTitle}
      backButtonDisplayMode={backButtonDisplayMode}
      backButtonMenuEnabled={backButtonMenuEnabled}
      largeTitle={largeTitle}
      largeSubtitle={largeSubtitle}
      largeTitleEnabled={!!largeTitleEnabled}
      prompt={prompt}
      minimizationBehavior={minimizationBehavior}
      restorationBehavior={restorationBehavior}
      standardAppearance={mapAppearanceToNativeProp(standardAppearance)}
      scrollEdgeAppearance={mapAppearanceToNativeProp(scrollEdgeAppearance)}
      titleMenu={resolvedTitleMenu}
      style={styles.config}
      onMenuItemPress={handleMenuItemPress}
      onMenuSelectionChange={handleSelectionChange}>
      {leadingItems?.map(item => makeItemViewFromItem(item, 'leading'))}
      {titleItem && makeItemViewFromItem(titleItem, 'title')}
      {subtitleItem && makeItemViewFromItem(subtitleItem, 'subtitle')}
      {largeSubtitleItem &&
        makeItemViewFromItem(largeSubtitleItem, 'largeSubtitle')}
      {trailingItems?.map(item => makeItemViewFromItem(item, 'trailing'))}
    </StackHeaderConfigIOSNativeComponent>
  );
}

function toNativeFontWeight(
  weight: TextStyle['fontWeight'],
): string | undefined {
  return weight !== undefined ? String(weight) : undefined;
}

const BUTTON_APPEARANCE_STATES = [
  'normal',
  'highlighted',
  'disabled',
  'focused',
] as const;

const BUTTON_STATE_APPEARANCE_KEYS = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'fontColor',
] as const;

function warnUnknownKeys(
  path: string,
  object: object,
  allowedKeys: readonly string[],
) {
  for (const key of Object.keys(object)) {
    if (!allowedKeys.includes(key)) {
      console.warn(`[Stack] Unsupported key "${key}" in ${path}`);
    }
  }
}

function assertsPlainObject(path: string, value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    console.warn(
      `[Stack] Expected ${path} to be an object, got ${typeof value}`,
    );
    return false;
  }

  return true;
}

function mapButtonStateAppearanceToNativeProp(
  path: string,
  stateAppearance?: StackHeaderButtonStateAppearanceIOS,
): ButtonStateAppearance | undefined {
  if (stateAppearance === undefined) return undefined;
  if (!assertsPlainObject(path, stateAppearance)) return undefined;

  warnUnknownKeys(path, stateAppearance, BUTTON_STATE_APPEARANCE_KEYS);

  // Font family, size and style pass through unchanged via the spread; color
  // and weight need conversion to the wire format.
  return {
    ...stateAppearance,
    fontColor: processColor(stateAppearance.fontColor),
    fontWeight: toNativeFontWeight(stateAppearance.fontWeight),
  };
}

function mapButtonAppearanceToNativeProp(
  path: string,
  buttonAppearance?: StackHeaderButtonAppearanceIOS,
): ButtonAppearance | undefined {
  if (buttonAppearance === undefined) return undefined;
  if (!assertsPlainObject(path, buttonAppearance)) return undefined;

  warnUnknownKeys(path, buttonAppearance, BUTTON_APPEARANCE_STATES);

  return {
    normal: mapButtonStateAppearanceToNativeProp(
      `${path}.normal`,
      buttonAppearance.normal,
    ),
    highlighted: mapButtonStateAppearanceToNativeProp(
      `${path}.highlighted`,
      buttonAppearance.highlighted,
    ),
    disabled: mapButtonStateAppearanceToNativeProp(
      `${path}.disabled`,
      buttonAppearance.disabled,
    ),
    focused: mapButtonStateAppearanceToNativeProp(
      `${path}.focused`,
      buttonAppearance.focused,
    ),
  };
}

function mapAppearanceToNativeProp(
  appearance?: StackHeaderAppearanceIOS,
): HeaderAppearance | undefined {
  if (!appearance) return undefined;

  // Font family, size and style pass through unchanged via the spread; color
  // and weight need conversion to the wire format.
  return {
    ...appearance,

    titleFontColor: processColor(appearance.titleFontColor),
    titleFontWeight: toNativeFontWeight(appearance.titleFontWeight),

    largeTitleFontColor: processColor(appearance.largeTitleFontColor),
    largeTitleFontWeight: toNativeFontWeight(appearance.largeTitleFontWeight),

    subtitleFontColor: processColor(appearance.subtitleFontColor),
    subtitleFontWeight: toNativeFontWeight(appearance.subtitleFontWeight),

    button: mapButtonAppearanceToNativeProp(
      'appearance.button',
      appearance.button,
    ),
    prominentButton: mapButtonAppearanceToNativeProp(
      'appearance.prominentButton',
      appearance.prominentButton,
    ),
  };
}

function makeItemViewFromItem(
  item:
    | StackHeaderInlineItemIOS
    | StackHeaderInlineCustomItemIOS
    | StackHeaderTitleCustomItemIOS
    | StackHeaderSpacerItemIOS,
  placement: StackHeaderItemPlacement,
) {
  if ('type' in item && item.type === 'spacer') {
    const { id, ...rest } = item;

    if (!(placement === 'leading' || placement === 'trailing')) {
      console.warn(
        `[Stack] Invalid placement for spacer: "${placement}", defaulting to "trailing"`,
      );
      placement = 'trailing';
    }

    return (
      <StackHeaderItemSpacer
        key={id}
        placement={placement as StackHeaderItemSpacerPlacement}
        {...rest}
      />
    );
  }

  const { id, ...rest } = item;

  return (
    <StackHeaderItem key={id} itemId={id} placement={placement} {...rest} />
  );
}

function parseMenuElementOptionsToNative(
  options: StackHeaderMenuItemOptionsIOS | StackHeaderMenuOptionsIOS,
): NativeMenuElementOptionsIOS[] {
  const nativeOptions: NativeMenuElementOptionsIOS = Object.fromEntries(
    Object.entries(options).flatMap(([key, value]): [string, unknown][] => {
      const typedKey = key as keyof (
        | StackHeaderMenuItemOptionsIOS
        | StackHeaderMenuOptionsIOS
      );
      switch (typedKey) {
        case 'icon':
          return [
            [
              'icon',
              options.icon === undefined
                ? null
                : resolveIconAssetSources(options.icon),
            ],
          ];
        default:
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
      }
    }),
  );

  // passing array here -- see android implementation
  return [nativeOptions];
}

const styles = StyleSheet.create({
  config: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default StackHeaderConfig;
