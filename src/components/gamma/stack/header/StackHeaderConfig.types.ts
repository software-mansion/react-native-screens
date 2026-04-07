import { StackHeaderConfigPropsAndroid } from './StackHeaderConfig.android.types';
import { StackHeaderConfigPropsIOS } from './StackHeaderConfig.ios.types';

export interface StackHeaderConfigPropsBase {
  title?: string;
  hidden?: boolean;
  transparent?: boolean;
}

export interface StackHeaderConfigProps extends StackHeaderConfigPropsBase {
  android?: StackHeaderConfigPropsAndroid;
  ios?: StackHeaderConfigPropsIOS;
}
