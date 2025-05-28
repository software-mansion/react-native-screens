import {
  controlEdgeToEdgeValues,
  isEdgeToEdge,
} from 'react-native-is-edge-to-edge';
import { ScreenProps } from '../../types';

export const EDGE_TO_EDGE = isEdgeToEdge();

export function transformEdgeToEdgeProps(props: ScreenProps): ScreenProps {
  const {
    // Filter out edge-to-edge related props
    statusBarColor,
    statusBarTranslucent,
    navigationBarColor,
    navigationBarTranslucent,
    ...rest
  } = props;

  if (__DEV__) {
    controlEdgeToEdgeValues({
      statusBarColor,
      statusBarTranslucent,
      navigationBarColor,
      navigationBarTranslucent,
    });
  }

  return rest;
}
