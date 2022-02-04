import React from 'react';
import {KeyboardTypeOptions} from 'react-native';
import {SettingsInput} from './SettingsInput';

type Props = {
  label: string;
  placeholder?: string;
  value: number;
  onValueChange: (value?: number) => void;
  keyboardType?: KeyboardTypeOptions;
};

export const SettingsNumberInput = ({
  value,
  onValueChange,
  keyboardType,
  ...rest
}: Props): JSX.Element => {
  const handleValueChange = (text: string) =>
    text.length > 0 ? onValueChange(parseFloat(text) || 0) : undefined;
  return (
    <SettingsInput
      {...rest}
      value={value !== undefined ? String(value) : undefined}
      onValueChange={handleValueChange}
      keyboardType={keyboardType}
    />
  );
};
