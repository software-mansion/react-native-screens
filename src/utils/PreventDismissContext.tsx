import * as React from 'react';

type PreventDismissContextBody = {
  setPreventDismiss: (symbol: symbol, enabled: boolean) => void;
  removePreventDismiss: (symbol: symbol) => void;
};

export default React.createContext<PreventDismissContextBody | undefined>(
  undefined
);
