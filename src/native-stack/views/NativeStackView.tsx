import {
  ParamListBase,
  StackActions,
  StackNavigationState,
  useTheme,
  Route,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
// @ts-ignore Getting private component
import AppContainer from 'react-native/Libraries/ReactNative/AppContainer';
import warnOnce from 'warn-once';
import {
  Screen as ScreenComponent,
  ScreenProps,
  ScreenStack,
  StackPresentationTypes,
} from 'react-native-screens';
import {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
  NativeStackNavigationOptions,
} from '../types';
import HeaderConfig from './HeaderConfig';

const Screen = (ScreenComponent as unknown) as React.ComponentType<ScreenProps>;
const isAndroid = Platform.OS === 'android';

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

const MaybeNestedStack = ({
  options,
  route,
  stackPresentation,
  children,
}: {
  options: NativeStackNavigationOptions;
  route: Route<string>;
  stackPresentation: StackPresentationTypes;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();
  const { headerShown = true, contentStyle } = options;

  const isHeaderInModal = isAndroid
    ? false
    : stackPresentation !== 'push' && headerShown === true;

  const headerShownPreviousRef = React.useRef(headerShown);

  React.useEffect(() => {
    warnOnce(
      !isAndroid &&
        stackPresentation !== 'push' &&
        headerShownPreviousRef.current !== headerShown,
      `Dynamically changing 'headerShown' in modals will result in remounting the screen and losing all local state. See options for the screen '${route.name}'.`
    );

    headerShownPreviousRef.current = headerShown;
  }, [headerShown, stackPresentation, route.name]);

  const content = (
    <Container
      style={[
        styles.container,
        stackPresentation !== 'transparentModal' &&
          stackPresentation !== 'containedTransparentModal' && {
            backgroundColor: colors.background,
          },
        contentStyle,
      ]}
      // @ts-ignore Wrong props passed to View
      stackPresentation={stackPresentation}>
      {children}
    </Container>
  );

  if (isHeaderInModal) {
    return (
      <ScreenStack style={styles.container}>
        <Screen enabled style={StyleSheet.absoluteFill}>
          <HeaderConfig {...options} route={route} />
          {content}
        </Screen>
      </ScreenStack>
    );
  }

  return content;
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

  return (
    <ScreenStack style={styles.container}>
      {routes.map((route, index) => {
        const { options, render: renderScene } = descriptors[route.key];
        const {
          gestureEnabled,
          headerShown,
          replaceAnimation = 'pop',
          screenOrientation,
          stackAnimation,
          statusBarAnimation,
          statusBarColor,
          statusBarHidden,
          statusBarStyle,
          statusBarTranslucent,
        } = options;

        let { stackPresentation = 'push' } = options;

        if (index === 0) {
          // first screen should always be treated as `push`, it resolves problems with no header animation
          // for navigator with first screen as `modal` and the next as `push`
          stackPresentation = 'push';
        }

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
            <HeaderConfig
              {...options}
              route={route}
              headerShown={isHeaderInPush}
            />
            <MaybeNestedStack
              options={options}
              route={route}
              stackPresentation={stackPresentation}>
              {renderScene()}
            </MaybeNestedStack>
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
