import React, { PropsWithChildren } from 'react';
import BarButtonItemCustomViewNativeComponent from '../fabric/BarButtonItemCustomViewNativeComponent';
import { BarButtonItemCustomViewProps } from '../types';

const BarButtonItemCustomView: React.ComponentType<
  PropsWithChildren<BarButtonItemCustomViewProps>
> = props => {
  return <BarButtonItemCustomViewNativeComponent {...props} />;
};

export default BarButtonItemCustomView;
