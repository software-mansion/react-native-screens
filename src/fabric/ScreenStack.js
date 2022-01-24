import * as React from 'react';
import ScreenStackNativeComponent from './ScreenStackNativeComponent';

function getKey(element) {
  return element.key ?? '';
}

const ScreenStack = function (props) {
  const screensKeys = React.useMemo(() => props.children.map(getKey), [
    props.children,
  ]);
  return <ScreenStackNativeComponent {...props} screensKeys={screensKeys} />;
};

export default ScreenStack;
