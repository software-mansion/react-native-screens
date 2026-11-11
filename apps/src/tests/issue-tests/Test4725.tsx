import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import type { SearchBarPlacement } from 'react-native-screens';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';

type SubviewSize = 'none' | 'sm' | 'md' | 'lg';

type Presentation =
  | 'push'
  | 'modal'
  | 'formSheet'
  | 'pageSheet'
  | 'fullScreenModal'
  | 'transparentModal';

type SheetDetents = 'large' | 'medium' | 'fitToContents' | 'multiple';

interface Config {
  presentation: Presentation;
  nesting: 'nestedStack' | 'sameStack';
  sheetAllowedDetents: SheetDetents;
  sheetGrabberVisible: boolean;
  content: 'regularView' | 'scrollViewAutomatic' | 'scrollViewNever';
  contentLength: 'long' | 'short';
  headerShown: boolean;
  headerTransparent: boolean;
  headerLargeTitleEnabled: boolean;
  searchBarPlacement: 'disabled' | SearchBarPlacement;
  searchBarAllowToolbarIntegration: boolean;
  headerLeft: SubviewSize;
  headerTitle: SubviewSize;
  headerRight: SubviewSize;
  hidesSharedBackground: boolean;
}

interface ConfigContextInterface {
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
}

const ConfigContext = createContext<ConfigContextInterface | null>(null);

const useConfigContext = () => {
  const ctx = useContext(ConfigContext);

  if (!ctx) {
    throw new Error(
      'useConfigContext has to be used within <ConfigContext.Provider>',
    );
  }

  return ctx;
};

const SUBVIEW_SIZES: SubviewSize[] = ['none', 'sm', 'md', 'lg'];

const SHEET_DETENTS: Record<
  SheetDetents,
  NativeStackNavigationOptions['sheetAllowedDetents']
> = {
  large: [1.0],
  medium: [0.5],
  fitToContents: 'fitToContents',
  multiple: [0.3, 0.6, 1.0],
};

const SUBVIEW_DIMENSIONS: Record<
  Exclude<SubviewSize, 'none'>,
  { width: number; height: number }
> = {
  sm: { width: 10, height: 10 },
  md: { width: 36, height: 36 },
  lg: { width: 80, height: 40 },
};

function HeaderPressable({
  id,
  size,
}: {
  id: string;
  size: Exclude<SubviewSize, 'none'>;
}) {
  return (
    <PressableWithFeedback
      testID={`header-pressable-${id}`}
      hitSlop={0}
      pressRetentionOffset={0}
      onPress={() => console.log(`Pressed ${id}`)}>
      <View style={SUBVIEW_DIMENSIONS[size]} />
    </PressableWithFeedback>
  );
}

function ContentPressable({ index }: { index: number }) {
  return (
    <PressableWithFeedback
      testID={`content-pressable-${index}`}
      hitSlop={0}
      pressRetentionOffset={0}
      onPress={() => console.log(`Pressed #${index}`)}
      style={styles.contentPressable}>
      <Text>Pressable #{index}</Text>
    </PressableWithFeedback>
  );
}

