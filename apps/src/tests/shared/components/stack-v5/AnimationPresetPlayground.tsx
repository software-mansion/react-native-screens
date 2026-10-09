import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type {
  StackHostDirection,
  StackScreenAnimation,
} from 'react-native-screens';
import {
  StackContainerWithDynamicRouteConfigs,
  useStackNavigationContext,
  useStackRouteConfigContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { SettingsPicker } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from './StackNavigationButtons';

const DIRECTION_OPTIONS = [
  'ltr',
  'rtl',
  'inherit',
] as const satisfies readonly StackHostDirection[];
type DirectionOption = (typeof DIRECTION_OPTIONS)[number];

// One swatch per screen colour, so whichever screen is underneath has its match here.
const REFERENCE_COLORS = [
  Colors.YellowLight100,
  Colors.BlueLight100,
  Colors.RedLight100,
];

type PlaygroundConfig = {
  animationOptions: readonly StackScreenAnimation[];
  initialAnimation: StackScreenAnimation;
  hasDirectionPicker: boolean;
  direction: DirectionOption;
  setDirection: (direction: DirectionOption) => void;
};

const PlaygroundContext = React.createContext<PlaygroundConfig>({
  animationOptions: [],
  initialAnimation: 'default',
  hasDirectionPicker: false,
  direction: 'ltr',
  setDirection: () => {},
});

/**
 * A three-screen stack whose `animation` can be switched from any screen, shared by the
 * per-family animation preset tests. `animationOptions` is the subset of the library's union
 * the pickers offer, so a scenario never exercises a value it does not check.
 */
export function AnimationPresetPlayground({
  animationOptions,
  initialAnimation,
  withDirectionPicker = false,
  withColorReference = false,
}: {
  animationOptions: readonly StackScreenAnimation[];
  initialAnimation: StackScreenAnimation;
  withDirectionPicker?: boolean;
  withColorReference?: boolean;
}) {
  const [direction, setDirection] = React.useState<DirectionOption>('ltr');

  const config = React.useMemo<PlaygroundConfig>(
    () => ({
      animationOptions,
      initialAnimation,
      hasDirectionPicker: withDirectionPicker,
      direction,
      setDirection,
    }),
    [animationOptions, initialAnimation, withDirectionPicker, direction],
  );

  const options = React.useMemo(
    () => ({ animation: initialAnimation }),
    [initialAnimation],
  );

  return (
    <PlaygroundContext value={config}>
      <StackContainerWithDynamicRouteConfigs
        direction={direction}
        routeConfigs={[
          {
            name: 'Home',
            element: (
              <PresetScreen
                name="Home"
                color={Colors.YellowLight100}
                isPopEnabled={false}
                routeNames={['Blue', 'Red']}
                hasColorReference={withColorReference}
              />
            ),
            options,
          },
          {
            name: 'Blue',
            element: (
              <PresetScreen
                name="Blue"
                color={Colors.BlueLight100}
                isPopEnabled={true}
                routeNames={['Red']}
                hasColorReference={withColorReference}
              />
            ),
            options,
          },
          {
            name: 'Red',
            element: (
              <PresetScreen
                name="Red"
                color={Colors.RedLight100}
                isPopEnabled={true}
                routeNames={['Blue']}
                hasColorReference={withColorReference}
              />
            ),
            options,
          },
        ]}
      />
    </PlaygroundContext>
  );
}

/**
 * "next push" is written into every route config, so it applies to screens pushed from now
 * on. "this screen" updates the current route's options, which drives its own pop (button and
 * predictive back gesture). "direction" is the host's layout direction.
 */
function AnimationControls() {
  const { routeKey, routeOptions, setRouteOptions } =
    useStackNavigationContext();
  const { routeConfigs, updateRouteConfigWithOptions } =
    useStackRouteConfigContext();
  const {
    animationOptions,
    initialAnimation,
    hasDirectionPicker,
    direction,
    setDirection,
  } = React.useContext(PlaygroundContext);

  // The pickers only offer one family of the library's union.
  const asOption = (animation: StackScreenAnimation | undefined) =>
    animationOptions.find(option => option === animation) ?? initialAnimation;

  return (
    <View style={styles.controls}>
      <SettingsPicker<StackScreenAnimation>
        label="next push"
        value={asOption(routeConfigs[0]?.options?.animation)}
        onValueChange={animation =>
          routeConfigs.forEach(config =>
            updateRouteConfigWithOptions(config.name, { animation }),
          )
        }
        items={[...animationOptions]}
      />
      <SettingsPicker<StackScreenAnimation>
        label="this screen"
        value={asOption(routeOptions.animation)}
        onValueChange={animation => setRouteOptions(routeKey, { animation })}
        items={[...animationOptions]}
      />
      {hasDirectionPicker ? (
        <>
          <SettingsPicker<DirectionOption>
            label="direction"
            value={direction}
            onValueChange={setDirection}
            items={[...DIRECTION_OPTIONS]}
          />
          <ContentDirectionMarker />
        </>
      ) : null}
    </View>
  );
}

/**
 * The card, the pickers and the buttons are all centred, so a change of the host's layout
 * direction leaves them where they are. This row is laid out by Yoga, so START and END swap
 * sides with the direction and make it readable.
 */
function ContentDirectionMarker() {
  return (
    <View style={styles.marker}>
      <Text style={styles.markerLabel}>START</Text>
      <Text style={styles.markerLabel}>END</Text>
    </View>
  );
}

/**
 * Three stacked reference swatches flush with each side edge. A dim scrim covers a whole
 * screen, its own swatches included, so a screen can never reference itself; the comparison is
 * made across the seam, between the covered screen's background and the matching swatch on the
 * screen drawn over it. The seam is the leading edge of the moving screen — its left edge for
 * the `*FromRight` presets, its right edge for the `*FromLeft` ones — hence a column on both
 * sides, and stacking all three colours at one x keeps the matching one at the seam whichever
 * screen is underneath.
 */
function ColorReferenceSwatches() {
  return (
    <>
      <View
        pointerEvents="none"
        style={[styles.swatchColumn, styles.swatchColumnLeft]}>
        <ColorReferenceColumn />
      </View>
      <View
        pointerEvents="none"
        style={[styles.swatchColumn, styles.swatchColumnRight]}>
        <ColorReferenceColumn />
      </View>
    </>
  );
}

function ColorReferenceColumn() {
  return (
    <>
      {REFERENCE_COLORS.map(color => (
        <View key={color} style={[styles.swatch, { backgroundColor: color }]} />
      ))}
    </>
  );
}

/**
 * The frame at the screen edge makes travel distances and scale changes visible; the bordered
 * card makes fades and the dim scrim visible against the pastel background.
 */
function PresetScreen({
  name,
  color,
  isPopEnabled,
  routeNames,
  hasColorReference,
}: {
  name: string;
  color: string;
  isPopEnabled: boolean;
  routeNames: string[];
  hasColorReference: boolean;
}) {
  return (
    <CenteredLayoutView style={{ backgroundColor: color }}>
      <View pointerEvents="none" style={styles.frame} />
      {hasColorReference ? <ColorReferenceSwatches /> : null}
      <View style={styles.card}>
        <Text style={styles.title}>{name}</Text>
        <AnimationControls />
        <StackNavigationButtons
          isPopEnabled={isPopEnabled}
          routeNames={routeNames}
        />
      </View>
    </CenteredLayoutView>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'absolute',
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
    borderWidth: 4,
    borderColor: Colors.NavyDark100,
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
  swatchColumn: {
    position: 'absolute',
    top: 56,
  },
  swatchColumnLeft: {
    left: 0,
  },
  swatchColumnRight: {
    right: 0,
  },
  swatch: {
    width: 48,
    height: 28,
    borderWidth: 1,
    borderColor: Colors.NavyDark100,
  },
  card: {
    alignSelf: 'stretch',
    marginHorizontal: 32,
    padding: 16,
    borderWidth: 4,
    borderRadius: 16,
    borderColor: Colors.NavyDark100,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.NavyDark100,
    textAlign: 'center',
    marginBottom: 12,
  },
  controls: {
    alignSelf: 'stretch',
    marginBottom: 12,
  },
});
