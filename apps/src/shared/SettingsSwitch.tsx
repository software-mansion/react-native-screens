import React from 'react';
import { ViewStyle } from 'react-native';
import { SettingsTouchable } from './SettingsTouchable';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
  testID?: string;
};

export const SettingsSwitch = ({
  label,
  value,
  onValueChange,
  style = {},
  testID,
}: Props): React.JSX.Element => {
  return (
    <SettingsTouchable
      label={`${label}: ${value}`}
      onPress={() => onValueChange(!value)}
      style={style}
      testID={testID}
    />
  );
};
