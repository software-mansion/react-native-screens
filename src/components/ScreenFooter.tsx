import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
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
  return (
    <ScreenFooter style={styles.container} collapsable={false}>
      {children}
    </ScreenFooter>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ScreenFooter;
