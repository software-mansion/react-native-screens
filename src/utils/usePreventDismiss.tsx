import * as React from 'react';

import PreventDismissContext from './PreventDismissContext';

export default function usePreventDismiss() {
  const preventDismiss = React.useContext(PreventDismissContext);

  if (preventDismiss === undefined) {
    throw new Error(
      "Couldn't find value for preventing dismiss. Are you inside a screen in Native Stack?"
    );
  }

  return preventDismiss;
}
