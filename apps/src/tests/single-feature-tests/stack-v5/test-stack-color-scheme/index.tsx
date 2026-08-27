import {
  Appearance,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react';
import { SettingsPicker } from '@apps/shared';
import LongText from '@apps/shared/LongText';
import {
  StackContainer,
  useStackNavigationContext,
  type StackRouteConfig,
} from '@apps/shared/containers/stack';
import type {
  StackHeaderConfigRef,
  StackHeaderToolbarMenuBaseAndroid,
  StackHeaderTypeAndroid,
  StackHostColorScheme,
} from 'react-native-screens';
import { Colors } from '@apps/shared/styling';

const ColorSchemeContext = createContext<{
  hostColorScheme: StackHostColorScheme;
  setHostColorScheme: (val: StackHostColorScheme) => void;
  reactColorScheme: Appearance.ColorSchemeOverride;
  setReactColorScheme: (val: Appearance.ColorSchemeOverride) => void;
}>({
  hostColorScheme: 'inherit',
  setHostColorScheme: () => {},
  reactColorScheme: 'auto',
  setReactColorScheme: () => {},
});

// Rendered on every screen so the scheme can be changed without navigating back.
function ColorSchemePickers() {
  const {
    hostColorScheme,
    setHostColorScheme,
    reactColorScheme,
    setReactColorScheme,
  } = useContext(ColorSchemeContext);

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.heading}>React Native's color scheme</Text>
        <SettingsPicker<Appearance.ColorSchemeOverride>
          label={'colorScheme'}
          value={reactColorScheme}
          onValueChange={setReactColorScheme}
          items={['auto', 'light', 'dark']}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>StackHost color scheme</Text>
        <SettingsPicker<StackHostColorScheme>
          label={'colorScheme'}
          value={hostColorScheme}
          onValueChange={setHostColorScheme}
          items={['inherit', 'light', 'dark']}
        />
      </View>
    </>
  );
}

function buildToolbarMenu(
  onGroupChange: (groupId: string, selectedIds: string[]) => void,
  textActionTitle: string,
): StackHeaderToolbarMenuBaseAndroid {
  return {
    groups: [
      {
        groupId: 'filters',
        onSelectionChange: ids => onGroupChange('filters', ids),
      },
      {
        groupId: 'sort',
        singleSelection: true,
        onSelectionChange: ids => onGroupChange('sort', ids),
      },
    ],
    children: [
      {
        type: 'menuItem',
        id: 'textAction',
        title: textActionTitle,
        showAsAction: 'always',
        onPress: () => {},
      },
      {
        type: 'menuItem',
        id: 'iconAction',
        title: 'Icon',
        showAsAction: 'always',
        icon: {
          type: 'imageSource',
          imageSource: require('@assets/trees.jpg'),
        },
        onPress: () => {},
      },
      {
        type: 'menuItem',
        id: 'filterA',
        title: 'Filter A',
        groupId: 'filters',
        initialToggleState: true,
      },
      {
        type: 'menuItem',
        id: 'filterB',
        title: 'Filter B',
        groupId: 'filters',
      },
      {
        type: 'menuItem',
        id: 'sortAsc',
        title: 'Sort ascending',
        groupId: 'sort',
        initialToggleState: true,
      },
      {
        type: 'menuItem',
        id: 'sortDesc',
        title: 'Sort descending',
        groupId: 'sort',
      },
    ],
  };
}

