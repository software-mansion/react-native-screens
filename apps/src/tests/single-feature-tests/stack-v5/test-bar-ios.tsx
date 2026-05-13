import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Bar } from 'react-native-screens';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Bar items iOS',
  key: 'test-bar-ios',
  details:
    'Exercises the new Bar component with header and toolbar placements, including items, spacers, menus and submenus.',
  platforms: ['ios'],
};

export function App() {
  return <StackSetup />;
}

function StackSetup() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Inbox',
          Component: InboxScreen,
          options: {},
        },
        {
          name: 'Profile',
          Component: ProfileScreen,
          options: {},
        },
      ]}
    />
  );
}

function InboxScreen() {
  const navigation = useStackNavigationContext();

  const [selectedActionId, setSelectedActionId] = useState('read');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([
    'profile',
  ]);

  return (
    <View style={styles.container}>
      <Bar placement="header">
        <Bar.Item
          title="Menu"
          icon={{ type: 'sfSymbol', name: 'line.3.horizontal' }}
          onPress={() => Alert.alert('Menu opened')}
        />
        <Bar.Spacer />
        <Bar.Item title="Inbox" />
        <Bar.Spacer size={16} />
        <Bar.Item
          title="Notifications"
          icon={{ type: 'sfSymbol', name: 'bell' }}
          badge={{ value: 5 }}
          onPress={() => Alert.alert('Notifications')}
        />
        <Bar.Menu
          title="Actions"
          icon={{ type: 'sfSymbol', name: 'ellipsis.circle' }}
          menuTitle="Inbox Actions"
          selectedId={selectedActionId}
          onSelectionChange={({ id }) => setSelectedActionId(id)}>
          <Bar.MenuAction
            identifier="read"
            title="Mark as Read"
            icon={{ type: 'sfSymbol', name: 'envelope.open' }}
            keepsMenuPresented
          />
          <Bar.MenuAction
            identifier="archive"
            title="Archive"
            icon={{ type: 'sfSymbol', name: 'archivebox' }}
            onPress={() => Alert.alert('Archived')}
          />
          <Bar.MenuAction
            identifier="delete"
            title="Delete"
            destructive
            icon={{ type: 'sfSymbol', name: 'trash' }}
            onPress={() => Alert.alert('Deleted')}
          />
          <Bar.MenuAction
            identifier="disabled"
            title="Disabled"
            disabled
            icon={{ type: 'sfSymbol', name: 'slash.circle' }}
          />
          <Bar.MenuSubmenu
            identifier="sort"
            title="Sort"
            icon={{ type: 'sfSymbol', name: 'arrow.up.arrow.down' }}
            layout="palette">
            <Bar.MenuAction
              identifier="sort-sender"
              title="By Sender"
              onPress={() => Alert.alert('Sorted by sender')}
            />
            <Bar.MenuAction
              identifier="sort-date"
              title="By Date"
              onPress={() => Alert.alert('Sorted by date')}
            />
          </Bar.MenuSubmenu>
        </Bar.Menu>
      </Bar>
      <View style={styles.content}>
        <Text style={styles.title}>Inbox</Text>
        <Button
          title="Go to Profile"
          onPress={() => navigation.push('Profile')}
        />
      </View>
      <Bar placement="toolbar">
        <Bar.Item
          title="Home"
          icon={{ type: 'sfSymbol', name: 'house' }}
          onPress={() => Alert.alert('Home')}
        />
        <Bar.Item
          title="Search"
          icon={{ type: 'sfSymbol', name: 'magnifyingglass' }}
          onPress={() => Alert.alert('Search')}
        />
        <Bar.Spacer />
        <Bar.Menu
          title="Account"
          icon={{ type: 'sfSymbol', name: 'person.crop.circle' }}
          menuTitle="Account"
          menuLayout="palette"
          menuMultiselectable
          selectedIds={selectedAccountIds}
          onSelectionChange={({ ids }) => setSelectedAccountIds(ids)}>
          <Bar.MenuAction
            identifier="profile"
            title="Profile"
            subtitle="View details"
            icon={{ type: 'sfSymbol', name: 'person' }}
            onPress={() => navigation.push('Profile')}
          />
          <Bar.MenuAction
            identifier="settings"
            title="Settings"
            icon={{ type: 'sfSymbol', name: 'gearshape' }}
            onPress={() => Alert.alert('Settings')}
          />
          <Bar.MenuAction
            identifier="logout"
            title="Logout"
            destructive
            icon={{
              type: 'sfSymbol',
              name: 'rectangle.portrait.and.arrow.right',
            }}
            onPress={() => Alert.alert('Logged out')}
          />
          <Bar.MenuSubmenu
            title="Preferences"
            icon={{ type: 'sfSymbol', name: 'slider.horizontal.3' }}
            layout="palette">
            <Bar.MenuAction
              title="Notifications"
              onPress={() => Alert.alert('Notifications preferences')}
            />
            <Bar.MenuAction
              title="Privacy"
              onPress={() => Alert.alert('Privacy preferences')}
            />
          </Bar.MenuSubmenu>
        </Bar.Menu>
      </Bar>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useStackNavigationContext();

  return (
    <View style={styles.container}>
      <Bar placement="header">
        <Bar.Item
          title="Back"
          icon={{ type: 'sfSymbol', name: 'chevron.backward' }}
          onPress={() => navigation.pop(navigation.routeKey)}
        />
        <Bar.Spacer />
        <Bar.Item title="Profile" />
        <Bar.Spacer size={16} />
        <Bar.Item
          title="Edit"
          icon={{ type: 'sfSymbol', name: 'pencil' }}
          onPress={() => Alert.alert('Edit Profile')}
        />
      </Bar>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Button
          title="Edit Profile"
          onPress={() => Alert.alert('Edit Profile')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
});

export default createScenario(App, scenarioDescription);
