import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  Screen,
  ScreenContainer,
  ScreenStack,
  ScreenStackHeaderConfig,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  StackHeaderConfigProps,
} from 'react-native-screens';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4777
//
// Component descriptors used to call `setSize` on every clone of a Screen (and
// a few other nodes), which always marks its Yoga node dirty. Every commit
// clones the path to the root, so every commit re-ran layout and pixel-grid
// rounding over the whole tree, even when nothing layout-related changed.
//
// "Long list" scenarios: both sources of commits there change no layout:
// scrolling (ScrollView content offset state updates) and a color animated by
// Reanimated, which commits on every frame. Profile while scrolling or with
// "Animate color" on (Instruments / Perfetto): with the fix,
// `RootShadowNode::layout` and `roundLayoutResultsToPixelGrid` should not show
// up for these commits. (Animating the color from React wouldn't do: when a
// child re-renders, React re-appends all children of its parent, and
// `YogaLayoutableShadowNode::appendChild` always dirties the parent.)
// - In a native stack, the Screen gets its frame from native state.
// - In a ScreenContainer (JS tabs), native never reports a frame on Android,
//   so the Screen stays in the "frame unknown" branch of its descriptor.
//
// "Header item positions" scenarios: header nodes take their frame origin from
// native state, and that origin only reaches the shadow tree when the node is
// laid out again. Each toggle below moves a header item without resizing it.
// The `measure()` result shown on the screen (and logged with a `[Test4777]`
// prefix) must match where the item is drawn, e.g. its accessibility frame.
// When it doesn't, `onPress` of the item can fail on a physical device:
// Pressability compares touch moves against the stale measured rect.

const ROW_COUNT = 500;

type Scenario = 'stack-list' | 'tabs-list' | 'header-v4' | 'header-v5';

const SCENARIOS: { key: Scenario; title: string; ios?: boolean }[] = [
  { key: 'stack-list', title: 'Long list in a native stack' },
  { key: 'tabs-list', title: 'Long list in JS tabs (ScreenContainer)' },
  { key: 'header-v4', title: 'Header item positions (v4 stack)' },
  { key: 'header-v5', title: 'Header item positions (v5 stack)', ios: true },
];

export default function App() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const exit = () => setScenario(null);

  switch (scenario) {
    case 'stack-list':
      return <StackListScenario onExit={exit} />;
    case 'tabs-list':
      return <TabsListScenario onExit={exit} />;
    case 'header-v4':
      return <HeaderItemsV4Scenario onExit={exit} />;
    case 'header-v5':
      return <HeaderItemsV5Scenario onExit={exit} />;
    default:
      return (
        <View style={styles.picker}>
          {SCENARIOS.filter(({ ios }) => !ios || Platform.OS === 'ios').map(
            ({ key, title }) => (
              <Button
                key={key}
                testID={`test4777-${key}`}
                title={title}
                onPress={() => setScenario(key)}
              />
            ),
          )}
        </View>
      );
  }
}

// MARK: Long list

function Rows() {
  return (
    <>
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.avatar} />
          <Text>Row {index}</Text>
        </View>
      ))}
    </>
  );
}

function AnimatedColorBox() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      true,
    );
  }, [progress]);

  // A new color on every frame, so every frame produces a commit.
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#f4cccc', '#cfe2f3'],
    ),
  }));

  return <Animated.View style={[{ height: 40 }, animatedStyle]} />;
}

function LongList() {
  const [animateColor, setAnimateColor] = useState(false);

  return (
    <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
      <Button
        testID="test4777-toggle-animate-color"
        title={animateColor ? 'Stop animating color' : 'Animate color'}
        onPress={() => setAnimateColor(value => !value)}
      />
      {animateColor && <AnimatedColorBox />}
      <Rows />
    </ScrollView>
  );
}

function StackListScenario({ onExit }: { onExit: () => void }) {
  const [showList, setShowList] = useState(false);
  const pop = () => setShowList(false);

  return (
    <ScreenStack style={{ flex: 1 }}>
      <Screen
        key="home"
        activityState={2}
        isNativeStack
        style={StyleSheet.absoluteFill}>
        <ScreenStackHeaderConfig title="Home" />
        <View style={styles.centered}>
          <Button title="Push long list" onPress={() => setShowList(true)} />
          <Button title="Back to scenarios" onPress={onExit} />
        </View>
      </Screen>
      {showList && (
        <Screen
          key="list"
          activityState={2}
          isNativeStack
          style={StyleSheet.absoluteFill}
          onDismissed={pop}>
          <ScreenStackHeaderConfig title="Long list" />
          <LongList />
        </Screen>
      )}
    </ScreenStack>
  );
}

