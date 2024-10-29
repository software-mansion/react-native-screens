import * as React from 'react';
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
  View,
} from 'react-native';
import warnOnce from 'warn-once';

import DebugContainer from './DebugContainer';
import { ScreenProps, ScreenStackHeaderConfigProps } from '../types';
import { ScreenStackHeaderConfig } from './ScreenStackHeaderConfig';
import Screen from './Screen';
import ScreenStack from './ScreenStack';

type Props = Omit<
  ScreenProps,
  'enabled' | 'isNativeStack' | 'hasLargeHeader'
> & {
  headerConfig?: ScreenStackHeaderConfigProps;
  contentStyle?: StyleProp<ViewStyle>;
};

function ScreenStackItem(
  {
    children,
    headerConfig,
    activityState,
    stackPresentation,
    contentStyle,
    ...rest
  }: Props,
  ref: React.ForwardedRef<View>,
) {
  const isHeaderInModal =
    Platform.OS === 'android'
      ? false
      : stackPresentation !== 'push' && headerConfig?.hidden === false;

  const headerHiddenPreviousRef = React.useRef(headerConfig?.hidden);

  React.useEffect(() => {
    warnOnce(
      Platform.OS !== 'android' &&
        stackPresentation !== 'push' &&
        headerHiddenPreviousRef.current !== headerConfig?.hidden,
      `Dynamically changing header's visibility in modals will result in remounting the screen and losing all local state.`,
    );

    headerHiddenPreviousRef.current = headerConfig?.hidden;
  }, [headerConfig?.hidden, stackPresentation]);

  const content = (
    <>
      <DebugContainer
        style={[
          stackPresentation === 'formSheet'
            ? {
                ...styles.sheet,
                maxHeight: Platform.OS === 'android' ? '100%' : undefined,
              }
            : styles.container,
          contentStyle,
        ]}
        stackPresentation={stackPresentation ?? 'push'}>
        {children}
      </DebugContainer>
      {/**
       * `HeaderConfig` needs to be the direct child of `Screen` without any intermediate `View`
       * We don't render it conditionally based on visibility to make it possible to dynamically render a custom `header`
       * Otherwise dynamically rendering a custom `header` leaves the native header visible
       *
       * https://github.com/software-mansion/react-native-screens/blob/main/guides/GUIDE_FOR_LIBRARY_AUTHORS.md#screenstackheaderconfig
       *
       * HeaderConfig must not be first child of a Screen.
       * See https://github.com/software-mansion/react-native-screens/pull/1825
       * for detailed explanation.
       */}
      <ScreenStackHeaderConfig {...headerConfig} />
    </>
  );

  return (
    <Screen
      ref={ref}
      enabled
      isNativeStack
      activityState={activityState}
      stackPresentation={stackPresentation}
      hasLargeHeader={headerConfig?.largeTitle ?? false}
      {...rest}>
      {isHeaderInModal ? (
        <ScreenStack style={styles.container}>
          <Screen
            enabled
            isNativeStack
            activityState={activityState}
            hasLargeHeader={headerConfig?.largeTitle ?? false}
            style={StyleSheet.absoluteFill}>
            {content}
          </Screen>
        </ScreenStack>
      ) : (
        content
      )}
    </Screen>
  );
}

export default React.forwardRef(ScreenStackItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
});
