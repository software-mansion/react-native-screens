import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { ToastProvider, useToast } from '@apps/shared';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';

/**
 * Repro: `preventNativeDismiss` silently stops intercepting the SYSTEM back
 * press after the activity goes through a stop/start cycle (Android, Stack v5).
 *
 * Root cause (OnBackPressedDispatcher deque ordering): each screen's
 * `PreventNativeDismissCallback` is registered once, with the non-lifecycle
 * `addCallback` overload, so it keeps its original deque position forever.
 * Every `FragmentManager` registers its internal pop callback with the
 * LIFECYCLE-AWARE overload - it is re-inserted at the deque TAIL on every
 * `ON_START` of its owner. The dispatcher runs the latest enabled callback,
 * so after any activity stop/start (app switch, lock screen, ...) the
 * FragmentManager callbacks leapfrog past every prevent callback and the
 * prevent feature is dead for system back until the fragments recreate.
 * Nesting is NOT required - a plain stack with a preventing top screen at
 * depth > 1 breaks the same way.
 *
 * Steps (run this screen directly via apps/App.tsx, see #1459, otherwise
 * system back exits into the example app's own navigation):
 *
 * 1. Push `NestedStack` (host route, `preventNativeDismiss: true`). Press
 *    system back: intercepted - "Native dismiss prevented - NestedStack"
 *    toast, nothing pops. (Correct: the host screen would be dismissed.)
 * 2. Background the app (home button / app switcher), then bring it back.
 * 3. Press system back again: BUG - `NestedStack` pops straight to `Home`,
 *    no toast, the enabled prevent flag is silently ignored.
 *
 * Working-as-specced behaviors this screen also demonstrates (before any
 * backgrounding): on `NestedA` system back pops only `NestedA` - the inner
 * FragmentManager callback correctly wins over the host's prevent callback,
 * because its `ON_START` insertion lands after the host's `onCreate` one; and
 * the outer header chevron is vetoed by the host's flag at any inner depth
 * (container-resolved, unaffected by this bug).
 */
function TestNestedStackPreventSystemBack() {
  return (
    <ToastProvider>
      <StackSetup />
    </ToastProvider>
  );
}

function StackSetup() {
  const toast = useToast();

  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          element: <HomeScreen />,
          options: {
            headerConfig: {
              title: 'Home',
            },
          },
        },
        {
          name: 'NestedStack',
          element: <NestedStackScreen />,
          options: {
            preventNativeDismiss: true,
            onNativeDismissPrevented: () => {
              console.info('Native dismiss prevented - NestedStack');
              toast.push({
                message: 'Native dismiss prevented - NestedStack',
                backgroundColor: Colors.RedLight60,
              });
            },
            headerConfig: {
              title: 'NestedStack',
            },
          },
        },
      ]}
    />
  );
}

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <StackRouteInformation routeName="Home" />
      <StackNavigationButtons isPopEnabled={false} routeNames={['NestedStack']} />
    </CenteredLayoutView>
  );
}

function NestedStackScreen() {
  const toast = useToast();

  return (
    <View style={styles.nestedStackHost}>
      {/* Rendered above the inner container, so the stack navigation context
          here is still the OUTER one - the toggle flips the HOST route. */}
      <HostPreventControls />
      <View style={styles.nestedStackContainer}>
        <StackContainer
          routeConfigs={[
            {
              name: 'NestedHome',
              element: <NestedScreen routeName="NestedHome" />,
              options: {
                onNativeDismissPrevented: () => {
                  console.info('Native dismiss prevented - NestedHome');
                  toast.push({
                    message: 'Native dismiss prevented - NestedHome',
                    backgroundColor: Colors.GreenLight60,
                  });
                },
                headerConfig: {
                  title: 'NestedHome',
                },
              },
            },
            {
              name: 'NestedA',
              element: <NestedScreen routeName="NestedA" />,
              options: {
                onNativeDismissPrevented: () => {
                  console.info('Native dismiss prevented - NestedA');
                  toast.push({
                    message: 'Native dismiss prevented - NestedA',
                    backgroundColor: Colors.GreenLight60,
                  });
                },
                headerConfig: {
                  title: 'NestedA',
                },
              },
            },
          ]}
        />
      </View>
    </View>
  );
}

function NestedScreen({ routeName }: { routeName: string }) {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight40 }}>
      <StackRouteInformation routeName={routeName} />
      <PreventNativeDismissInfo />
      <StackNavigationButtons isPopEnabled routeNames={['NestedA']} />
    </CenteredLayoutView>
  );
}

function HostPreventControls() {
  const navigation = useStackNavigationContext();

  return (
    <View style={styles.hostControls}>
      <Text style={styles.routeInformation} testID="host-prevent-info">
        Host prevent native dismiss:{' '}
        {navigation.routeOptions.preventNativeDismiss ? 'Enabled' : 'Disabled'}
      </Text>
      <Button
        title="Toggle Host Prevent Native Dismiss"
        onPress={() =>
          navigation.setRouteOptions(navigation.routeKey, {
            preventNativeDismiss:
              !navigation.routeOptions.preventNativeDismiss,
          })
        }
      />
    </View>
  );
}

function PreventNativeDismissInfo() {
  const navContext = useStackNavigationContext();

  return (
    <View>
      <Text
        style={styles.routeInformation}
        testID="prevent-native-dismiss-info">
        Prevent native dismiss:{' '}
        {navContext.routeOptions.preventNativeDismiss ? 'Enabled' : 'Disabled'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nestedStackHost: {
    flex: 1,
  },
  nestedStackContainer: {
    flex: 1,
  },
  hostControls: {
    alignItems: 'center',
    backgroundColor: Colors.RedLight40,
    paddingVertical: 4,
  },
  routeInformation: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TestNestedStackPreventSystemBack;
