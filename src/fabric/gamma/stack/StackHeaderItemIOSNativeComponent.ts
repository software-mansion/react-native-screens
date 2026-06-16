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

export type StackHeaderMenuItem = {
  menuElementId: string;
  type: 'menuItem';
  title?: string | undefined;
};

export type StackHeaderMenu = {
  menuElementId: string;
  type: 'menu';
  title?: string | undefined;
  children: StackHeaderMenuElement[];
};

export type StackHeaderMenuElement = StackHeaderMenuItem | StackHeaderMenu;

export interface NativeProps extends ViewProps {
  placement?: CT.WithDefault<Placement, 'trailing'>;
  label?: string | undefined;
  menu?: UnsafeMixed<StackHeaderMenu> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSStackHeaderItemIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
