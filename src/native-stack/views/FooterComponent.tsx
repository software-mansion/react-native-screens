import React from 'react';
import { ScreenFooter } from 'react-native-screens';

type FooterProps = {
  children?: React.ReactNode;
};

export default function FooterComponent({ children }: FooterProps) {
  return (
    <ScreenFooter
      collapsable={false}
      style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
      {children}
    </ScreenFooter>
  );
}
