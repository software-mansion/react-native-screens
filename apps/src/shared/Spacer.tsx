import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface Props {
  children?: ReactNode;
  space?: number
}

export const Spacer = ({ children, space }: Props): React.JSX.Element => (
  <View style={{ margin: space ?? 10 }}>{children}</View>
);
