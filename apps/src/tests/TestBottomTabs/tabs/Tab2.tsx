import React from 'react';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '../../../shared/styling/Colors';
// import { SafeAreaView } from 'react-native-screens/private';

export function Tab2() {
  return (
    // <SafeAreaView edges={{ top: true, bottom: true }}>
    <CenteredLayoutView style={{ backgroundColor: Colors.PurpleLight100 }}>
      <TabContentView selectNextTab={undefined} tabKey={'Tab2'} />
    </CenteredLayoutView>
    // </SafeAreaView>
  );
}
