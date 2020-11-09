import {
  ParamListBase,
  StackActions,
  StackNavigationState,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
// @ts-ignore Getting private component
import AppContainer from 'react-native/Libraries/ReactNative/AppContainer';
import {
  Screen as ScreenComponent,
  ScreenProps,
  ScreenStack,
} from 'react-native-screens';
import {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';
import HeaderConfig from './HeaderConfig';

const Screen = (ScreenComponent as unknown) as React.ComponentType<ScreenProps>;
const isAndroid = Platform.OS === 'android';

let Container = View;

if (__DEV__) {
  const DebugContainer = (props: ViewProps & { stackAnimation: string }) => {
    const { stackAnimation, ...rest } = props;
    if (Platform.OS === 'ios' && stackAnimation !== 'push') {
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
      {routes.map((route) => {
        const { options, render: renderScene } = descriptors[route.key];
        const {
          gestureEnabled,
          replaceAnimation = 'pop',
          stackPresentation = 'push',
          stackAnimation,
          contentStyle,
        } = options;

        const viewStyles = [
          styles.container,
          stackPresentation !== 'transparentModal' && {
            backgroundColor: colors.background,
          },
          contentStyle,
        ];

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
            <HeaderConfig {...options} route={route} />
            <Container
              style={viewStyles}
              // @ts-ignore Wrong props passed to View
              stackPresentation={stackPresentation}>
              {renderScene()}
            </Container>
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
