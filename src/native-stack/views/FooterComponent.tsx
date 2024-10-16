import React from 'react';
import ScreenFooter from '../../components/ScreenFooter';

type FooterProps = {
  children?: React.ReactNode;
};

export default function FooterComponent({ children }: FooterProps) {
  return <ScreenFooter collapsable={false}>{children}</ScreenFooter>;
}
