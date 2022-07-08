import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';

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
