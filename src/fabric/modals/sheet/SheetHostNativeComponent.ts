'use client';

import type {
  CodegenTypes as CT,
  ColorValue,
  HostComponent,
  ViewProps,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type DetentChangedEvent = Readonly<{
  index: CT.Int32;
}>;

type BackgroundEffect = 'automatic' | 'none' | 'color' | 'blur';

// Internal. Selects the UIKit `modalPresentationStyle` the host presents with.
// `FormSheet` and `PageSheet` pin it; it is not part of their public props.
type PresentationStyle = 'formSheet' | 'pageSheet';

type BackgroundEffectBlurStyle =
  | 'extraLight'
  | 'light'
  | 'dark'
  | 'regular'
  | 'prominent'
  | 'systemUltraThinMaterial'
  | 'systemThinMaterial'
  | 'systemMaterial'
  | 'systemThickMaterial'
  | 'systemChromeMaterial'
  | 'systemUltraThinMaterialLight'
  | 'systemThinMaterialLight'
  | 'systemMaterialLight'
  | 'systemThickMaterialLight'
  | 'systemChromeMaterialLight'
  | 'systemUltraThinMaterialDark'
  | 'systemThinMaterialDark'
  | 'systemMaterialDark'
  | 'systemThickMaterialDark'
  | 'systemChromeMaterialDark';

interface NativeProps extends ViewProps {
  // General
  presentationStyle?: CT.WithDefault<PresentationStyle, 'formSheet'>;
  isOpen?: CT.WithDefault<boolean, false>;
  detents?: CT.Double[] | undefined;
  prefersGrabberVisible?: CT.WithDefault<boolean, false>;
  preferredCornerRadius?: CT.WithDefault<CT.Float, -1.0>;
  largestUndimmedDetentIndex?: CT.WithDefault<CT.Int32, -1>;
  initialDetentIndex?: CT.WithDefault<CT.Int32, 0>;
  prefersScrollingExpandsWhenScrolledToEdge?: CT.WithDefault<boolean, true>;
  preventNativeDismiss?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue | undefined;
  backgroundEffect?: CT.WithDefault<BackgroundEffect, 'automatic'>;
  backgroundEffectColor?: ColorValue | undefined;
  backgroundEffectBlurStyle?: CT.WithDefault<
    BackgroundEffectBlurStyle,
    'systemMaterial'
  >;
  // Events
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDismiss?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onNativeDismiss?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onNativeDismissPrevented?:
    | CT.DirectEventHandler<GenericEmptyEvent>
    | undefined;
  onDetentChanged?: CT.DirectEventHandler<DetentChangedEvent> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSSheetHost', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
