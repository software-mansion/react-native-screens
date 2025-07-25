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
import { RNSScreensRefContext } from '../contexts';
import { FooterComponent } from './ScreenFooter';

type Props = Omit<
  ScreenProps,
  'enabled' | 'isNativeStack' | 'hasLargeHeader'
> & {
  screenId: string;
  headerConfig?: ScreenStackHeaderConfigProps;
  contentStyle?: StyleProp<ViewStyle>;
};

function ScreenStackItem(
  {
    children,
    headerConfig,
    activityState,
    shouldFreeze,
    stackPresentation,
    sheetAllowedDetents,
    contentStyle,
    style,
    screenId,
    // eslint-disable-next-line camelcase
    unstable_sheetFooter,
    ...rest
  }: Props,
  ref: React.ForwardedRef<View>,
) {
  const currentScreenRef = React.useRef<View | null>(null);
  const screenRefs = React.useContext(RNSScreensRefContext);

  React.useImperativeHandle(ref, () => currentScreenRef.current!);

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
            ? Platform.OS === 'ios'
              ? styles.absolute
              : sheetAllowedDetents === 'fitToContents'
              ? null
              : styles.container
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
      {/* eslint-disable-next-line camelcase */}
      {stackPresentation === 'formSheet' && unstable_sheetFooter && (
        <FooterComponent>{unstable_sheetFooter()}</FooterComponent>
      )}
    </>
  );

  // We take backgroundColor from contentStyle and apply it on Screen.
  // This allows to workaround one issue with truncated
  // content with formSheet presentation.
  let internalScreenStyle;

  if (stackPresentation === 'formSheet' && contentStyle) {
    const flattenContentStyles = StyleSheet.flatten(contentStyle);
    internalScreenStyle = {
      backgroundColor: flattenContentStyles?.backgroundColor,
    };
  }

  return (
    <Screen
      ref={node => {
        currentScreenRef.current = node;

        if (screenRefs === null) {
          console.warn(
            'Looks like RNSScreensRefContext is missing. Make sure the ScreenStack component is wrapped in it',
          );
          return;
        }

        const currentRefs = screenRefs.current;

        if (node === null) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete currentRefs[screenId];
        } else {
          currentRefs[screenId] = { current: node };
        }
      }}
      enabled
      isNativeStack
      activityState={activityState}
      shouldFreeze={shouldFreeze}
      screenId={screenId}
      stackPresentation={stackPresentation}
      hasLargeHeader={headerConfig?.largeTitle ?? false}
      sheetAllowedDetents={sheetAllowedDetents}
      style={[style, internalScreenStyle]}
      {...rest}>
      {isHeaderInModal ? (
        <ScreenStack style={styles.container}>
          <Screen
            enabled
            isNativeStack
            activityState={activityState}
            shouldFreeze={shouldFreeze}
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
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
});
