'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';
import { UnsafeMixed } from '../../codegenUtils';

export type Placement =
  | 'leading'
  | 'trailing'
  | 'title'
  | 'subtitle'
  | 'largeSubtitle';

export type StackHeaderMenuItemIOS = {
  id: string;
  type: 'menuItem';
  title?: string | undefined;
  keepsMenuPresented?: boolean | undefined;
};

export type StackHeaderMenuIOS = {
  id: string;
  type: 'menu';
  title?: string | undefined;
  children: StackHeaderMenuElementIOS[];
};

export type StackHeaderMenuElementIOS =
  | StackHeaderMenuItemIOS
  | StackHeaderMenuIOS;

// eslint-disable-next-line @typescript-eslint/ban-types
export type HeaderItemPressEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  placement?: CT.WithDefault<Placement, 'trailing'>;
  itemId?: string | undefined;
  title?: string | undefined;
  menu?: UnsafeMixed<StackHeaderMenuIOS> | undefined;
  respondsToOnPress?: CT.WithDefault<boolean, false>;
  onHeaderItemPress?: CT.DirectEventHandler<HeaderItemPressEvent> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSStackHeaderItemIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
