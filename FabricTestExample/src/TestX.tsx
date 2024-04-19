// connected PRs: #679, #675

import React from 'react';
import { Text, View } from 'react-native';
import SwiftView from './TestX Component';

const TestX = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <SwiftView title="titleProp" name="nameProp">
        <Text>TEST</Text>
      </SwiftView>
    </View>
  );
};

export default TestX;
