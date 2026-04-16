import { StackHeaderConfigPropsAndroid } from './StackHeaderConfig.android.types';
import { StackHeaderConfigPropsIOS } from './StackHeaderConfig.ios.types';

export interface StackHeaderConfigPropsBase {
  /**
   * @summary Title displayed in the header.
   *
   * @platform android, ios
   */
  title?: string;
  /**
   * @summary Specifies if the header should be hidden.
   *
   * @default false
   *
   * @platform android, ios
   */
  hidden?: boolean;
  /**
   * @todo
   *
   * @default false
   *
   * @platform android, ios
   */
  transparent?: boolean;
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
  backButtonHidden?: boolean;
}

export interface StackHeaderConfigProps extends StackHeaderConfigPropsBase {
  android?: StackHeaderConfigPropsAndroid;
  ios?: StackHeaderConfigPropsIOS;
}
