import * as React from 'react';
import { Platform, type ViewProps } from 'react-native';
// @ts-expect-error importing private component
// eslint-disable-next-line import/namespace, import/default, import/no-named-as-default, import/no-named-as-default-member
import AppContainer from 'react-native/Libraries/ReactNative/AppContainer';
import ScreenContentWrapper from './ScreenContentWrapper';
import { StackPresentationTypes } from '../types';

type ContainerProps = ViewProps & {
  stackPresentation: StackPresentationTypes;
  children: React.ReactNode;
};

/**
 * This view must *not* be flattened.
 * See https://github.com/software-mansion/react-native-screens/pull/1825
 * for detailed explanation.
 */
let DebugContainer: React.ComponentType<ContainerProps> = props => {
  return <ScreenContentWrapper {...props} />;
};

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line react/display-name
  DebugContainer = (props: ContainerProps) => {
    const { stackPresentation, ...rest } = props;

    if (
      Platform.OS === 'ios' &&
      stackPresentation !== 'push' &&
      stackPresentation !== 'formSheet'
    ) {
      // This is necessary for LogBox
      return (
        <AppContainer>
          <ScreenContentWrapper {...rest} />
        </AppContainer>
      );
    }

    return <ScreenContentWrapper {...rest} />;
  };

  DebugContainer.displayName = 'DebugContainer';
}

export default DebugContainer;
