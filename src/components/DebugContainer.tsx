import * as React from 'react';
import { Platform, StyleProp, ViewStyle, type ViewProps } from 'react-native';
// @ts-expect-error importing private component

import AppContainer from 'react-native/Libraries/ReactNative/AppContainer';
import ScreenContentWrapper from './ScreenContentWrapper';
import { StackPresentationTypes } from '../types';

type ContainerProps = ViewProps & {
  contentContainerStyle?: StyleProp<ViewStyle>;
  stackPresentation: StackPresentationTypes;
  children: React.ReactNode;
};

/**
 * This view must *not* be flattened.
 * See https://github.com/software-mansion/react-native-screens/pull/1825
 * for detailed explanation.
 */
let DebugContainer: React.ComponentType<ContainerProps> = props => {
  const { contentContainerStyle, style, ...rest } = props;

  return (
    <ScreenContentWrapper {...rest} style={[style, contentContainerStyle]} />
  );
};

if (process.env.NODE_ENV !== 'production') {
  DebugContainer = (props: ContainerProps) => {
    const { contentContainerStyle, stackPresentation, style, ...rest } = props;

    if (
      Platform.OS === 'ios' &&
      stackPresentation !== 'push' &&
      stackPresentation !== 'formSheet'
    ) {
      // This is necessary for LogBox
      return (
        <AppContainer>
          <ScreenContentWrapper
            {...rest}
            style={[style, contentContainerStyle]}
          />
        </AppContainer>
      );
    }

    return (
      <ScreenContentWrapper {...rest} style={[style, contentContainerStyle]} />
    );
  };

  DebugContainer.displayName = 'DebugContainer';
}

export default DebugContainer;
