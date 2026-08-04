import * as React from 'react';

import TransitionProgressContext, {
  type TransitionProgressContextBody,
} from './TransitionProgressContext';

export default function useTransitionProgress(): TransitionProgressContextBody {
  const progress = React.useContext(TransitionProgressContext);

  if (progress === undefined) {
    throw new Error(
      "Couldn't find values for transition progress. Are you inside a screen in Native Stack?",
    );
  }

  return progress;
}
