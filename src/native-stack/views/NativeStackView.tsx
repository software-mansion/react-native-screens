import {
  ParamListBase,
  StackActions,
  StackNavigationState,
  useTheme,
  Route,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
// @ts-ignore Getting private component
import AppContainer from 'react-native/Libraries/ReactNative/AppContainer';
import {
  ScreenStack,
  StackPresentationTypes,
  ScreenContext,
  NativeScreen,
} from 'react-native-screens';
import {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
  NativeStackNavigationOptions,
} from '../types';
import HeaderConfig from './HeaderConfig';
import memoize from '../../utils/memoize';
import TransitionProgressContext from '../TransitionProgressContext';

// const Screen = (ScreenComponent as unknown) as React.ComponentType<ScreenProps>;
const isAndroid = Platform.OS === 'android';

let didWarn = isAndroid;

let Container = View;

if (__DEV__) {
  const DebugContainer = (
    props: ViewProps & { stackPresentation: StackPresentationTypes }
  ) => {
    const { stackPresentation, ...rest } = props;
    if (Platform.OS === 'ios' && stackPresentation !== 'push') {
      return (
        <AppContainer>
          <View {...rest} />
        </AppContainer>
      );
    }
    return <View {...rest} />;
  };
  // @ts-ignore Wrong props
  Container = DebugContainer;
}

const maybeRenderNestedStack = (
  Screen: Animated.AnimatedComponent<typeof NativeScreen>,
  options: NativeStackNavigationOptions,
  route: Route<string>,
  renderScene: () => JSX.Element,
  stackPresentation: StackPresentationTypes,
  isHeaderInModal: boolean,
  viewStyles: StyleProp<ViewStyle>
): JSX.Element => {
  if (isHeaderInModal) {
    return (
      <ScreenStack style={styles.container}>
        <Screen enabled style={StyleSheet.absoluteFill}>
          <HeaderConfig {...options} route={route} />
          <Container
            style={viewStyles}
            // @ts-ignore Wrong props passed to View
            stackPresentation={stackPresentation}>
            {renderScene()}
          </Container>
        </Screen>
      </ScreenStack>
    );
  }
  return (
    <Container
      style={viewStyles}
      // @ts-ignore Wrong props passed to View
      stackPresentation={stackPresentation}>
      {renderScene()}
    </Container>
  );
};

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

export default function NativeStackView({
  state,
  navigation,
  descriptors,
}: Props): JSX.Element {
  const { key, routes } = state;
  const { colors } = useTheme();
  const Screen = React.useContext(ScreenContext);

  // Keep track of the animation context when deps changes. These changes are taken from react-navigation:
  // https://github.com/react-navigation/react-navigation/blob/67f6950c14b5ec1baa4359162c3c59b1b2fec94d/packages/stack/src/views/Stack/Card.tsx#L341
  const getCardAnimation = memoize(
    (progress: Animated.Value, closing: Animated.Value) => ({
      progress,
      closing,
    })
  );

  return (
    <ScreenStack style={styles.container}>
      {routes.map((route, index) => {
        const { options, render: renderScene } = descriptors[route.key];
        const {
          contentStyle,
          gestureEnabled,
          headerShown,
          onTransitionProgress,
          replaceAnimation = 'pop',
          screenOrientation,
          stackAnimation,
          statusBarAnimation,
          statusBarColor,
          statusBarHidden,
          statusBarStyle,
          statusBarTranslucent,
        } = options;

        const isClosing = new Animated.Value(0);
        const transitionProgress = new Animated.Value(0);

        let { stackPresentation = 'push' } = options;

        if (index === 0) {
          // first screen should always be treated as `push`, it resolves problems with no header animation
          // for navigator with first screen as `modal` and the next as `push`
          stackPresentation = 'push';
        }

        const viewStyles = [
          styles.container,
          stackPresentation !== 'transparentModal' &&
            stackPresentation !== 'containedTransparentModal' && {
              backgroundColor: colors.background,
            },
          contentStyle,
        ];

        if (
          !didWarn &&
          stackPresentation !== 'push' &&
          headerShown !== undefined
        ) {
          didWarn = true;
          console.warn(
            'Be aware that changing the visibility of header in modal on iOS will result in resetting the state of the screen.'
          );
        }

        const isHeaderInModal = isAndroid
          ? false
          : stackPresentation !== 'push' && headerShown === true;
        const isHeaderInPush = isAndroid
          ? headerShown
          : stackPresentation === 'push' && headerShown !== false;

        return (
          <Screen
            key={route.key}
            enabled
            style={StyleSheet.absoluteFill}
            gestureEnabled={isAndroid ? false : gestureEnabled}
            replaceAnimation={replaceAnimation}
            screenOrientation={screenOrientation}
            stackAnimation={stackAnimation}
            stackPresentation={stackPresentation}
            statusBarAnimation={statusBarAnimation}
            statusBarColor={statusBarColor}
            statusBarHidden={statusBarHidden}
            statusBarStyle={statusBarStyle}
            statusBarTranslucent={statusBarTranslucent}
            onWillAppear={() => {
              navigation.emit({
                type: 'transitionStart',
                data: { closing: false },
                target: route.key,
              });
            }}
            onWillDisappear={() => {
              navigation.emit({
                type: 'transitionStart',
                data: { closing: true },
                target: route.key,
              });
            }}
            onAppear={() => {
              navigation.emit({
                type: 'appear',
                target: route.key,
              });
              navigation.emit({
                type: 'transitionEnd',
                data: { closing: false },
                target: route.key,
              });
            }}
            onTransitionProgress={onTransitionProgress}
            onTransitionProgressContext={Animated.event(
              [
                {
                  nativeEvent: {
                    progress: transitionProgress,
                    closing: isClosing,
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            onDisappear={() => {
              navigation.emit({
                type: 'transitionEnd',
                data: { closing: true },
                target: route.key,
              });
            }}
            onDismissed={(e) => {
              navigation.emit({
                type: 'dismiss',
                target: route.key,
              });

              const dismissCount =
                e.nativeEvent.dismissCount > 0 ? e.nativeEvent.dismissCount : 1;

              navigation.dispatch({
                ...StackActions.pop(dismissCount),
                source: route.key,
                target: key,
              });
            }}>
            <TransitionProgressContext.Provider
              value={getCardAnimation(transitionProgress, isClosing)}>
              <HeaderConfig
                {...options}
                route={route}
                headerShown={isHeaderInPush}
              />
              {maybeRenderNestedStack(
                Screen,
                options,
                route,
                renderScene,
                stackPresentation,
                isHeaderInModal,
                viewStyles
              )}
            </TransitionProgressContext.Provider>
          </Screen>
        );
      })}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
