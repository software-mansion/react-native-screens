import {
  useTheme,
  type Route
} from '@react-navigation/native';
import * as React from 'react';
import {
  Platform,
  StyleSheet
} from 'react-native';
import {Screen, ScreenProps, ScreenStack, StackPresentationTypes, ScreenStackHeaderConfig} from 'react-native-screens';
import warnOnce from 'warn-once';

import type {
  NativeStackNavigationOptions,
  ScreenStackHeaderConfigProps
} from '../types';
import { DebugContainer } from './DebugContainer';
import { HeaderConfig } from './HeaderConfig';


type ScreenStackContentProps = Omit<ScreenProps, 'enabled' | 'isNativeStack'> & {
  headerConfigProps: ScreenStackHeaderConfigProps;
  headerConfigContent: React.ReactElement;
}

const MaybeNestedStack = ({
  stackPresentation,headerConfigProps
}: ScreenStackContentProps) => {
  const isHeaderInModal =
    Platform.OS === 'android'
      ? false
      : stackPresentation !== 'push' && headerConfigProps.hidden !== false;

  const headerHiddenPreviousRef = React.useRef(headerConfigProps.hidden);

  React.useEffect(() => {
    warnOnce(
      Platform.OS !== 'android' &&
        stackPresentation !== 'card' &&
        headerHiddenPreviousRef.current !== headerConfigProps.hidden,
      `Dynamically showing or hiding in modals will result in remounting the screen and losing all local state.`
    );

    headerHiddenPreviousRef.current = headerConfigProps.hidden;
  }, [headerConfigProps.hidden, stackPresentation]);

  const content = (
    <DebugContainer
      style={[
        stackPresentation === 'formSheet'
          ? Platform.OS === 'ios'
            ? styles.absolute
            : null
          : styles.container,
        stackPresentation !== 'transparentModal' &&
          stackPresentation !== 'containedTransparentModal' && {
            backgroundColor: colors.background,
          },
        contentStyle,
      ]}
      stackPresentation={stackPresentation}
    >
      {children}
    </DebugContainer>
  );

  if (isHeaderInModal) {
    return (
      <ScreenStack style={styles.container}>
        <Screen
          enabled
          isNativeStack
          hasLargeHeader={options.headerLargeTitle ?? false}
          style={[StyleSheet.absoluteFill, unstable_screenStyle]}
          activityState={isPreloaded ? 0 : 2}
        >
          {content}
          <HeaderConfig
            {...options}
            route={route}
            headerHeight={headerHeight}
            headerTopInsetEnabled={headerTopInsetEnabled}
            canGoBack
          />
        </Screen>
      </ScreenStack>
    );
  }

  return content;
};

function ScreenStackContent  ({ headerConfigProps, headerConfigContent, children, ...rest }: ScreenStackContentProps) {

  return (
    <Screen
      {...rest}
      enabled
      isNativeStack
    >
      <MaybeNestedStack  {...rest}>
        {children}
      </MaybeNestedStack>
    {/**
     * `HeaderConfig` needs to be the direct child of `Screen` without any intermediate `View`
     * We don't render it conditionally to make it possible to dynamically render a custom `header`
     * Otherwise dynamically rendering a custom `header` leaves the native header visible
     *
     * https://github.com/software-mansion/react-native-screens/blob/main/guides/GUIDE_FOR_LIBRARY_AUTHORS.md#screenstackheaderconfig
     *
     * HeaderConfig must not be first child of a Screen.
     * See https://github.com/software-mansion/react-native-screens/pull/1825
     * for detailed explanation.
     */}
     <ScreenStackHeaderConfig {...headerConfigProps}>
      {headerConfigContent}
      </ScreenStackHeaderConfig>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    zIndex: 1,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
  translucent: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    zIndex: 1,
    elevation: 1,
  },
  background: {
    overflow: 'hidden',
  },
});
