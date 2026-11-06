import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Button, Pressable, Text, View } from 'react-native';
import {
  createNavigationContainerRef,
  NavigationContainer,
  type NavigatorScreenParams,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5112
// (based on https://github.com/rafalnawojczyk/rns-nested-stack-header-crash-repro).
//
// Root native stack: Home (nested stack) and Feature (nested stack: Dashboard → Child).
// Dashboard has custom headerLeft / headerTitle / headerRight.
//
// "Start auto repro" loops: open Feature → open Child → goBack() → wait 250–400 ms → goBack().
// The second goBack() pops the whole Feature stack while Dashboard is still sliding back in.
// Home does HOME_RENDER_COST_MS of JS work in a layout effect when it regains focus, i.e. after the
// commit that removes Feature, in the same JS task. That delays the teardown mount until after
// Dashboard's enter animation has ended.
//
// Expected: Home is shown.
// Bug (Android, Fabric): crash in ScreenStackHeaderConfig.onUpdate during the teardown of the
// Feature stack ("The specified child already has a parent").

type FeatureParamList = { Dashboard: undefined; Child: undefined };
type RootParamList = {
  Home: undefined;
  Feature: NavigatorScreenParams<FeatureParamList> | undefined;
};

const Root = createNativeStackNavigator<RootParamList>();
const HomeStack = createNativeStackNavigator<{ HomeScreen: undefined }>();
const FeatureStack = createNativeStackNavigator<FeatureParamList>();
const ChildStack = createNativeStackNavigator<{ ChildRoot: undefined }>();
const navigationRef = createNavigationContainerRef<RootParamList>();

// JS work done by Home when it is revealed. It delays the teardown mount of the Feature stack.
const HOME_RENDER_COST_MS = 300;
const GAPS_MS = [250, 300, 350, 400];

const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));
const burn = (ms: number) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
};

function HeaderButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderRadius: 16,
      }}>
      <Text>{label}</Text>
    </Pressable>
  );
}

function useCustomHeader(title: string) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <HeaderButton label="←" onPress={() => navigation.goBack()} />
      ),
      headerTitle: () => (
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{title}</Text>
      ),
      headerRight: () => <HeaderButton label="More" />,
      headerTitleAlign: 'center',
    });
  });
}

function Tiles({ count, seed }: { count: number; seed: number }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            width: 8,
            height: 8,
            margin: 1,
            backgroundColor: (i + seed) % 2 ? '#ccc' : '#999',
          }}
        />
      ))}
    </View>
  );
}

function AutoRepro() {
  const [running, setRunning] = useState(false);
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    if (!running) {
      return;
    }
    // Per run, so Stop + Start or leaving the screen ends this loop after its current wait.
    let cancelled = false;
    (async () => {
      for (let i = 1; !cancelled; i++) {
        const gap = GAPS_MS[i % GAPS_MS.length];
        setIteration(i);
        console.log(`[Test5112] iteration ${i} gap ${gap}ms`);
        navigationRef.navigate('Feature');
        await wait(2000);
        if (cancelled) {
          return;
        }
        navigationRef.navigate('Feature', { screen: 'Child' });
        await wait(1500);
        if (cancelled) {
          return;
        }
        navigationRef.goBack(); // pops Child, Dashboard slides back in
        await wait(gap);
        if (cancelled) {
          return;
        }
        navigationRef.goBack(); // pops the whole Feature stack during that animation
        await wait(2000);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [running]);

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <Button
        testID="open-feature"
        title="Open feature"
        onPress={() => navigationRef.navigate('Feature')}
      />
      <Button
        testID="auto-repro"
        title={running ? 'Stop auto repro' : 'Start auto repro'}
        onPress={() => setRunning(r => !r)}
      />
      <Text testID="iteration">Iteration: {iteration}</Text>
    </View>
  );
}

function HomeScreen() {
  const isFocused = useIsFocused();
  const [refreshes, setRefreshes] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setRefreshes(r => r + 1);
    }, []),
  );
  // JS work done when Home is revealed, after the commit that removes the Feature stack but in
  // the same JS task. It holds back the teardown mount by HOME_RENDER_COST_MS.
  useLayoutEffect(() => {
    if (isFocused) {
      burn(HOME_RENDER_COST_MS);
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 24 }}>
      <AutoRepro />
      <Text>
        Home focused: {String(isFocused)}, focus count: {refreshes}
      </Text>
      <Tiles count={600} seed={refreshes} />
    </View>
  );
}

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
    </HomeStack.Navigator>
  );
}

function Dashboard({
  navigation,
}: NativeStackScreenProps<FeatureParamList, 'Dashboard'>) {
  useCustomHeader('Dashboard');
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 24 }}>
      <Button
        testID="open-child"
        title="Open child"
        onPress={() => navigation.navigate('Child')}
      />
      <Tiles count={1500} seed={0} />
    </View>
  );
}

function ChildRoot() {
  useCustomHeader('Child');
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 24 }}>
      <Text>Child: press back twice quickly</Text>
      <Tiles count={800} seed={1} />
    </View>
  );
}

function ChildNavigator() {
  return (
    <ChildStack.Navigator>
      <ChildStack.Screen name="ChildRoot" component={ChildRoot} />
    </ChildStack.Navigator>
  );
}

function FeatureNavigator() {
  return (
    <FeatureStack.Navigator>
      <FeatureStack.Screen name="Dashboard" component={Dashboard} />
      <FeatureStack.Screen
        name="Child"
        component={ChildNavigator}
        options={{ headerShown: false }}
      />
    </FeatureStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        <Root.Screen
          name="Home"
          component={HomeNavigator}
          options={{ animation: 'fade' }}
        />
        <Root.Screen name="Feature" component={FeatureNavigator} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
