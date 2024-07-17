import * as React from 'react';

import CommonSheetContent from "../components/CommonSheetContent";
import { useNavigation } from '@react-navigation/native';

export default function SheetScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('sheetDetentChange', (event) => {
      console.log(`SheetScreen: ${JSON.stringify(event)}`);
    });

    return () => {
      unsubscribe();
    }
  }, []);
  return <CommonSheetContent />;
}
