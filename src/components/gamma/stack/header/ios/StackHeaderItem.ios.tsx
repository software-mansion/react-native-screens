import React, { useCallback, useMemo } from 'react';
import StackHeaderItemIOSNativeComponent from '../../../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import type {
  HeaderItemPressEvent,
  PlatformIconIOS as ResolvedPlatformIconIOS,
} from '../../../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import type { StackHeaderItemProps } from './StackHeaderItem.ios.types';
import type { PlatformIconIOS } from '../../../../../types';
import type {
  StackHeaderMenuIOS,
  StackHeaderMenuElementIOS,
} from './StackHeaderMenu.ios.types';
import { Image, NativeSyntheticEvent, StyleSheet } from 'react-native';

function resolveIconAssetSources(
  icon: PlatformIconIOS | undefined,
): ResolvedPlatformIconIOS | undefined {
  if (icon == null) {
    return undefined;
  }
  if (icon.type === 'imageSource') {
    const resolvedSource = Image.resolveAssetSource(icon.imageSource);

    if (!resolvedSource) {
      return undefined;
    }

    return {
      type: 'imageSource',
      imageSource: resolvedSource,
    };
  }
  if (icon.type === 'templateSource') {
    const resolvedTemplate = Image.resolveAssetSource(icon.templateSource);

    if (!resolvedTemplate) {
      return undefined;
    }

    return {
      type: 'templateSource',
      templateSource: resolvedTemplate,
    };
  }
  return icon;
}

function resolveMenuElementIcons(
  element: StackHeaderMenuElementIOS,
): StackHeaderMenuElementIOS {
  if (element.type === 'menuItem') {
    if (element.icon == null) {
      return element;
    }
    return { ...element, icon: resolveIconAssetSources(element.icon) };
  }
  return resolveMenuIcons(element);
}

function resolveMenuIcons(menu: StackHeaderMenuIOS): StackHeaderMenuIOS {
  const resolvedIcon = resolveIconAssetSources(menu.icon);
  const resolvedChildren = menu.children.map(resolveMenuElementIcons);
  return { ...menu, icon: resolvedIcon, children: resolvedChildren };
}

export default function StackHeaderItem(props: StackHeaderItemProps) {
  const { render, onPress, icon, menu, ...rest } = props;

  // `rest.menu` includes some JS callback within nested menu specification
  // codegen strips JS functions and replaces them with NULLT and keys of such type
  // are omitted inside RNSConvertFollyDynamicToId so we can safely pass `rest.menu` as-is

  const handlePress = useCallback(
    (_event: NativeSyntheticEvent<HeaderItemPressEvent>) => {
      onPress?.();
    },
    [onPress],
  );

  const resolvedIcon = useMemo(() => resolveIconAssetSources(icon), [icon]);
  const resolvedMenu = useMemo(
    () => (menu != null ? resolveMenuIcons(menu) : undefined),
    [menu],
  );

  return (
    <StackHeaderItemIOSNativeComponent
      {...rest}
      icon={resolvedIcon}
      menu={resolvedMenu}
      // We need to tell iOS that we want the handler to be attached only when we actually require it
      // because doing so makes the menu appear on long press instead of tap
      respondsToOnPress={!!onPress}
      onHeaderItemPress={handlePress}
      style={styles.config}>
      {render?.()}
    </StackHeaderItemIOSNativeComponent>
  );
}

const styles = StyleSheet.create({
  config: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
