import React from 'react';
import { ViewProps } from 'react-native';
import ScreenContentWrapperNativeComponent from '../fabric/ScreenContentWrapperNativeComponent';
import { SafeAreaView } from 'react-native-screens/experimental';

type ScreenContentWrapperProps = ViewProps & {
  disableSafeAreaViewForSheet?: boolean;
};

function ScreenContentWrapper({
  disableSafeAreaViewForSheet,
  children,
  ...rest
}: ScreenContentWrapperProps) {
  return (
    <ScreenContentWrapperNativeComponent collapsable={false} {...rest}>
      {disableSafeAreaViewForSheet ? (
        children
      ) : (
        <SafeAreaView edges={{ top: true, bottom: true }}>
          {children}
        </SafeAreaView>
      )}
    </ScreenContentWrapperNativeComponent>
  );
}

export default ScreenContentWrapper;
