import React from 'react';
import { Platform, ViewProps } from 'react-native';
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
  const shouldUseSafeAreaView =
    Platform.OS === 'android' && !disableSafeAreaViewForSheet;

  return (
    <ScreenContentWrapperNativeComponent collapsable={false} {...rest}>
      {shouldUseSafeAreaView ? (
        <SafeAreaView edges={{ top: true, bottom: true }}>
          {children}
        </SafeAreaView>
      ) : (
        children
      )}
    </ScreenContentWrapperNativeComponent>
  );
}

export default ScreenContentWrapper;
