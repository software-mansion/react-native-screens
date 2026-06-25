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
  StackHeaderToolbarMenuItemClickedEventAndroid,
  StackHeaderToolbarMenuItemOptionsAndroid as NativeToolbarMenuItemOptionsAndroid,
} from '../../../../fabric/gamma/stack/StackHeaderConfigAndroidNativeComponent';
import StackHeaderSubview from './android/StackHeaderSubview.android';
import type {
  StackHeaderConfigPropsAndroid,
  StackHeaderToolbarMenuBaseAndroid,
  StackHeaderToolbarMenuElementAndroid,
  StackHeaderToolbarMenuItemBaseAndroid,
  StackHeaderTypeAndroid,
  StackHeaderToolbarMenuItemOptionsAndroid,
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
    ...filteredAndroidProps
  } = android ?? {};

  const parsedToolbarMenu = parseToolbarMenuToNativeProps(toolbarMenu);
  const handleToolbarMenuItemClicked = (
    event: NativeSyntheticEvent<StackHeaderToolbarMenuItemClickedEventAndroid>,
  ) => {
    const element = findToolbarMenuElementById(
      toolbarMenu?.children,
      event.nativeEvent.id,
    );
    if (element?.type === 'menuItem') {
      element.onPress?.();
    }
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
      onToolbarMenuItemClicked={handleToolbarMenuItemClicked}
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
      setToolbarMenuItemOptions: (id, options) => {
        if (!ref.current) {
          console.warn(
            '[RNScreens] Reference to native header config component has not been updated yet.',
          );
          return;
        }

        StackHeaderConfigAndroidNativeCommands.setToolbarMenuItemOptions(
          ref.current,
          id,
          parseToolbarMenuItemOptionsToNativeProps(options),
        );
      },
    },
  }));

  return ref;
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
  return {
    children: menu.children.map(parseElementToNativeProps),
  };
}

function parseElementToNativeProps(
  element: StackHeaderToolbarMenuElementAndroid,
): NativeToolbarMenuElementAndroid {
  if (element.type === 'menu') {
    const { type, children, ...baseProps } = element;
    return {
      type,
      ...parseBaseItemToNativeProps(baseProps),
      children: children?.map(parseElementToNativeProps),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, onPress, ...baseProps } = element;
  return {
    type,
    ...parseBaseItemToNativeProps(baseProps),
  };
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

function parseToolbarMenuItemOptionsToNativeProps(
  options: StackHeaderToolbarMenuItemOptionsAndroid,
): NativeToolbarMenuItemOptionsAndroid[] {
  const nativeOptions: NativeToolbarMenuItemOptionsAndroid = Object.fromEntries(
    Object.entries(options).flatMap(([key, value]): [string, unknown][] => {
      const typedKey = key as keyof StackHeaderToolbarMenuItemOptionsAndroid;

      switch (typedKey) {
        case 'iconTintColorNormal':
        case 'iconTintColorPressed':
        case 'iconTintColorFocused':
        case 'iconTintColorDisabled':
          return [
            [
              key,
              processColor(
                value as StackHeaderToolbarMenuItemOptionsAndroid[typeof typedKey],
              ) ?? null,
            ],
          ];

        case 'icon': {
          const iconValue =
            value as StackHeaderToolbarMenuItemOptionsAndroid['icon'];

          // Explicit `undefined` means "reset the icon". The native side treats
          // an absent key as "no change", so to clear the icon we must send every
          // native icon key explicitly as `null`.
          if (iconValue === undefined) {
            const noIcon: Pick<
              NativeToolbarMenuItemOptionsAndroid,
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
