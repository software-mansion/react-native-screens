import React from 'react';
import { StyleSheet } from 'react-native';
import SplitHeaderConfigNativeComponent from '../../../fabric/gamma/split/SplitHeaderConfigNativeComponent';
import SplitHeaderItemNativeComponent from '../../../fabric/gamma/split/SplitHeaderItemNativeComponent';
import SplitHeaderItemSpacerNativeComponent from '../../../fabric/gamma/split/SplitHeaderItemSpacerNativeComponent';
import SplitHeaderConfigProps from './SplitHeaderConfig.ios.types';
import type {
  HeaderItem,
  HeaderSpacerItem,
} from './SplitHeaderConfig.ios.types';

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
      <SplitHeaderItemNativeComponent
        key={key}
        placement={placement}
        {...rest}>
        <ItemComponent />
      </SplitHeaderItemNativeComponent>
    );
  }

  if ('spacer' in item) {
    const { key, spacer, ...rest } = item as HeaderSpacerItem;
    return (
      <SplitHeaderItemSpacerNativeComponent
        key={key}
        placement={placement}
        size={spacer}
        {...rest}
      />
    );
  }

  const { key, ...rest } = item;

  return (
    <SplitHeaderItemNativeComponent
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

export default function SplitHeaderConfig(props: SplitHeaderConfigProps) {
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
    <SplitHeaderConfigNativeComponent
      {...restProps}
      largeTitle={!!largeTitleEnabled}
      style={styles.config}>
      {leftItems?.map(item => makeItemViewFromItem(item, 'left'))}
      {titleItem && makeItemViewFromItem(titleItem, 'title')}
      {subtitleItem && makeItemViewFromItem(subtitleItem, 'subtitle')}
      {largeSubtitleItem &&
        makeItemViewFromItem(largeSubtitleItem, 'largeSubtitle')}
      {rightItems?.map(item => makeItemViewFromItem(item, 'right'))}
    </SplitHeaderConfigNativeComponent>
  );
}
