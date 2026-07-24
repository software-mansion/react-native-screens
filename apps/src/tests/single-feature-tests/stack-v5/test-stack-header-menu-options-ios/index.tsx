import React, { useLayoutEffect, useMemo, useState } from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { StackHeaderConfigProps } from 'react-native-screens/components/stack/header';
import { Button, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { Colors } from '@apps/shared/styling';

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
  displayAsPalette: boolean,
  paletteDisplayInline: boolean,
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
        {
          type: 'spacer',
          id: 'palette-spacer',
          sizing: 'flexible',
        },
        {
          type: 'item',
          id: 'palette-button',
          title: 'Palette',
          icon: { type: 'sfSymbol', name: 'paintpalette' },
          menu: {
            type: 'menu',
            id: 'palette-root',
            children: [
              {
                id: 'palette-submenu',
                type: 'menu',
                title: 'Text Style',
                displayAsPalette,
                displayInline: paletteDisplayInline,
                icon: { type: 'sfSymbol', name: 'textformat' },
                children: [
                  {
                    id: 'style-bold',
                    type: 'menuItem',
                    itemType: 'action',
                    title: 'Bold',
                    icon: { type: 'sfSymbol', name: 'bold' },
                  },
                  {
                    id: 'style-italic',
                    type: 'menuItem',
                    itemType: 'action',
                    title: 'Italic',
                    icon: { type: 'sfSymbol', name: 'italic' },
                  },
                  {
                    id: 'style-underline',
                    type: 'menuItem',
                    itemType: 'action',
                    title: 'Underline',
                    icon: { type: 'sfSymbol', name: 'underline' },
                  },
                  {
                    id: 'style-strikethrough',
                    type: 'menuItem',
                    itemType: 'action',
                    title: 'Strikethrough',
                    icon: { type: 'sfSymbol', name: 'strikethrough' },
                  },
                ],
              },
              {
                id: 'palette-action-reset',
                type: 'menuItem',
                itemType: 'action',
                title: 'Reset Formatting',
                icon: { type: 'sfSymbol', name: 'clear' },
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
  const [displayAsPalette, setDisplayAsPalette] = useState(false);
  const [paletteDisplayInline, setPaletteDisplayInline] = useState(false);

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(
    () =>
      buildHeaderConfig(
        displayInline,
        nestedDisplayInline,
        displayAsPalette,
        paletteDisplayInline,
      ),
    [
      displayInline,
      nestedDisplayInline,
      displayAsPalette,
      paletteDisplayInline,
    ],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Text testID="text-display-inline" style={styles.label}>
        To test <Text style={styles.code}>displayInline</Text> (iOS 17.0+) try
        different combinations with nested menus:
      </Text>
      <Button
        testID="toggle-display-inline-sort-by"
        title={`displayInline (Sort By): ${displayInline}`}
        onPress={() => setDisplayInline(prev => !prev)}
      />
      <Button
        testID="toggle-display-inline-rating"
        title={`displayInline (Rating): ${nestedDisplayInline}`}
        onPress={() => setNestedDisplayInline(prev => !prev)}
      />
      <Text style={styles.label}>
        <Text style={styles.code}>displayAsPalette</Text> works best combined
        with <Text style={styles.code}>displayInline</Text>:
      </Text>
      <Button
        testID="toggle-display-as-palette"
        title={`displayAsPalette (Text Style): ${displayAsPalette}`}
        onPress={() => setDisplayAsPalette(prev => !prev)}
      />
      <Button
        testID="toggle-display-inline-text-style"
        title={`displayInline (Text Style): ${paletteDisplayInline}`}
        onPress={() => setPaletteDisplayInline(prev => !prev)}
      />
    </ScrollView>
  );
}

export default createScenario(
  TestStackHeaderMenuOptionsIOS,
  scenarioDescription,
);

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    padding: 20,
  },
  code: {
    backgroundColor: Colors.OffWhite,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    padding: 4,
    borderRadius: 4,
  },
});
