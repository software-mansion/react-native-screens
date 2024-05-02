import React from 'react';
import { ScreenFooter } from 'react-native-screens';

type FooterProps = {
  children?: React.ReactNode;
};

export default function FooterComponent({ children }: FooterProps) {
  // return (
  //   <ScreenContentWrapper style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
  //     <View collapsable={false} />
  //     <ScreenFooter
  //       collapsable={false}>
  //       {children}
  //     </ScreenFooter>
  //   </ScreenContentWrapper>
  // );

  return (
      <ScreenFooter
        collapsable={false}>
        {children}
      </ScreenFooter>
  );
}
