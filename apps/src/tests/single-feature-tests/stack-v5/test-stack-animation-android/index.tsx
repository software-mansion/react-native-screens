import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StackHostDirection } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { SettingsPicker } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';

/**
 * Every screen can reach every other one, which is more than the scenario walks through - the
 * spare buttons are there so the screen doubles as a playground for trying transitions by hand.
 */
const DIRECTION_OPTIONS = [
  'ltr',
  'rtl',
] as const satisfies readonly StackHostDirection[];
type DirectionOption = (typeof DIRECTION_OPTIONS)[number];

function TestStackAnimationAndroid() {
  const [direction, setDirection] = React.useState<DirectionOption>('ltr');

  return (
    <StackContainer
      direction={direction}
      routeConfigs={[
        {
          name: 'Home',
          element: (
            <HomeScreen
              direction={direction}
              onDirectionChange={setDirection}
            />
          ),
        },
        {
          name: 'Blue',
          element: <BlueScreen />,
        },
        {
          // The only route with a header, so its back arrow pops through the native header.
          name: 'Red',
          element: <RedScreen />,
          options: { headerConfig: { title: 'Red' } },
        },
        {
          // The only route with a non-default animation. A vertical slide moves over a screen
          // that stays put, so the draw order is visible; the horizontal slides carry both
          // screens at once and never overlap. The slides inside the host are also visibly
          // not the host's own transition.
          name: 'NestedHost',
          element: <NestedHostScreen />,
          options: { animation: 'slideFromBottom' },
        },
      ]}
    />
  );
}

/**
 * "direction" is the host's layout direction. The buttons are centred, so a change leaves them
 * where they are; the row below is laid out by Yoga, so START and END swap sides with the
 * direction and make it readable.
 */
function HomeScreen({
  direction,
  onDirectionChange,
}: {
  direction: DirectionOption;
  onDirectionChange: (direction: DirectionOption) => void;
}) {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <StackRouteInformation routeName="Home" />
      <View style={styles.controls}>
        <SettingsPicker<DirectionOption>
          label="direction"
          value={direction}
          onValueChange={onDirectionChange}
          items={[...DIRECTION_OPTIONS]}
        />
        <View style={styles.marker}>
          <Text style={styles.markerLabel}>START</Text>
          <Text style={styles.markerLabel}>END</Text>
        </View>
      </View>
      <StackNavigationButtons
        isPopEnabled={false}
        routeNames={['Blue', 'Red', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

function BlueScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight100 }}>
      <StackRouteInformation routeName="Blue" />
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Red', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

function RedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <StackRouteInformation routeName="Red" />
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Blue', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

function NestedHostScreen() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'NestedHome',
          element: <NestedHomeScreen />,
        },
        {
          name: 'NestedBlue',
          element: <NestedBlueScreen />,
        },
        {
          name: 'NestedRed',
          element: <NestedRedScreen />,
        },
      ]}
    />
  );
}

function NestedHomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.GreenLight100 }}>
      <StackRouteInformation routeName="NestedHome" />
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['NestedBlue', 'NestedRed']}
      />
    </CenteredLayoutView>
  );
}

function NestedBlueScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight100 }}>
      <StackRouteInformation routeName="NestedBlue" />
      <StackNavigationButtons isPopEnabled={true} routeNames={['NestedRed']} />
    </CenteredLayoutView>
  );
}

function NestedRedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <StackRouteInformation routeName="NestedRed" />
      <StackNavigationButtons isPopEnabled={true} routeNames={['NestedBlue']} />
    </CenteredLayoutView>
  );
}

const styles = StyleSheet.create({
  controls: {
    alignSelf: 'stretch',
    marginHorizontal: 32,
    marginBottom: 12,
  },
  marker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.NavyDark100,
    padding: 8,
    marginTop: 4,
  },
  markerLabel: {
    fontWeight: 'bold',
    color: Colors.NavyDark100,
  },
});

export default createScenario(TestStackAnimationAndroid, scenarioDescription);
