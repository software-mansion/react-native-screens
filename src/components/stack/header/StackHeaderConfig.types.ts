import type { ReactElement, Ref } from 'react';
import type { StackHeaderConfigCommandsAndroid } from './StackHeaderConfig.android.types';
import { StackHeaderConfigPropsAndroid } from './StackHeaderConfig.android.types';
import type { StackHeaderConfigCommandsIOS } from './StackHeaderConfig.ios.types';
import { StackHeaderConfigPropsIOS } from './StackHeaderConfig.ios.types';

/**
 * Function that returns the element rendered in a custom part of the header.
 *
 * @returns The element to render.
 */
export type StackHeaderElementFactory = () => ReactElement;

/**
 * Function called when a header item or a menu item is pressed.
 */
export type StackHeaderPressHandler = () => void;

/**
 * Function called when the selected items of a header menu change.
 *
 * @param selectedMenuElementIds - The IDs of the currently selected menu items.
 */
export type StackHeaderMenuSelectionHandler = (
  selectedMenuElementIds: string[],
) => void;

/**
 * Cross-platform props for {@link Stack.HeaderConfig}.
 */
export interface StackHeaderConfigPropsBase {
  /**
   * Title displayed in the header.
   *
   * @platform android, ios
   */
  title?: string | undefined;
  /**
   * Subtitle displayed in the header.
   *
   * @platform android, ios
   */
  subtitle?: string | undefined;
  /**
   * Specifies if the header should be hidden.
   *
   * @defaultValue `false`
   * @platform android, ios
   */
  hidden?: boolean | undefined;
  /**
   * Specifies if the content should be rendered behind the header.
   *
   * @remarks
   * When `true`, content is rendered behind the header instead of starting
   * below it.
   *
   * On Android:
   * - The header background color is not affected by this prop.
   * - Setting this prop to `true` is not supported when header scrolling is
   *   enabled.
   *
   * @defaultValue `false`
   * @platform android, ios
   */
  transparent?: boolean | undefined;
  /**
   * Specifies if the back button should be hidden.
   *
   * @remarks
   * This prop does not apply to the root screen of the stack for which the back
   * button is always hidden.
   *
   * @defaultValue `false`
   * @platform android, ios
   */
  backButtonHidden?: boolean | undefined;
}

/**
 * Props for {@link Stack.HeaderConfig}.
 */
export interface StackHeaderConfigProps extends StackHeaderConfigPropsBase {
  /**
   * Android-specific props.
   *
   * @platform android
   */
  android?: StackHeaderConfigPropsAndroid | undefined;
  /**
   * iOS-specific props.
   *
   * @platform ios
   */
  ios?: StackHeaderConfigPropsIOS | undefined;
  /**
   * Ref to the {@link StackHeaderConfigRef | commands} of the header.
   *
   * @platform android, ios
   */
  ref?: Ref<StackHeaderConfigRef> | undefined;
}

/**
 * Commands of {@link Stack.HeaderConfig}, available through its `ref`.
 */
export interface StackHeaderConfigRef {
  /**
   * Android-specific commands.
   *
   * @platform android
   */
  android?: StackHeaderConfigCommandsAndroid | undefined;
  /**
   * iOS-specific commands.
   *
   * @platform ios
   */
  ios?: StackHeaderConfigCommandsIOS | undefined;
}
