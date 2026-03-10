export { default as TabsHost } from './TabsHost';

export type * from './TabsHost.types';

// Namespace the Host platform-specific types
export type * as TabsHostPropsAndroid from './TabsHost.android.types';
export type * as TabsHostPropsIOS from './TabsHost.ios.types';
