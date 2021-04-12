import {
  ParamListBase,
  StackActions,
  StackNavigationState,
  useTheme,
  Route,
} from '@react-navigation/native';
import * as React from 'react';
import {
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

const maybeRenderNestedStack = (
  options: NativeStackNavigationOptions,
  route: Route<string>,
  renderScene: () => JSX.Element,
  stackPresentation: StackPresentationTypes,
  viewStyles: StyleProp<ViewStyle>,
  headerShown?: boolean
): JSX.Element => {
  if (stackPresentation === 'push') {
    return (
      <Container
        style={viewStyles}
        // @ts-ignore Wrong props
        stackPresentation={options.stackPresentation}>
        {renderScene()}
      </Container>
    );
  }
  return (
    <ScreenStack style={styles.container}>
      <Screen style={StyleSheet.absoluteFill}>
        <HeaderConfig {...options} route={route} headerShown={headerShown} />
        <Container
          style={viewStyles}
          // @ts-ignore Wrong props
          stackPresentation={options.stackPresentation}>
          {renderScene()}
        </Container>
      </Screen>
    </ScreenStack>
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

  return (
    <ScreenStack style={styles.container}>
      {routes.map((route, index) => {
        const { options, render: renderScene } = descriptors[route.key];
        const {
          contentStyle,
          gestureEnabled,
          headerShown,
          replaceAnimation = 'pop',
          stackAnimation,
        } = options;

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

        const isHeaderInPush =
          stackPresentation === 'push' && headerShown !== false;

        return (
          <Screen
            key={route.key}
            style={StyleSheet.absoluteFill}
            gestureEnabled={isAndroid ? false : gestureEnabled}
            replaceAnimation={replaceAnimation}
            stackPresentation={stackPresentation}
            stackAnimation={stackAnimation}
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
            onDismissed={() => {
              navigation.emit({
                type: 'dismiss',
                target: route.key,
              });

              navigation.dispatch({
                ...StackActions.pop(),
                source: route.key,
                target: key,
              });
            }}>
            <HeaderConfig
              {...options}
              route={route}
              headerShown={isHeaderInPush}
            />
            {maybeRenderNestedStack(
              options,
              route,
              renderScene,
              stackPresentation,
              viewStyles,
              headerShown
            )}
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