function ConfigScreen() {
  const { push, setRouteOptions, routeKey } = useStackNavigationContext();

  const [headerType, setHeaderType] = useState<StackHeaderTypeAndroid>('small');
  const [headerHidden, setHeaderHidden] = useState(false);
  const [menuPropVersion, setMenuPropVersion] = useState(1);
  const [lastSelection, setLastSelection] = useState<string | null>(null);

  const headerConfigRef = useRef<StackHeaderConfigRef>(null);
  const iconSeedRef = useRef(0);

  const handleGroupChange = useCallback(
    (groupId: string, selectedIds: string[]) => {
      setLastSelection(`${groupId}: ${JSON.stringify(selectedIds)}`);
    },
    [],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: {
        title: 'Config',
        subtitle: 'Color scheme test',
        hidden: headerHidden,
        android: {
          type: headerType,
          scrollFlagScroll: true,
          scrollFlagExitUntilCollapsed: true,
          toolbarMenu: buildToolbarMenu(
            handleGroupChange,
            menuPropVersion === 1 ? 'Text' : `Text v${menuPropVersion}`,
          ),
        },
      },
      headerConfigRef,
    });
  }, [
    setRouteOptions,
    routeKey,
    headerType,
    headerHidden,
    menuPropVersion,
    handleGroupChange,
  ]);

  const loadRemoteIcon = useCallback(() => {
    iconSeedRef.current += 1;
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: 'iconAction',
      options: {
        icon: {
          type: 'imageSource',
          imageSource: {
            uri: `https://picsum.photos/seed/rns-color-scheme-${iconSeedRef.current}/128`,
          },
        },
      },
    });
  }, []);

  const checkFilterB = useCallback(() => {
    headerConfigRef.current?.android?.updateToolbarMenuElements({
      id: 'filterB',
      options: { checked: true },
    });
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      nestedScrollEnabled>
      <View style={styles.section}>
        <Text style={styles.text}>
          Sources of color scheme in ascending order of precedence: system,
          React Native, StackHost prop.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>System color scheme</Text>
        <Text style={styles.text}>
          Switch system color scheme via quick settings in notification drawer
          (Android/iOS) or Cmd+Shift+A (iOS simulator).
        </Text>
      </View>

      <ColorSchemePickers />

      <View style={styles.section}>
        <Text style={styles.heading}>Header type (Android)</Text>
        <SettingsPicker<StackHeaderTypeAndroid>
          label={'type'}
          value={headerType}
          onValueChange={setHeaderType}
          items={['small', 'medium', 'large']}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Back button</Text>
        <Button title="Push Details" onPress={() => push('Details')} />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Toolbar menu (Android)</Text>
        <Text style={styles.text}>
          Change checkbox/radio selection in the overflow menu, load a remote
          icon, then rebuild the header (color scheme, header type, hide/show)
          and observe that the toolbar menu keeps its state. Only the
          toolbarMenu prop change button resets it.
        </Text>
        <Text style={styles.text}>
          Last selection: {lastSelection ?? 'none yet'}
        </Text>
        <Button
          title="Load remote icon (imperative)"
          onPress={loadRemoteIcon}
        />
        <Button title="Check Filter B (imperative)" onPress={checkFilterB} />
        <Button
          title={`Change toolbarMenu prop (v${menuPropVersion} → v${
            menuPropVersion + 1
          })`}
          onPress={() => setMenuPropVersion(version => version + 1)}
        />
        <Button
          title={headerHidden ? 'Show header' : 'Hide header'}
          onPress={() => setHeaderHidden(hidden => !hidden)}
        />
      </View>

      <TextInput placeholder="Type something..." style={styles.input} />

      <LongText size="xl" />
    </ScrollView>
  );
}

function DetailsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.text}>
          Change the color scheme here and watch the back arrow, then navigate
          back — the Config header must already use the new palette when it
          shows up.
        </Text>
      </View>

      <ColorSchemePickers />
    </ScrollView>
  );
}

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Config',
    element: <ConfigScreen />,
  },
  {
    name: 'Details',
    element: <DetailsScreen />,
    options: {
      headerConfig: {
        title: 'Details',
        subtitle: 'Back button',
      },
    },
  },
];

function TestStackColorScheme() {
  const [hostColorScheme, setHostColorScheme] =
    useState<StackHostColorScheme>('inherit');
  const [reactColorScheme, setReactColorScheme] =
    useState<Appearance.ColorSchemeOverride>('auto');

  useEffect(() => {
    Appearance.setColorScheme(reactColorScheme);

    return () => Appearance.setColorScheme('auto');
  }, [reactColorScheme]);

  return (
    <ColorSchemeContext.Provider
      value={{
        hostColorScheme,
        setHostColorScheme,
        reactColorScheme,
        setReactColorScheme,
      }}>
      <StackContainer
        routeConfigs={ROUTE_CONFIGS}
        colorScheme={hostColorScheme}
      />
    </ColorSchemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  text: {
    color: 'gray',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default createScenario(TestStackColorScheme, scenarioDescription);
