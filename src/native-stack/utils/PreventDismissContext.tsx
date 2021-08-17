import * as React from 'react';

type PreventDismissContextBody = {
  enabled: (shouldPrevent: boolean) => void;
  onDismissCancelled: () => void;
};

export default React.createContext<PreventDismissContextBody | undefined>(
  undefined
);
