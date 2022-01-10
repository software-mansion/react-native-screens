import React from 'react';
import { Button as RNButton } from 'react-native';
import { Spacer } from './Spacer';

interface Props {
  title: string;
  accessibilityLabel?: string;
  onPress: () => void;
  testID?: string;
}

export const Button = ({
  title,
  accessibilityLabel,
  onPress,
  testID,
}: Props): JSX.Element => (
  <Spacer>
    <RNButton
      accessibilityLabel={accessibilityLabel}
      title={title}
      onPress={onPress}
      testID={testID}
    />
  </Spacer>
);
