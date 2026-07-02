import type { StackHeaderConfigCommandsAndroid } from './StackHeaderConfig.android.types';
import { StackHeaderConfigPropsAndroid } from './StackHeaderConfig.android.types';
import type { StackHeaderConfigCommandsIOS } from './StackHeaderConfig.ios.types';
import { StackHeaderConfigPropsIOS } from './StackHeaderConfig.ios.types';

export interface StackHeaderConfigPropsBase {
  /**
   * @summary Title displayed in the header.
   *
   * @platform android, ios
   */
  title?: string | undefined;
  /**
   * @summary Subtitle displayed in the header. Currently unsupported on Android.
   *
   * @platform ios
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
}

export interface StackHeaderConfigProps extends StackHeaderConfigPropsBase {
  android?: StackHeaderConfigPropsAndroid | undefined;
  ios?: StackHeaderConfigPropsIOS | undefined;
}

export interface StackHeaderConfigRef {
  android?: StackHeaderConfigCommandsAndroid;
  ios?: StackHeaderConfigCommandsIOS;
}
