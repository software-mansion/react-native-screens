import * as React from 'react';

export type HeaderHeightContextProps = {
  height: number;
  staticHeight: number;
};

const HeaderHeightContext = React.createContext<
  HeaderHeightContextProps | undefined
>(undefined);

export default HeaderHeightContext;
