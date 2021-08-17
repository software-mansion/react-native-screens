import * as React from 'react';

import PreventDismissContext from './PreventDismissContext';

export default function usePreventDismiss() {
  const progress = React.useContext(PreventDismissContext);

  if (progress === undefined) {
    throw new Error(
      "Couldn't find values for transition progress. Are you inside a screen in Native Stack?"
    );
  }

  return progress;
}