function ConfigPanel({ runtime = false }: { runtime?: boolean }) {
  const { config, setConfig } = useConfigContext();

  return (
    <View style={styles.configPanel}>
      <Text style={styles.title}>Header subviews</Text>
      <SettingsPicker<SubviewSize>
        label="headerLeft"
        value={config.headerLeft}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, headerLeft: value }))
        }
        items={SUBVIEW_SIZES}
      />
      <SettingsPicker<SubviewSize>
        label="headerTitle"
        value={config.headerTitle}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, headerTitle: value }))
        }
        items={SUBVIEW_SIZES}
      />
      <SettingsPicker<SubviewSize>
        label="headerRight"
        value={config.headerRight}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, headerRight: value }))
        }
        items={SUBVIEW_SIZES}
      />
      <SettingsSwitch
        label="hidesSharedBackground"
        value={config.hidesSharedBackground}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, hidesSharedBackground: value }))
        }
      />
      <Text style={styles.title}>Header</Text>
      <SettingsSwitch
        label="headerShown"
        value={config.headerShown}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, headerShown: value }))
        }
      />
      <SettingsSwitch
        label="headerTransparent"
        value={config.headerTransparent}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, headerTransparent: value }))
        }
      />
      <SettingsSwitch
        label="headerLargeTitleEnabled"
        value={config.headerLargeTitleEnabled}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, headerLargeTitleEnabled: value }))
        }
      />
      <Text style={styles.title}>Search bar</Text>
      <SettingsPicker<Config['searchBarPlacement']>
        label="searchBarPlacement"
        value={config.searchBarPlacement}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, searchBarPlacement: value }))
        }
        items={[
          'disabled',
          'automatic',
          'inline',
          'stacked',
          'integrated',
          'integratedButton',
          'integratedCentered',
        ]}
      />
      <SettingsSwitch
        label="allowToolbarIntegration"
        value={config.searchBarAllowToolbarIntegration}
        onValueChange={value =>
          setConfig(prev => ({
            ...prev,
            searchBarAllowToolbarIntegration: value,
          }))
        }
      />
      <Text style={styles.title}>Content</Text>
      <SettingsPicker<Config['content']>
        label="content"
        value={config.content}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, content: value }))
        }
        items={['regularView', 'scrollViewAutomatic', 'scrollViewNever']}
      />
      <SettingsPicker<Config['contentLength']>
        label="contentLength"
        value={config.contentLength}
        onValueChange={value =>
          setConfig(prev => ({ ...prev, contentLength: value }))
        }
        items={['long', 'short']}
      />
      {!runtime && (
        <>
          <Text style={styles.title}>Presentation</Text>
          <SettingsPicker<Config['presentation']>
            label="presentation"
            value={config.presentation}
            onValueChange={value =>
              setConfig(prev => ({ ...prev, presentation: value }))
            }
            items={[
              'push',
              'modal',
              'formSheet',
              'pageSheet',
              'fullScreenModal',
              'transparentModal',
            ]}
          />
          <SettingsPicker<Config['nesting']>
            label="nesting"
            value={config.nesting}
            onValueChange={value =>
              setConfig(prev => ({ ...prev, nesting: value }))
            }
            items={['nestedStack', 'sameStack']}
          />
          <SettingsPicker<SheetDetents>
            label="sheetAllowedDetents"
            value={config.sheetAllowedDetents}
            onValueChange={value =>
              setConfig(prev => ({ ...prev, sheetAllowedDetents: value }))
            }
            items={['large', 'medium', 'fitToContents', 'multiple']}
          />
          <SettingsSwitch
            label="sheetGrabberVisible"
            value={config.sheetGrabberVisible}
            onValueChange={value =>
              setConfig(prev => ({ ...prev, sheetGrabberVisible: value }))
            }
          />
        </>
      )}
    </View>
  );
}

type RouteParamList = {
  Config: undefined;
  Test: undefined;
};

type NestedRouteParamList = {
  NestedTest: undefined;
  NestedTestPushed: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

const Stack = createNativeStackNavigator<RouteParamList>();
const NestedStack = createNativeStackNavigator<NestedRouteParamList>();

function ConfigScreen({ navigation }: NavigationProp<RouteParamList>) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.configScreen}>
      <ConfigPanel />
      <Button
        title="Open test screen"
        onPress={() => navigation.navigate('Test')}
      />
    </ScrollView>
  );
}

