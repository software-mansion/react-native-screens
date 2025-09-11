import React from 'react';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '../../../shared/styling/Colors';
// import { SafeAreaView } from 'react-native-screens/private';

export function Tab1() {
  return (
    // <SafeAreaView edges={{ top: false, bottom: true }}>
    <CenteredLayoutView style={{ backgroundColor: Colors.OffWhite }}>
      <TabContentView selectNextTab={undefined} tabKey={'Tab1'} />
    </CenteredLayoutView>
    // </SafeAreaView>
  );
}
