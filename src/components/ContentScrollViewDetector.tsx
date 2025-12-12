'use client';

import React from 'react';
import ContentScrollViewDetectorNativeComponent from '../fabric/ContentScrollViewDetectorNativeComponent';

function ContentScrollViewDetector({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <ContentScrollViewDetectorNativeComponent>
      {children}
    </ContentScrollViewDetectorNativeComponent>
  );
}

export default ContentScrollViewDetector;
