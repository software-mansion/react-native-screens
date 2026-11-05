import React, { createContext, useContext, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScrollViewMarker } from 'react-native-screens';
import { ScrollEdgeElement } from 'react-native-screens/experimental';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  TabsContainer,
} from '@apps/shared/containers/tabs';
import { Colors } from '@apps/shared/styling';
import { generateNextColor } from '@apps/shared/utils/color-generator';

type Container =
  | 'none'
  | 'stack-v4'
  | 'stack-v4-native-header'
  | 'stack-v5'
  | 'tabs'
  | 'js-tabs';

const CONTAINERS: Container[] = [
  'none',
  'stack-v4',
  'stack-v4-native-header',
  'stack-v5',
  'tabs',
  'js-tabs',
];

const ScenarioContext = createContext<{
  wrapped: boolean;
  toggleWrapped: () => void;
  close: () => void;
}>({ wrapped: true, toggleWrapped: () => {}, close: () => {} });

// Taken once at module scope so the colors stay stable across re-renders
// (generateNextColor advances a global counter on every call).
const ROW_COLORS = Array.from({ length: 30 }, () => generateNextColor());

function EdgeView({ edge, ...rest }: ViewProps & { edge: 'top' | 'bottom' }) {
  const { wrapped } = useContext(ScenarioContext);
  return wrapped ? (
    <ScrollEdgeElement edge={edge} {...rest} />
  ) : (
    <View {...rest} />
  );
}

function ListScreen({ customHeader = true }: { customHeader?: boolean }) {
  const { wrapped, toggleWrapped, close } = useContext(ScenarioContext);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.fillParent}>
      <ScrollViewMarker
        style={styles.fillParent}
        scrollEdgeEffects={{ top: 'soft', bottom: 'soft' }}>
        <ScrollView
          testID="svm-see-list"
          style={styles.fillParent}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.listContent}>
          {ROW_COLORS.map((color, index) => (
            <View key={index} style={[styles.row, { backgroundColor: color }]}>
              <Text style={styles.rowText}>Row {index + 1}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollViewMarker>
      {customHeader && (
        <EdgeView
          edge="top"
          style={[styles.bar, styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.title}>Custom header</Text>
          <Button title="Close" testID="svm-see-close" onPress={close} />
        </EdgeView>
      )}
      <EdgeView
        edge="bottom"
        style={[styles.bar, styles.footer, { paddingBottom: insets.bottom }]}>
        <Text style={styles.title} testID="svm-see-state">
          {wrapped ? 'ScrollEdgeElement' : 'Plain View'}
        </Text>
        <Button
          title="Toggle"
          testID="svm-see-toggle"
          onPress={toggleWrapped}
        />
      </EdgeView>
    </View>
  );
}

const NativeStack = createNativeStackNavigator();

function StackV4() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <NativeStack.Navigator screenOptions={{ headerShown: false }}>
          <NativeStack.Screen name="List" component={ListScreen} />
        </NativeStack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

function HeaderCloseButton() {
  const { close } = useContext(ScenarioContext);
  return <Button title="Close" testID="svm-see-close" onPress={close} />;
}

function NativeHeaderListScreen() {
  return <ListScreen customHeader={false} />;
}

function StackV4NativeHeader() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <NativeStack.Navigator>
          <NativeStack.Screen
            name="List"
            component={NativeHeaderListScreen}
            options={{
              title: 'Native header',
              headerTransparent: true,
              scrollEdgeEffects: { top: 'soft' },
              headerRight: HeaderCloseButton,
            }}
          />
        </NativeStack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

function StackV5() {
  return (
    <StackContainer
      routeConfigs={[{ name: 'List', element: <ListScreen /> }]}
    />
  );
}

function Tabs() {
  return (
    <TabsContainer
      routeConfigs={[
        {
          name: 'List',
          element: <ListScreen />,
          options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'List' },
        },
        {
          name: 'Other',
          element: <ListScreen />,
          options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Other' },
        },
      ]}
    />
  );
}

const BottomTabs = createBottomTabNavigator();

function JsTabs() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <BottomTabs.Navigator screenOptions={{ headerShown: false }}>
          <BottomTabs.Screen name="List" component={ListScreen} />
          <BottomTabs.Screen name="Other" component={ListScreen} />
        </BottomTabs.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

function ContainerPicker({ onPick }: { onPick: (c: Container) => void }) {
  return (
    <View style={styles.picker}>
      {CONTAINERS.map(container => (
        <Button
          key={container}
          title={container}
          testID={`svm-see-${container}`}
          onPress={() => onPick(container)}
        />
      ))}
    </View>
  );
}

function TestSvmScrollEdgeElement() {
  const [container, setContainer] = useState<Container | null>(null);
  const [wrapped, setWrapped] = useState(true);

  let content: React.ReactNode;
  switch (container) {
    case null:
      content = <ContainerPicker onPick={setContainer} />;
      break;
    case 'none':
      content = <ListScreen />;
      break;
    case 'stack-v4':
      content = <StackV4 />;
      break;
    case 'stack-v4-native-header':
      content = <StackV4NativeHeader />;
      break;
    case 'stack-v5':
      content = <StackV5 />;
      break;
    case 'tabs':
      content = <Tabs />;
      break;
    case 'js-tabs':
      content = <JsTabs />;
      break;
  }

  return (
    <ScenarioContext.Provider
      value={{
        wrapped,
        toggleWrapped: () => setWrapped(value => !value),
        close: () => setContainer(null),
      }}>
      <View style={[styles.fillParent, styles.background]}>{content}</View>
    </ScenarioContext.Provider>
  );
}

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
  },
  background: {
    backgroundColor: Colors.White,
  },
  picker: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  listContent: {
    paddingVertical: 72,
    gap: 8,
  },
  row: {
    height: 72,
    marginHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  rowText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.White,
  },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  header: {
    top: 0,
  },
  footer: {
    bottom: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
});

export default createScenario(TestSvmScrollEdgeElement, scenarioDescription);
