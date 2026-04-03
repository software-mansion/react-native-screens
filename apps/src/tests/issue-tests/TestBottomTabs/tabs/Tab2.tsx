import React from 'react';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { TabContentView } from '../components/TabContentView';
import Colors from '@apps/shared/styling/Colors';

export function Tab2() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.PurpleLight100 }}>
      <TabContentView selectNextTab={undefined} screenKey={'Tab2'} />
    </CenteredLayoutView>
  );
}
