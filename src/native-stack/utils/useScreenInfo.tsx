import * as React from 'react';

import ScreenInfoContext from './ScreenInfoContext';

export default function useScreenInfo() {
  const screenInfo = React.useContext(ScreenInfoContext);

  if (screenInfo === undefined) {
    throw new Error(
      "Couldn't find information about the screen. Are you inside a screen in a navigator?"
    );
  }

  return screenInfo;
}
