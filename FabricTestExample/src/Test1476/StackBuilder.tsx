import React from 'react';
// remember to change prop names in ScreenGroup && ModalGroup
// import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator, NativeStackNavigationOptions } from 'react-native-screens/native-stack';

export const NativeStack = createNativeStackNavigator();

export default (configs: any, groupOptions?: NativeStackNavigationOptions) => {
  return () => (
    <NativeStack.Group screenOptions={groupOptions}>
      {configs.map(config => {
        const { options, ...anyConfig } = config;
        const { statusBarStyle, statusBarAnimation, statusBarHidden, ...anyOption } = options || {};
        return <NativeStack.Screen key={config.name} {...anyConfig} options={anyOption} />;
      })}
    </NativeStack.Group>
  );
};
