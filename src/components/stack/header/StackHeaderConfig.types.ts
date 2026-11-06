import type { Ref } from 'react';
import type { StackHeaderConfigCommandsAndroid } from './StackHeaderConfig.android.types';
import { StackHeaderConfigPropsAndroid } from './StackHeaderConfig.android.types';
import type { StackHeaderConfigCommandsIOS } from './StackHeaderConfig.ios.types';
import { StackHeaderConfigPropsIOS } from './StackHeaderConfig.ios.types';

/**
 * @summary Where the header of a screen is rendered.
 *
 * @description
 * - `float`: the screen uses the navigation bar shared by the whole stack.
 *   Only the content of the bar changes between screens.
 * - `screen`: the screen renders its own navigation bar, which is part of
 *   the screen and moves together with it during transitions.
 *
 * @platform android, ios
 */
export type StackHeaderMode = 'float' | 'screen';

export interface StackHeaderConfigPropsBase {
  /**
   * @summary Title displayed in the header.
   *
   * @platform android, ios
   */
  title?: string | undefined;
  /**
   * @summary Subtitle displayed in the header.
   *
   * @platform android, ios
   */
  subtitle?: string | undefined;
  /**
   * @summary Specifies if the header should be hidden.
   *
   * @default false
   *
   * @platform android, ios
   */
  hidden?: boolean | undefined;
  /**
   * @summary Specifies if the content should be rendered behind the header.
   *
   * @description
   * When `true`, content is rendered behind the header instead of starting
   * below it.
   *
   * On Android:
   * - The header background color is not affected by this prop.
   * - Setting this prop to `true` is not supported when header scrolling is
   *   enabled.
   *
   * @default false
   *
   * @platform android, ios
   */
  transparent?: boolean | undefined;
  /**
   * @summary Specifies if the back button should be hidden.
   *
   * @description
   * This prop does not apply to the root screen of the stack for which the back
   * button is always hidden.
   *
   * @default false
   *
   * @platform android, ios
   */
  backButtonHidden?: boolean | undefined;
  /**
   * @summary Specifies if the screen uses the navigation bar shared by the
   * stack or renders a navigation bar of its own.
   *
   * @description
   * With `float`, every screen of the stack shares one navigation bar and only
   * its content (title, items, back button) is swapped during transitions.
   *
   * With `screen`, the screen gets its own navigation bar placed at the top of
   * the screen. The bar is a part of the screen, so it slides together with the
   * screen when it is pushed or popped. The shared navigation bar is hidden
   * while such a screen is on top.
   *
   * On iOS, in `screen` mode the following are not supported, because UIKit
   * drives them only for the shared navigation bar:
   * - collapsing large title (`ios.largeTitleEnabled` is ignored),
   * - navigation bar minimization (`ios.minimizationBehavior`),
   * - scroll edge appearance tracking.
   *
   * On Android, every screen always renders its own header, so the header
   * always moves together with the screen. The value is accepted, but it does
   * not change the behavior.
   *
   * @default 'float'
   *
   * @platform android, ios
   */
  headerMode?: StackHeaderMode | undefined;
}

export interface StackHeaderConfigProps extends StackHeaderConfigPropsBase {
  android?: StackHeaderConfigPropsAndroid | undefined;
  ios?: StackHeaderConfigPropsIOS | undefined;
  ref?: Ref<StackHeaderConfigRef> | undefined;
}

export interface StackHeaderConfigRef {
  android?: StackHeaderConfigCommandsAndroid;
  ios?: StackHeaderConfigCommandsIOS;
}
