import React, { useLayoutEffect, useMemo, useState } from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { StackHeaderConfigProps } from 'react-native-screens/components/gamma/stack/header';
import { Button, ScrollView } from 'react-native';
import { scenarioDescription } from './scenario-description';

function TestStackHeaderMenuOptionsIOS() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          Component: ConfigScreen,
          options: {},
        },
      ]}
    />
  );
}

function buildHeaderConfig(
  displayInline: boolean,
  nestedDisplayInline: boolean,
): StackHeaderConfigProps {
  return {
    title: 'Menu Options',
    ios: {
      trailingItems: [
        {
          type: 'item',
          id: 'menu-button',
          title: 'Options',
          icon: { type: 'sfSymbol', name: 'ellipsis' },
          menu: {
            type: 'menu',
            id: 'root-menu',
            children: [
              {
                id: 'action-copy',
                type: 'menuItem',
                itemType: 'action',
                title: 'Copy',
                icon: { type: 'sfSymbol', name: 'doc.on.doc' },
              },
              {
                id: 'action-paste',
                type: 'menuItem',
                itemType: 'action',
                title: 'Paste',
                icon: { type: 'sfSymbol', name: 'doc.on.clipboard' },
              },
              {
                id: 'action-share',
                type: 'menuItem',
                itemType: 'action',
                title: 'Share',
                icon: { type: 'sfSymbol', name: 'square.and.arrow.up' },
              },
              {
                id: 'submenu-sorting',
                type: 'menu',
                title: 'Sort By',
                displayInline,
                icon: { type: 'sfSymbol', name: 'arrow.up.arrow.down' },
                singleSelection: true,
                children: [
                  {
                    id: 'sort-name',
                    type: 'menuItem',
                    title: 'Name',
                    icon: { type: 'sfSymbol', name: 'textformat.abc' },
                    initialToggleState: true,
                  },
                  {
                    id: 'sort-date',
                    type: 'menuItem',
                    title: 'Date',
                    icon: { type: 'sfSymbol', name: 'calendar' },
                  },
                  {
                    id: 'sort-size',
                    type: 'menuItem',
                    title: 'Size',
                    icon: { type: 'sfSymbol', name: 'internaldrive' },
                  },
                  {
                    id: 'submenu-rating',
                    type: 'menu',
                    title: 'Rating',
                    displayInline: nestedDisplayInline,
                    icon: { type: 'sfSymbol', name: 'star' },
                    children: [
                      {
                        id: 'rating-best-reviews',
                        type: 'menuItem',
                        title: 'Best Reviews',
                        icon: { type: 'sfSymbol', name: 'star.fill' },
                      },
                      {
                        id: 'rating-most-reviews',
                        type: 'menuItem',
                        title: 'Most Reviews',
                        icon: { type: 'sfSymbol', name: 'text.bubble' },
                      },
                      {
                        id: 'rating-highest-rated',
                        type: 'menuItem',
                        title: 'Highest Rated',
                        icon: { type: 'sfSymbol', name: 'hand.thumbsup' },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'action-delete',
                type: 'menuItem',
                itemType: 'action',
                title: 'Delete',
                icon: { type: 'sfSymbol', name: 'trash' },
              },
            ],
          },
        },
      ],
    },
  };
}

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const [displayInline, setDisplayInline] = useState(false);
  const [nestedDisplayInline, setNestedDisplayInline] = useState(false);

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(
    () => buildHeaderConfig(displayInline, nestedDisplayInline),
    [displayInline, nestedDisplayInline],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title={`displayInline (Sort By): ${displayInline}`}
        onPress={() => setDisplayInline(prev => !prev)}
      />
      <Button
        title={`displayInline (Rating): ${nestedDisplayInline}`}
        onPress={() => setNestedDisplayInline(prev => !prev)}
      />
    </ScrollView>
  );
}

export default createScenario(
  TestStackHeaderMenuOptionsIOS,
  scenarioDescription,
);
