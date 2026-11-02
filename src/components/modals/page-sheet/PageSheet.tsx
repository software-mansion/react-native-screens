import React from 'react';
import { SheetBase } from '../sheet/SheetBase';
import type { PageSheetProps } from './PageSheet.types';

export function PageSheet(props: PageSheetProps) {
  return <SheetBase {...props} presentationStyle="pageSheet" />;
}
