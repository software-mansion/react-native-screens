import * as React from 'react';

import PreventDismissContext from './PreventDismissContext';

type Options = {
  enabled: boolean;
};

export default function usePreventDismiss({ enabled }: Options) {
  const [symbol] = React.useState(() => Symbol(''));
  const context = React.useContext(PreventDismissContext);
  if (context === undefined) {
    throw new Error(
      "Couldn't find value for preventing dismiss. Are you inside a screen in Native Stack?"
    );
  }

  const { setPreventDismiss, removePreventDismiss } = context;

  React.useEffect(() => {
    setPreventDismiss(symbol, enabled);

    return () => removePreventDismiss(symbol);
  }, [symbol, enabled]);
}
