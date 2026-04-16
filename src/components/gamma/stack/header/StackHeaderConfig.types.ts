import { StackHeaderConfigPropsAndroid } from './StackHeaderConfig.android.types';
import { StackHeaderConfigPropsIOS } from './StackHeaderConfig.ios.types';

export interface StackHeaderConfigPropsBase {
  /**
   * @summary Title displayed in the header.
   *
   * @platform android, ios
   */
  title?: string | undefined;
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
