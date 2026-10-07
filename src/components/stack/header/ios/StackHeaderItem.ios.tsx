import React, { useCallback, useMemo } from 'react';
import StackHeaderItemIOSNativeComponent from '../../../../fabric/stack/StackHeaderItemIOSNativeComponent';
import type { HeaderItemPressEvent } from '../../../../fabric/stack/StackHeaderItemIOSNativeComponent';
import type { StackHeaderItemProps } from './StackHeaderItem.ios.types';
import { NativeSyntheticEvent, StyleSheet } from 'react-native';
import { resolveIconAssetSources, resolveMenuIcons } from './iconUtils.ios';

export default function StackHeaderItem(props: StackHeaderItemProps) {
  const { render, onPress, icon, menu, menuRepresentation, ...rest } = props;

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
  const resolvedMenuRepresentation = useMemo(
    () =>
      menuRepresentation != null
        ? resolveMenuIcons(menuRepresentation)
        : undefined,
    [menuRepresentation],
  );

  return (
    <StackHeaderItemIOSNativeComponent
      {...rest}
      icon={resolvedIcon}
      menu={resolvedMenu}
      menuRepresentation={resolvedMenuRepresentation}
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
