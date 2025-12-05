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
import {
  ScreenProps,
  ScreenStackHeaderConfigProps,
  StackPresentationTypes,
} from '../types';
import { ScreenStackHeaderConfig } from './ScreenStackHeaderConfig';
import Screen from './Screen';
import ScreenStack from './ScreenStack';
import { RNSScreensRefContext } from '../contexts';
import { FooterComponent } from './ScreenFooter';
import { SafeAreaViewProps } from './safe-area/SafeAreaView.types';
import SafeAreaView from './safe-area/SafeAreaView';
import { featureFlags } from '../flags';

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
    onHeaderHeightChange,
    // eslint-disable-next-line camelcase
    unstable_sheetFooter,
    ...rest
  }: Props,
  ref: React.ForwardedRef<View>,
) {
  const currentScreenRef = React.useRef<View | null>(null);
  const screenRefs = React.useContext(RNSScreensRefContext);

  React.useImperativeHandle(ref, () => currentScreenRef.current!);

  const stackPresentationWithDefault = stackPresentation ?? 'push';
  const headerConfigHiddenWithDefault = headerConfig?.hidden ?? false;

  const isHeaderInModal =
    Platform.OS === 'android'
      ? false
      : stackPresentationWithDefault !== 'push' &&
        headerConfigHiddenWithDefault === false;

  const headerHiddenPreviousRef = React.useRef(headerConfigHiddenWithDefault);

  React.useEffect(() => {
    warnOnce(
      Platform.OS !== 'android' &&
        stackPresentationWithDefault !== 'push' &&
        headerHiddenPreviousRef.current !== headerConfigHiddenWithDefault,
      `Dynamically changing header's visibility in modals will result in remounting the screen and losing all local state.`,
    );

    headerHiddenPreviousRef.current = headerConfigHiddenWithDefault;
  }, [headerConfigHiddenWithDefault, stackPresentationWithDefault]);

  const hasEdgeEffects =
    rest?.scrollEdgeEffects === undefined ||
    Object.values(rest.scrollEdgeEffects).some(
      propValue => propValue !== 'hidden',
    );
  const hasBlurEffect =
    headerConfig?.blurEffect !== undefined &&
    headerConfig.blurEffect !== 'none';

  warnOnce(
    hasEdgeEffects &&
      hasBlurEffect &&
      Platform.OS === 'ios' &&
      parseInt(Platform.Version, 10) >= 26,
    '[RNScreens] Using both `blurEffect` and `scrollEdgeEffects` simultaneously may cause overlapping effects.',
  );

  const debugContainerStyle = getPositioningStyle(
    sheetAllowedDetents,
    stackPresentationWithDefault,
  );

  // For iOS, we need to extract background color and apply it to Screen
  // due to the safe area inset at the bottom of ScreenContentWrapper
  let internalScreenStyle;

  if (
    stackPresentationWithDefault === 'formSheet' &&
    Platform.OS === 'ios' &&
    contentStyle
  ) {
    const { screenStyles, contentWrapperStyles } =
      extractScreenStyles(contentStyle);
    internalScreenStyle = screenStyles;
    contentStyle = contentWrapperStyles;
  }

  const shouldUseSafeAreaView =
    Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 26;

  const content = (
    <>
      <DebugContainer
        contentStyle={contentStyle}
        style={debugContainerStyle}
        stackPresentation={stackPresentationWithDefault}>
        {shouldUseSafeAreaView ? (
          <SafeAreaView edges={getSafeAreaEdges(headerConfig)}>
            {children}
          </SafeAreaView>
        ) : (
          children
        )}
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
      {stackPresentationWithDefault === 'formSheet' && unstable_sheetFooter && (
        <FooterComponent>{unstable_sheetFooter()}</FooterComponent>
      )}
    </>
  );

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
      stackPresentation={stackPresentationWithDefault}
      hasLargeHeader={headerConfig?.largeTitle ?? false}
      sheetAllowedDetents={sheetAllowedDetents}
      style={[style, internalScreenStyle]}
      onHeaderHeightChange={isHeaderInModal ? undefined : onHeaderHeightChange}
      {...rest}>
      {isHeaderInModal ? (
        <ScreenStack style={styles.container}>
          <Screen
            enabled
            isNativeStack
            activityState={activityState}
            shouldFreeze={shouldFreeze}
            hasLargeHeader={headerConfig?.largeTitle ?? false}
            style={StyleSheet.absoluteFill}
            onHeaderHeightChange={onHeaderHeightChange}>
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

function getPositioningStyle(
  allowedDetents: ScreenProps['sheetAllowedDetents'],
  presentation: StackPresentationTypes,
) {
  const isIOS = Platform.OS === 'ios';
  const rnMinorVersion = Platform.constants.reactNativeVersion.minor;

  if (presentation !== 'formSheet') {
    return styles.container;
  }

  if (isIOS) {
    if (
      allowedDetents !== 'fitToContents' &&
      rnMinorVersion >= 82 &&
      featureFlags.experiment.synchronousScreenUpdatesEnabled
    ) {
      return styles.container;
    } else {
      return styles.absoluteWithNoBottom;
    }
  }

  // Other platforms, tested reliably only on Android
  if (allowedDetents === 'fitToContents') {
    return {};
  }

  return styles.container;
}

type SplitStyleResult = {
  screenStyles: {
    backgroundColor?: ViewStyle['backgroundColor'];
  };
  contentWrapperStyles: StyleProp<ViewStyle>;
};

// TODO: figure out whether other styles, like borders, filters, etc.
// shouldn't be applied on the Screen level on iOS due to the inset.
function extractScreenStyles(style: StyleProp<ViewStyle>): SplitStyleResult {
  const flatStyle = StyleSheet.flatten(style);

  const { backgroundColor, ...contentWrapperStyles } = flatStyle as ViewStyle;

  const screenStyles = {
    backgroundColor,
  };

  return {
    screenStyles,
    contentWrapperStyles,
  };
}

function getSafeAreaEdges(
  headerConfig?: ScreenStackHeaderConfigProps,
): SafeAreaViewProps['edges'] {
  if (Platform.OS !== 'ios' || parseInt(Platform.Version, 10) < 26) {
    return {};
  }

  let defaultEdges: SafeAreaViewProps['edges'];
  if (headerConfig?.translucent || headerConfig?.hidden) {
    defaultEdges = {};
  } else {
    defaultEdges = {
      top: true,
    };
  }

  return defaultEdges;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  absoluteWithNoBottom: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
});
