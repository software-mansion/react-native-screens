import * as React from 'react';

import AnimatedHeaderHeightContext from './AnimatedHeaderHeightContext';

export default function useAnimatedHeaderHeight(
  handleHeightChange: (height: number) => void
) {
  const animatedValue = React.useContext(AnimatedHeaderHeightContext);

  if (animatedValue === undefined) {
    throw new Error(
      "Couldn't find the header height. Are you inside a screen in a navigator with a header?"
    );
  }

  const listener = animatedValue.addListener(({ value }) => {
    handleHeightChange(value);
  });

  React.useEffect(() => {
    return () => {
      animatedValue.removeListener(listener);
    };
  });
}
