import { StackHeaderConfigProps } from './StackHeaderConfig.types';
import StackHeaderConfigIOSNativeComponent from '../../../../fabric/gamma/stack/StackHeaderConfigIOSNativeComponent';
import React from 'react';
import { HeaderItemPlacement } from './ios/StackHeaderItem.ios.types';
import StackHeaderItemSpacer from './ios/StackHeaderItemSpacer.ios';
import StackHeaderItem from './ios/StackHeaderItem.ios';
import { StyleSheet } from 'react-native';
import {
  HeaderInlineCustomItem,
  HeaderInlineItem,
  HeaderSpacerItem,
  HeaderTitleCustomItem,
  HeaderTitleItem,
} from './StackHeaderConfig.ios.types';

function makeItemViewFromItem(
  item:
    | HeaderInlineItem
    | HeaderInlineCustomItem
    | HeaderTitleItem
    | HeaderTitleCustomItem
    | HeaderSpacerItem,
  placement: HeaderItemPlacement,
) {
  if ('type' in item && item.type === 'spacer') {
    const { key, ...rest } = item as HeaderSpacerItem;

    return (
      <StackHeaderItemSpacer
        key={key}
        itemKey={key}
        placement={placement}
        {...rest}
      />
    );
  }

  const { key, ...rest } = item;

  return (
    <StackHeaderItem key={key} itemKey={key} placement={placement} {...rest} />
  );
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function StackHeaderConfig(props: StackHeaderConfigProps) {
  // android props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ios, android, ...restProps } = props;

  const {
    leftItems,
    rightItems,
    titleItem,
    subtitleItem,
    largeSubtitleItem,
    largeTitleEnabled,
  } = ios ?? {};

  return (
    <StackHeaderConfigIOSNativeComponent
      {...restProps}
      collapsable={false}
      largeTitle={!!largeTitleEnabled}
      style={styles.config}>
      {leftItems?.map(item => makeItemViewFromItem(item, 'left'))}
      {titleItem && makeItemViewFromItem(titleItem, 'title')}
      {subtitleItem && makeItemViewFromItem(subtitleItem, 'subtitle')}
      {largeSubtitleItem &&
        makeItemViewFromItem(largeSubtitleItem, 'largeSubtitle')}
      {rightItems?.map(item => makeItemViewFromItem(item, 'right'))}
    </StackHeaderConfigIOSNativeComponent>
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
