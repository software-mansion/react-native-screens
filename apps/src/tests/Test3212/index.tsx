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
        <Button title='Stack' onPress={() => setEnvironment('Stack')}/>
        <Button title='BottomTabs' onPress={() => setEnvironment('BottomTabs')}/>
        <Button title='Stack in Stack' onPress={() => setEnvironment('StackInStack')}/>
        <Button title='Stack in BottomTabs' onPress={() => setEnvironment('StackInBottomTabs')}/>
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
