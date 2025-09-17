import React from 'react';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '../../../shared/styling/Colors';

export function Tab1() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.PurpleDark100 }}>
      <TabContentView selectNextTab={undefined} tabKey={'Tab1'} />
    </CenteredLayoutView>
  );
}
