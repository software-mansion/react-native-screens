import React, { PropsWithChildren } from 'react';
import CustomViewBarButtonItemNativeComponent from '../fabric/CustomViewBarButtonItemNativeComponent';
import { CustomViewBarButtonItemProps } from '../types';

const CustomViewBarButtonItem: React.ComponentType<
  PropsWithChildren<CustomViewBarButtonItemProps>
> = props => {
  return <CustomViewBarButtonItemNativeComponent {...props} />;
};

export default CustomViewBarButtonItem;
