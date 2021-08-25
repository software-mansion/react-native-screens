import * as React from 'react';

export type PreventDismissContextBody = {
  setPreventDismiss: (symbol: symbol, enabled: boolean) => void;
  removePreventDismiss: (symbol: symbol) => void;
};

export default React.createContext<PreventDismissContextBody | undefined>(
  undefined
);
