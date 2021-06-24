import React, { PropsWithChildren } from 'react';
import { Platform, findNodeHandle, View } from 'react-native';
import { Screen, ScreenProps, ScreenContext } from 'react-native-screens';

// @ts-ignore file to be used only if `react-native-reanimated` available in the project, also types are not exported
import Animated from 'react-native-reanimated';
// @ts-ignore file to be used only if `react-native-reanimated` available in the project, also types are not exported
import WorkletEventHandler from 'react-native-reanimated/src/reanimated2/WorkletEventHandler';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnimatedScreen = Animated.createAnimatedComponent(Screen as any);

class ReanimatedScreen extends React.Component<ScreenProps> {
  private ref: React.ElementRef<typeof View> | null = null;
  private tag: number | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private eventHandler: any;

  setNativeProps(props: ScreenProps): void {
    this.ref?.setNativeProps(props);
  }

  setRef = (ref: React.ElementRef<typeof View> | null): void => {
    this.tag = findNodeHandle(ref);
    this.ref = ref;
    this.props.onComponentRef?.(ref);
  };

  componentWillUnmount() {
    if (this.eventHandler) {
      this.eventHandler.unregisterFromEvents();
      this.eventHandler = null;
    }
  }

  render() {
    let { onTransitionProgress, ...rest } = this.props;

    if (
      this.eventHandler == null &&
      // @ts-ignore no type for worklet
      onTransitionProgress?.__worklet
    ) {
      this.eventHandler = new WorkletEventHandler(onTransitionProgress, [
        // @ts-ignore wrong type
        Platform.OS === 'android'
          ? 'onTransitionProgress'
          : 'topTransitionProgress',
      ]);
      this.eventHandler.registerForEvents(this.tag);
    }

    // @ts-ignore no type for worklet
    if (onTransitionProgress?.__worklet) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onTransitionProgress = () => {};
    }

    return (
      <AnimatedScreen
        {...rest}
        onTransitionProgress={onTransitionProgress}
        // @ts-ignore some problems with types
        ref={this.setRef}
      />
    );
  }
}

export default function ReanimatedScreenProvider(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: PropsWithChildren<any>
) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ScreenContext.Provider value={ReanimatedScreen as any}>
      {props.children}
    </ScreenContext.Provider>
  );
}
