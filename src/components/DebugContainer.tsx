import * as React from 'react';
import { Platform, StyleProp, ViewStyle, type ViewProps } from 'react-native';
// @ts-expect-error importing private component

import AppContainer from 'react-native/Libraries/ReactNative/AppContainer';
import ScreenContentWrapper from './ScreenContentWrapper';
import { StackPresentationTypes } from '../types';

type ContainerProps = ViewProps & {
  contentStyle?: StyleProp<ViewStyle>;
  stackPresentation: StackPresentationTypes;
  children: React.ReactNode;
};

/**
 * This view must *not* be flattened.
 * See https://github.com/software-mansion/react-native-screens/pull/1825
 * for detailed explanation.
 */
let DebugContainer: React.FC<ContainerProps> = ({
  contentStyle,
  style,
  ...rest
}) => {
  return <ScreenContentWrapper style={[style, contentStyle]} {...rest} />;
};

if (process.env.NODE_ENV !== 'production') {
  DebugContainer = (props: ContainerProps) => {
    const { contentStyle, stackPresentation, style, ...rest } = props;

    const content = (
      <ScreenContentWrapper style={[style, contentStyle]} {...rest} />
    );

    if (
      Platform.OS === 'ios' &&
      stackPresentation !== 'push' &&
      stackPresentation !== 'formSheet'
    ) {
      // This is necessary for LogBox
      return <AppContainer>{content}</AppContainer>;
    }

    return content;
  };

  DebugContainer.displayName = 'DebugContainer';
}

export default DebugContainer;
