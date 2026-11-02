import React from 'react';
import { SheetBase } from '../sheet/SheetBase';
import type { FormSheetProps } from './FormSheet.types';

export function FormSheet(props: FormSheetProps) {
  return <SheetBase {...props} presentationStyle="formSheet" />;
}
