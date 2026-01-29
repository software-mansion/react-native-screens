import React from 'react';
import { CenteredLayoutView } from '../../../../shared/CenteredLayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '../../../../shared/styling/Colors';

export function Tab2() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.PurpleLight100 }}>
      <TabContentView selectNextTab={undefined} tabKey={'Tab2'} />
    </CenteredLayoutView>
  );
}