function TestScreen({ navigation }: NavigationProp<ParamListBase>) {
  const { config } = useConfigContext();
  const isNested = config.nesting === 'nestedStack';

  const children = (
    <>
      <Button
        title="Close"
        onPress={() =>
          isNested ? navigation.getParent()?.goBack() : navigation.goBack()
        }
      />
      {isNested && (
        <Button
          title="Push"
          onPress={() => navigation.navigate('NestedTestPushed')}
        />
      )}
      {[1, 2, 3].map(index => (
        <ContentPressable key={index} index={index} />
      ))}
      {config.contentLength === 'long' && (
        <>
          <ConfigPanel runtime />
          {Array.from({ length: 27 }, (_, i) => i + 4).map(index => (
            <ContentPressable key={index} index={index} />
          ))}
        </>
      )}
    </>
  );

  switch (config.content) {
    case 'regularView':
      return <View style={styles.content}>{children}</View>;
    case 'scrollViewAutomatic':
      return (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}>
          {children}
        </ScrollView>
      );
    case 'scrollViewNever':
      return (
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={styles.content}>
          {children}
        </ScrollView>
      );
  }
}

function getTestScreenOptions(config: Config): NativeStackNavigationOptions {
  const {
    searchBarPlacement,
    headerLeft,
    headerTitle,
    headerRight,
    hidesSharedBackground,
  } = config;

  return {
    title: 'Test Screen',
    headerShown: config.headerShown,
    headerTransparent: config.headerTransparent,
    headerLargeTitleEnabled: config.headerLargeTitleEnabled,
    ...(searchBarPlacement !== 'disabled' && {
      headerSearchBarOptions: {
        placement: searchBarPlacement,
        allowToolbarIntegration: config.searchBarAllowToolbarIntegration,
      },
    }),
    ...(headerTitle !== 'none' && {
      headerTitle: () => <HeaderPressable id="center" size={headerTitle} />,
    }),
    // headerLeft/headerRight are used on Android; on iOS they're overridden by
    // unstable_header*Items, the only path passing hidesSharedBackground down
    ...(headerLeft !== 'none' && {
      headerLeft: () => <HeaderPressable id="left" size={headerLeft} />,
      unstable_headerLeftItems: () => [
        {
          type: 'custom',
          element: <HeaderPressable id="left" size={headerLeft} />,
          hidesSharedBackground,
        },
      ],
    }),
    ...(headerRight !== 'none' && {
      headerRight: () => <HeaderPressable id="right" size={headerRight} />,
      unstable_headerRightItems: () => [
        {
          type: 'custom',
          element: <HeaderPressable id="right" size={headerRight} />,
          hidesSharedBackground,
        },
      ],
    }),
  };
}

function NestedStackScreen() {
  const { config } = useConfigContext();

  return (
    <NestedStack.Navigator>
      <NestedStack.Screen
        name="NestedTest"
        component={TestScreen}
        options={getTestScreenOptions(config)}
      />
      <NestedStack.Screen
        name="NestedTestPushed"
        component={TestScreen}
        options={getTestScreenOptions(config)}
      />
    </NestedStack.Navigator>
  );
}

export default function App() {
  const [config, setConfig] = useState<Config>({
    presentation: 'push',
    nesting: 'nestedStack',
    sheetAllowedDetents: 'large',
    sheetGrabberVisible: false,
    content: 'scrollViewAutomatic',
    contentLength: 'long',
    headerShown: true,
    headerTransparent: false,
    headerLargeTitleEnabled: false,
    searchBarPlacement: 'disabled',
    searchBarAllowToolbarIntegration: true,
    headerLeft: 'md',
    headerTitle: 'none',
    headerRight: 'md',
    hidesSharedBackground: false,
  });

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Config"
            component={ConfigScreen}
            options={{
              title: 'Test4725',
            }}
          />
          <Stack.Screen
            name="Test"
            component={
              config.nesting === 'nestedStack' ? NestedStackScreen : TestScreen
            }
            options={{
              ...(config.nesting === 'nestedStack'
                ? { headerShown: false }
                : getTestScreenOptions(config)),
              presentation:
                config.presentation === 'push' ? 'card' : config.presentation,
              sheetAllowedDetents: SHEET_DETENTS[config.sheetAllowedDetents],
              sheetGrabberVisible: config.sheetGrabberVisible,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ConfigContext.Provider>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  configScreen: {
    padding: 16,
    gap: 5,
  },
  configPanel: {
    gap: 5,
  },
  content: {
    gap: 20,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  contentPressable: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
