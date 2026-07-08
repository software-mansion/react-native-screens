import * as React from 'react';

import CommonSheetContent from '../components/CommonSheetContent';
import { NavPropObj } from '../types';

export default function SheetScreen({ navigation }: NavPropObj) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('sheetDetentChange', event => {
      console.log(`SheetScreen: ${JSON.stringify(event)}`);
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);
  return <CommonSheetContent navigation={navigation} />;
}
