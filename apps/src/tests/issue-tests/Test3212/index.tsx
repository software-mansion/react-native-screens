import React, { useState } from 'react';
import { StackScenario } from './StackScenario';
import { Button, View } from 'react-native';
import { TabsScenario } from './TabsScenario';
import { StackInStackScenario } from './StackInStackScenario';
import { StackInTabsScenario } from './StackInTabsScenario';
import { TabsInStackScenario } from './TabsInStackScenario';

export default function App() {
  const [environment, setEnvironment] = useState('select');

  switch (environment) {
    case 'select':
      return (
        <View style={{ marginTop: 100 }}>
          {/* Basic Stack scenario; you can change scrollEdgeEffects on the first screen,
        and push another with a scroll which should reflect the changes */}
          <Button title="Stack" onPress={() => setEnvironment('Stack')} />

          {/* Basic Tabs scenario; you can change scrollEdgeEffects on first tab,
        and go to the second one with a scroll which should reflect the changes */}
          <Button title="Tabs" onPress={() => setEnvironment('Tabs')} />

          {/* Stack in Stack scenario; you can change config of outer stack, push the screen
            with the second stack and its config, change the second config, and push a screen with ScrollView,
            then you can observe which config takes precedence */}
          <Button
            title="Stack in Stack"
            onPress={() => setEnvironment('StackInStack')}
          />

          {/* Stack in Tabs scenario; you can change config of outer Tabs, change to the second tab
            with screen stack and its config, change the config on the first screen, and push a screen with ScrollView,
            then you can observe which config takes precedence */}
          <Button
            title="Stack in Tabs"
            onPress={() => setEnvironment('StackInTabs')}
          />

          {/* Tabs in Stack scenario; you can change config of outer stack, push the screen
            with Tabs and its config, change the second config on the first tab,
            and switch to the second tab with ScrollView, then you can observe which config takes precedence */}
          <Button
            title="Tabs in Stack"
            onPress={() => setEnvironment('TabsInStack')}
          />
        </View>
      );
    case 'Stack':
      return <StackScenario />;
    case 'Tabs':
      return <TabsScenario />;
    case 'StackInStack':
      return <StackInStackScenario />;
    case 'StackInTabs':
      return <StackInTabsScenario />;
    case 'TabsInStack':
      return <TabsInStackScenario />;
  }
}
