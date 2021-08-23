import * as React from 'react';

type PreventDismissContextBody = {
  preventDismiss: (shouldPrevent: boolean) => void;
};

export default React.createContext<PreventDismissContextBody | undefined>(
  undefined
);
