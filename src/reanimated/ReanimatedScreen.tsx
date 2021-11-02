import React from 'react';
import { Screen, ScreenProps } from 'react-native-screens';

// @ts-ignore file to be used only if `react-native-reanimated` available in the project
import Animated from 'react-native-reanimated';

const AnimatedScreen = Animated.createAnimatedComponent(
  (Screen as unknown) as React.ComponentClass
);

const ReanimatedScreen = React.forwardRef<typeof AnimatedScreen, ScreenProps>(
  (props, ref) => {
    const { children, ...rest } = props;

    return (
      <AnimatedScreen
        // @ts-ignore some problems with ref and onTransitionProgressReanimated being "fake" prop for parsing of `useEvent` return value
        ref={ref}
        onTransitionProgressReanimated={undefined}
        {...rest}>
        {children}
      </AnimatedScreen>
    );
  }
);

ReanimatedScreen.displayName = 'ReanimatedScreen';

export default ReanimatedScreen;
