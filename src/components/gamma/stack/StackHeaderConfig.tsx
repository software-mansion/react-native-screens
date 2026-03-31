import React from 'react';
import { StyleSheet } from 'react-native';
import StackHeaderConfigNativeComponent from '../../../fabric/gamma/stack/StackHeaderConfigNativeComponent';
import StackHeaderItemIOSNativeComponent from '../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import StackHeaderItemSpacerIOSNativeComponent from '../../../fabric/gamma/stack/StackHeaderItemSpacerIOSNativeComponent';
import StackHeaderConfigProps from './StackHeaderConfig.ios.types';
import type {
  HeaderItem,
  HeaderSpacerItem,
} from './StackHeaderConfig.ios.types';

type HeaderItemPlacement =
  | 'left'
  | 'right'
  | 'title'
  | 'subtitle'
  | 'largeSubtitle';

function makeItemViewFromItem(
  item: HeaderItem,
  placement: HeaderItemPlacement,
) {
  if ('component' in item) {
    const { key, component: ItemComponent, ...rest } = item;
    return (
      <StackHeaderItemIOSNativeComponent
        key={key}
        placement={placement}
        {...rest}>
        <ItemComponent />
      </StackHeaderItemIOSNativeComponent>
    );
  }

  if ('spacer' in item) {
    const { key, spacer, ...rest } = item as HeaderSpacerItem;
    return (
      <StackHeaderItemSpacerIOSNativeComponent
        key={key}
        placement={placement}
        size={spacer}
        {...rest}
      />
    );
  }

  const { key, ...rest } = item;

  return (
    <StackHeaderItemIOSNativeComponent
      key={key}
      placement={placement}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  config: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default function StackHeaderConfig(props: StackHeaderConfigProps) {
  const {
    leftItems,
    rightItems,
    titleItem,
    subtitleItem,
    largeSubtitleItem,
    largeTitleEnabled,
    ...restProps
  } = props;

  return (
    <StackHeaderConfigNativeComponent
      {...restProps}
      largeTitle={!!largeTitleEnabled}
      style={styles.config}>
      {leftItems?.map(item => makeItemViewFromItem(item, 'left'))}
      {titleItem && makeItemViewFromItem(titleItem, 'title')}
      {subtitleItem && makeItemViewFromItem(subtitleItem, 'subtitle')}
      {largeSubtitleItem &&
        makeItemViewFromItem(largeSubtitleItem, 'largeSubtitle')}
      {rightItems?.map(item => makeItemViewFromItem(item, 'right'))}
    </StackHeaderConfigNativeComponent>
  );
}