function TabsListScenario({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState(0);
  const tabs = ['First', 'Second'];

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer style={{ flex: 1 }}>
        {tabs.map((name, index) => (
          <Screen
            key={name}
            activityState={tab === index ? 2 : 0}
            style={StyleSheet.absoluteFill}>
            <Text style={styles.tabTitle}>{name} tab</Text>
            <LongList />
          </Screen>
        ))}
      </ScreenContainer>
      <View style={styles.tabBar}>
        {tabs.map((name, index) => (
          <Button key={name} title={name} onPress={() => setTab(index)} />
        ))}
        <Button title="Exit" onPress={onExit} />
      </View>
    </View>
  );
}

// MARK: Header item positions

type Measurement = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
};

/**
 * A pressable header item. `measure()` it through `probeRef` and compare the
 * result with where the item is drawn.
 */
function HeaderProbe({
  name,
  probeRef,
  onPress,
}: {
  name: string;
  probeRef: React.RefObject<View | null>;
  onPress: () => void;
}) {
  return (
    <Pressable
      ref={probeRef}
      testID={`test4777-probe-${name}`}
      accessibilityLabel={`test4777-probe-${name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.probe, pressed && styles.probePressed]}>
      <Text style={styles.probeText}>{name}</Text>
    </Pressable>
  );
}

/**
 * Measures the given probes 1 s after any of `deps` changes (enough for
 * native to lay the header out and report the new positions), and on demand.
 */
function useProbeMeasurements(
  probes: Record<string, React.RefObject<View | null>>,
  deps: unknown[],
) {
  const [measurements, setMeasurements] = useState<Record<string, Measurement>>(
    {},
  );
  const [presses, setPresses] = useState<Record<string, number>>({});

  const measure = () => {
    Object.entries(probes).forEach(([name, ref]) => {
      ref.current?.measure((_x, _y, width, height, pageX, pageY) => {
        const measurement = { pageX, pageY, width, height };
        console.log(
          `[Test4777] ${name} measure() ${JSON.stringify(measurement)}`,
        );
        setMeasurements(prev => ({ ...prev, [name]: measurement }));
      });
    });
  };

  useEffect(() => {
    const id = setTimeout(measure, 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const onPress = (name: string) => () => {
    console.log(`[Test4777] ${name} onPress`);
    setPresses(prev => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }));
  };

  const report = (
    <>
      <Button title="Measure header items" onPress={measure} />
      {Object.keys(probes).map(name => {
        const m = measurements[name];
        return (
          <Text key={name} testID={`test4777-measure-${name}`}>
            {name}:{' '}
            {m
              ? `pageX=${m.pageX.toFixed(1)} pageY=${m.pageY.toFixed(1)} ` +
                `${m.width.toFixed(1)}x${m.height.toFixed(1)}`
              : 'not measured'}
            , presses={presses[name] ?? 0}
          </Text>
        );
      })}
    </>
  );

  return { onPress, report };
}

const SHORT_TITLE = 'Title';
const LONG_TITLE = 'A much longer title';
const SHORT_BACK_TITLE = 'Back';
const LONG_BACK_TITLE = 'A much longer back title';

function HeaderItemsV4Scenario({ onExit }: { onExit: () => void }) {
  const [pushed, setPushed] = useState(false);

  return (
    <ScreenStack style={{ flex: 1 }}>
      <Screen
        key="home"
        activityState={2}
        isNativeStack
        style={StyleSheet.absoluteFill}>
        <ScreenStackHeaderConfig title="Home" />
        <View style={styles.centered}>
          <Button
            testID="test4777-push-header-v4"
            title="Push header items screen"
            onPress={() => setPushed(true)}
          />
          <Button title="Back to scenarios" onPress={onExit} />
        </View>
      </Screen>
      {pushed && <HeaderItemsV4Screen onDismissed={() => setPushed(false)} />}
    </ScreenStack>
  );
}

function HeaderItemsV4Screen({ onDismissed }: { onDismissed: () => void }) {
  const [longTitle, setLongTitle] = useState(false);
  const [longBackTitle, setLongBackTitle] = useState(false);
  const [hideBackButton, setHideBackButton] = useState(false);
  const [extraRightItem, setExtraRightItem] = useState(false);
  const leftRef = useRef<View>(null);
  const rightRef = useRef<View>(null);

  const { onPress, report } = useProbeMeasurements(
    { left: leftRef, right: rightRef },
    [longTitle, longBackTitle, hideBackButton, extraRightItem],
  );

  return (
    <Screen
      key="header-items"
      activityState={2}
      isNativeStack
      style={StyleSheet.absoluteFill}
      onDismissed={onDismissed}>
      <ScreenStackHeaderConfig
        title={longTitle ? LONG_TITLE : SHORT_TITLE}
        backTitle={longBackTitle ? LONG_BACK_TITLE : SHORT_BACK_TITLE}
        backButtonInCustomView
        hideBackButton={hideBackButton}>
        <ScreenStackHeaderLeftView>
          <HeaderProbe
            name="left"
            probeRef={leftRef}
            onPress={onPress('left')}
          />
        </ScreenStackHeaderLeftView>
        {extraRightItem && (
          // Rendered first, so it ends up rightmost and pushes `right` aside.
          <ScreenStackHeaderRightView>
            <View style={styles.extraItem}>
              <Text>Extra</Text>
            </View>
          </ScreenStackHeaderRightView>
        )}
        <ScreenStackHeaderRightView>
          <HeaderProbe
            name="right"
            probeRef={rightRef}
            onPress={onPress('right')}
          />
        </ScreenStackHeaderRightView>
      </ScreenStackHeaderConfig>
      <ScrollView
        contentContainerStyle={styles.controls}
        contentInsetAdjustmentBehavior="automatic">
        <Button
          testID="test4777-toggle-title"
          title={longTitle ? 'Short title' : 'Long title'}
          onPress={() => setLongTitle(value => !value)}
        />
        <Button
          testID="test4777-toggle-back-title"
          title={longBackTitle ? 'Short back title' : 'Long back title'}
          onPress={() => setLongBackTitle(value => !value)}
        />
        <Button
          testID="test4777-toggle-back-button"
          title={hideBackButton ? 'Show back button' : 'Hide back button'}
          onPress={() => setHideBackButton(value => !value)}
        />
        <Button
          testID="test4777-toggle-extra-right-item"
          title={
            extraRightItem ? 'Remove extra right item' : 'Add extra right item'
          }
          onPress={() => setExtraRightItem(value => !value)}
        />
        {report}
      </ScrollView>
    </Screen>
  );
}

function HeaderItemsV5Scenario({ onExit }: { onExit: () => void }) {
  return (
    <StackContainer
      routeConfigs={[
        { name: 'Home', element: <HeaderItemsV5Home onExit={onExit} /> },
        { name: 'HeaderItems', element: <HeaderItemsV5Screen /> },
      ]}
    />
  );
}

function HeaderItemsV5Home({ onExit }: { onExit: () => void }) {
  const navigation = useStackNavigationContext();

  return (
    <View style={styles.centered}>
      <Button
        testID="test4777-push-header-v5"
        title="Push header items screen"
        onPress={() => navigation.push('HeaderItems')}
      />
      <Button title="Back to scenarios" onPress={onExit} />
    </View>
  );
}

function HeaderItemsV5Screen() {
  const navigation = useStackNavigationContext();
  const [longTitle, setLongTitle] = useState(false);
  const [extraItems, setExtraItems] = useState(false);
  const leadingRef = useRef<View>(null);
  const trailingRef = useRef<View>(null);

  const { onPress, report } = useProbeMeasurements(
    { leading: leadingRef, trailing: trailingRef },
    [longTitle, extraItems],
  );

  const headerConfig = useMemo<StackHeaderConfigProps>(() => {
    const extraItem = (id: string) => ({
      type: 'item' as const,
      id,
      title: 'Extra',
    });
    return {
      title: longTitle ? LONG_TITLE : SHORT_TITLE,
      ios: {
        // The extra items sit between the edges and the probes, so toggling
        // them moves the probes.
        leadingItems: [
          ...(extraItems ? [extraItem('extra-leading')] : []),
          {
            type: 'item',
            id: 'probe-leading',
            render: () => (
              <HeaderProbe
                name="leading"
                probeRef={leadingRef}
                onPress={onPress('leading')}
              />
            ),
          },
        ],
        trailingItems: [
          ...(extraItems ? [extraItem('extra-trailing')] : []),
          {
            type: 'item',
            id: 'probe-trailing',
            render: () => (
              <HeaderProbe
                name="trailing"
                probeRef={trailingRef}
                onPress={onPress('trailing')}
              />
            ),
          },
        ],
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longTitle, extraItems]);

  const { setRouteOptions, routeKey } = navigation;
  useLayoutEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView
      contentContainerStyle={styles.controls}
      contentInsetAdjustmentBehavior="automatic">
      <Button
        testID="test4777-toggle-title"
        title={longTitle ? 'Short title' : 'Long title'}
        onPress={() => setLongTitle(value => !value)}
      />
      <Button
        testID="test4777-toggle-extra-items"
        title={extraItems ? 'Remove extra items' : 'Add extra items'}
        onPress={() => setExtraItems(value => !value)}
      />
      {report}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
  },
  tabTitle: {
    padding: 12,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  probe: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#cfe2f3',
  },
  probePressed: {
    backgroundColor: '#9fc5e8',
  },
  probeText: {
    fontWeight: 'bold',
  },
  extraItem: {
    width: 64,
    alignItems: 'center',
  },
  controls: {
    padding: 16,
    gap: 8,
  },
});
