import { PropsWithChildren } from 'react';
import { requireNativeComponent } from 'react-native';

type SwiftViewProps = PropsWithChildren<{
  name?: string;
  title?: string;
}>;

const SwiftView = requireNativeComponent<SwiftViewProps>('RNSSwiftView');

export default SwiftView;
