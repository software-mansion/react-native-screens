import React from 'react';
import { type ViewProps, View } from 'react-native';

export interface CenteredLayoutViewProps extends ViewProps {}

export function CenteredLayoutView(props: CenteredLayoutViewProps) {
  const { children, style, ...rest } = props;
  return (
    <View
      style={[
        {
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}
