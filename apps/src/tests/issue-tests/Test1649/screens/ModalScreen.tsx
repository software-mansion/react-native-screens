import * as React from 'react';

import CommonSheetContent from '../components/CommonSheetContent';
import { NavPropObj } from '../types';

export default function ModalScreen({ navigation }: NavPropObj) {
  return <CommonSheetContent navigation={navigation} />;
}
