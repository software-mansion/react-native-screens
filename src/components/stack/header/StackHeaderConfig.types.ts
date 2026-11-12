import type { Ref } from 'react';
import type { StackHeaderConfigCommandsAndroid } from './StackHeaderConfig.android.types';
import { StackHeaderConfigPropsAndroid } from './StackHeaderConfig.android.types';
import type { StackHeaderConfigCommandsIOS } from './StackHeaderConfig.ios.types';
import { StackHeaderConfigPropsIOS } from './StackHeaderConfig.ios.types';

/**
 * Where the header of a screen is rendered.
 *
 * @remarks
 * The following values are supported:
 * - `'float'` — the screen uses the navigation bar shared by the whole stack.
 *   Only the content of the bar changes between screens.
 * - `'screen'` — the screen renders its own navigation bar, which is a part of
 *   the screen and moves together with it during transitions.
 */
export type StackHeaderMode = 'float' | 'screen';

/**
 * Cross-platform props for {@link Stack.HeaderConfig}.
 */
export interface StackHeaderConfigPropsBase {
  /**
   * Title displayed in the header.
   *
   * @platform android, ios
   */
  title?: string | undefined;
  /**
   * Subtitle displayed in the header.
   *
   * @platform android, ios
   */
  subtitle?: string | undefined;
  /**
   * Specifies if the header should be hidden.
   *
   * @defaultValue `false`
   * @platform android, ios
   */
  hidden?: boolean | undefined;
  /**
   * Specifies if the content should be rendered behind the header.
   *
   * @remarks
   * When `true`, content is rendered behind the header instead of starting
   * below it.
   *
   * On Android:
   * - The header background color is not affected by this prop.
   * - Setting this prop to `true` is not supported when header scrolling is
   *   enabled.
   *
   * @defaultValue `false`
   * @platform android, ios
   */
  transparent?: boolean | undefined;
  /**
   * Specifies if the back button should be hidden.
   *
   * @remarks
   * This prop does not apply to the root screen of the stack for which the back
   * button is always hidden.
   *
   * @defaultValue `false`
   * @platform android, ios
   */
  backButtonHidden?: boolean | undefined;
  /**
   * Whether the screen uses the navigation bar shared by the stack or renders
   * a navigation bar of its own.
   *
   * @remarks
   * With `'screen'`, the bar is a part of the screen, so it slides together
   * with the screen when it is pushed or popped. The shared navigation bar is
   * hidden while such a screen is on top.
   *
   * On iOS, `'screen'` does not support the following, because UIKit drives
   * them only for the shared navigation bar:
   * - collapsing large title (`ios.largeTitleEnabled` is ignored),
   * - navigation bar minimization (`ios.minimizationBehavior`),
   * - scroll edge appearance tracking,
   * - on iPhone Duo, moving the back button out of the bar, below the corner
   *   with the status bar.
   *
   * On Android, every screen always renders its own header, so the value does
   * not change the behavior.
   *
   * @defaultValue `'float'`
   * @platform android, ios
   */
  headerMode?: StackHeaderMode | undefined;
}

/**
 * Props for {@link Stack.HeaderConfig}.
 */
export interface StackHeaderConfigProps extends StackHeaderConfigPropsBase {
  /**
   * Android-specific props.
   *
   * @platform android
   */
  android?: StackHeaderConfigPropsAndroid | undefined;
  /**
   * iOS-specific props.
   *
   * @platform ios
   */
  ios?: StackHeaderConfigPropsIOS | undefined;
  /**
   * Ref to the {@link StackHeaderConfigRef | commands} of the header.
   *
   * @platform android, ios
   */
  ref?: Ref<StackHeaderConfigRef> | undefined;
}

/**
 * Commands of {@link Stack.HeaderConfig}, available through its `ref`.
 */
export interface StackHeaderConfigRef {
  /**
   * Android-specific commands.
   *
   * @platform android
   */
  android?: StackHeaderConfigCommandsAndroid | undefined;
  /**
   * iOS-specific commands.
   *
   * @platform ios
   */
  ios?: StackHeaderConfigCommandsIOS | undefined;
}
