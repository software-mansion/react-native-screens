import {
  StackActions,
  StackNavigationState,
  useTheme
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  Screen as ScreenComponent,
  ScreenProps,
  ScreenStack
} from 'react-native-screens';
import {
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers
} from '../types';
import HeaderConfig from './HeaderConfig';

const Screen = (ScreenComponent as unknown) as React.ComponentType<ScreenProps>;
const isAndroid = Platform.OS === 'android';

type Props = {
  state: StackNavigationState;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

const NativeStackView: React.FC<Props> = ({
  state,
  navigation,
  descriptors,
}) => {
  const { key, routes } = state;
  const { colors } = useTheme();

  return (
    <ScreenStack style={styles.container}>
      {routes.map((route) => {
        const { options, render: renderScene } = descriptors[route.key];
        const {
          gestureEnabled,
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

        const onAppear = () => {
          navigation.emit({
            type: 'appear',
            target: route.key,
          });

          navigation.emit({
            type: 'transitionEnd',
            data: { closing: false },
            target: route.key,
          });
        };

        const onWillAppear = () => {
          navigation.emit({
            type: 'transitionStart',
            data: { closing: false },
            target: route.key,
          });
        };

        const onWillDisappear = () => {
          navigation.emit({
            type: 'transitionStart',
            data: { closing: true },
            target: route.key,
          });
        };

        const onDisappear = () => {
          navigation.emit({
            type: 'transitionEnd',
            data: { closing: true },
            target: route.key,
          });
        };

        const onDismissed = () => {
          navigation.emit({
            type: 'dismiss',
            target: route.key,
          });

          navigation.dispatch({
            ...StackActions.pop(),
            source: route.key,
            target: key,
          });
        };

        return (
          <Screen
            key={route.key}
            style={StyleSheet.absoluteFill}
            gestureEnabled={isAndroid ? false : gestureEnabled}
            stackPresentation={stackPresentation}
            stackAnimation={stackAnimation}
            onAppear={onAppear}
            onDismissed={onDismissed}
            onWillAppear={onWillAppear}
            onWillDisappear={onWillDisappear}
            onDisappear={onDisappear}>
            <HeaderConfig {...options} route={route} />
            <View style={viewStyles}>{renderScene()}</View>
          </Screen>
        );
      })}
    </ScreenStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NativeStackView;
