import React, { useState } from "react";
import { StackScenario } from "./StackScenario";
import { Button, View } from "react-native";
import { BottomTabsScenario } from "./BottomTabsScenario";
import { StackInStackScenario } from "./StackInStackScenario";
import { StackInBottomTabsScenario } from "./StackInBottomTabsScenario";
import { BottomTabsInStackScenario } from "./BottomTabsInStackScenario";

export default function App() {
  const [environment, setEnvironment] = useState('select');

  switch (environment) {
    case 'select':
      return <View style={{ marginTop: 100 }}>
        {/* Basic Stack scenario; you can change scrollEdgeEffects on the first screen,
        and push another with a scroll which should reflect the changes */}
        <Button title='Stack' onPress={() => setEnvironment('Stack')}/>

        {/* Basic BottomTabs scenario; you can change scrollEdgeEffects on first tab,
        and go to the second one with a scroll which should reflect the changes */}
        <Button title='BottomTabs' onPress={() => setEnvironment('BottomTabs')}/>

        {/* Stack in Stack scenario; you can change config of outer stack, push the screen
            with the second stack and its config, change the second config, and push a screen with ScrollView,
            then you can observe which config takes precedence */}
        <Button title='Stack in Stack' onPress={() => setEnvironment('StackInStack')}/>

        {/* Stack in BottomTabs scenario; you can change config of outer BottomTabs, change to the second tab
            with screen stack and its config, change the config on the first screen, and push a screen with ScrollView,
            then you can observe which config takes precedence */}
        <Button title='Stack in BottomTabs' onPress={() => setEnvironment('StackInBottomTabs')}/>

        {/* BottomTabs in Stack scenario; you can change config of outer stack, push the screen
            with BottomTabs and its config, change the second config on the first tab,
            and switch to the second tab with ScrollView, then you can observe which config takes precedence */}
        <Button title='BottomTabs in Stack' onPress={() => setEnvironment('BottomTabsInStack')}/>
      </View>
    case 'Stack':
      return <StackScenario />;
    case 'BottomTabs':
      return <BottomTabsScenario />;
    case 'StackInStack':
      return <StackInStackScenario />;
    case 'StackInBottomTabs':
      return <StackInBottomTabsScenario />;
    case 'BottomTabsInStack':
      return <BottomTabsInStackScenario />;
  }
}
