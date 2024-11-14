import React from 'react';
import { ViewProps } from 'react-native';
import ScreenFooterNativeComponent from '../fabric/ScreenFooterNativeComponent';

/**
 * Unstable API
 */
function ScreenFooter(props: ViewProps) {
  return <ScreenFooterNativeComponent {...props} />;
}

type FooterProps = {
  children?: React.ReactNode;
};

export function FooterComponent({ children }: FooterProps) {
  return <ScreenFooter collapsable={false}>{children}</ScreenFooter>;
}

export default ScreenFooter;
