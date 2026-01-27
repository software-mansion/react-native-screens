import React, { useState, useContext, createContext } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import {
  BatchableNavigationAction,
  StackRouteConfig,
} from '../shared/gamma/containers/stack/StackContainer.types';
import {
  StackContainer,
  useStackNavigationContext,
} from '../shared/gamma/containers/stack';
import Colors from '../shared/styling/Colors';

type ScenarioConfig = {
  id: string;
  description: string;

  // Those operations will be performed to setup the test.
  setup: BatchableNavigationAction[];

  // Those operations will be performed after clicking a button.
  transition: BatchableNavigationAction[];
};

type TestContextType = {
  activeScenarioId: string | null;
  setActiveScenarioId: (id: string) => void;
  scenarioFinished: boolean;
  setScenarioFinished: (finished: boolean) => void;
};

const TestScenarioContext = createContext<TestContextType | null>(null);

const SCENARIOS: ScenarioConfig[] = [
  {
    id: '1',
    description: 'ABCdefg -> AGEdf',
    setup: [
      { type: 'push', routeName: 'A' },
      { type: 'push', routeName: 'B' },
      { type: 'push', routeName: 'C' },
      { type: 'preload', routeName: 'D' },
      { type: 'preload', routeName: 'E' },
      { type: 'preload', routeName: 'F' },
      { type: 'preload', routeName: 'G' },
    ],
    transition: [
      { type: 'pop', routeKey: 'r-C-3' },
      { type: 'pop', routeKey: 'r-B-2' },
      { type: 'push', routeName: 'G' },
      { type: 'push', routeName: 'E' },
    ],
  },
];

function MenuScreen() {
  const navigation = useStackNavigationContext();
  const testContext = useContext(TestScenarioContext);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: Colors.cardBackground,
      }}>
      <View style={{ padding: 20, maxHeight: '75%' }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Select Scenario</Text>
        <ScrollView contentContainerStyle={{ gap: 10 }}>
          {SCENARIOS.map(scenario => (
            <View key={scenario.id} style={{ borderWidth: 1, padding: 10 }}>
              <Text style={{ marginBottom: 10 }}>{scenario.description}</Text>
              <Button
                title="Run Setup"
                onPress={() => {
                  testContext?.setActiveScenarioId(scenario.id);
                  testContext?.setScenarioFinished(false);
                  navigation.batch(scenario.setup);
                }}
              />
            </View>
          ))}
        </ScrollView>
        <Text style={{ marginTop: 20 }}>
          Note that the test can run only once due to reliance on route key
          generation. Please restart the test screen after finishing the
          scenario and after modifying the test file.
        </Text>
      </View>
    </View>
  );
}

function TemplateScreen() {
  const navigation = useStackNavigationContext();
  const testContext = useContext(TestScenarioContext);

  const scenario = SCENARIOS.find(s => s.id === testContext?.activeScenarioId);

  const canPerformTransition = scenario && !testContext?.scenarioFinished;

  const performTransition = () => {
    if (canPerformTransition) {
      testContext?.setScenarioFinished(true);
      navigation.batch(scenario.transition);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.cardBackground,
      }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Route: {navigation.routeKey}
      </Text>

      <View style={{ gap: 10 }}>
        {canPerformTransition ? (
          <Button
            title="Perform Transition Action"
            onPress={performTransition}
            color="green"
          />
        ) : (
          <Text>Scenario has ended. Verify results and restart the test.</Text>
        )}
      </View>
    </View>
  );
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const routeConfigs: StackRouteConfig[] = [
  {
    name: 'Menu',
    Component: MenuScreen,
    options: {},
  },
  ...ALPHABET.map(name => ({
    name,
    Component: TemplateScreen,
    options: {},
  })),
];

export default function App() {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [scenarioFinished, setScenarioFinished] = useState<boolean>(false);

  return (
    <TestScenarioContext.Provider
      value={{
        activeScenarioId,
        setActiveScenarioId,
        scenarioFinished,
        setScenarioFinished,
      }}>
      <StackContainer routeConfigs={routeConfigs} />
    </TestScenarioContext.Provider>
  );
}
