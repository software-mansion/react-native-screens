import { StackHeaderConfigPropsAndroid } from './StackHeaderConfig.android.types';
import { StackHeaderConfigPropsIOS } from './StackHeaderConfig.ios.types';

export interface StackHeaderConfigPropsBase {
  title?: string | undefined;
  hidden?: boolean | undefined;
  transparent?: boolean | undefined;
  backButtonHidden?: boolean | undefined;
}

export interface StackHeaderConfigProps extends StackHeaderConfigPropsBase {
  android?: StackHeaderConfigPropsAndroid | undefined;
  ios?: StackHeaderConfigPropsIOS | undefined;
}
