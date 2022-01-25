import * as React from 'react';
import ScreenStackNativeComponent from './ScreenStackNativeComponent';

function getKey(element) {
  return element.key ?? '';
}

const ScreenStack = function (props) {
  React.useEffect(() => {
    if (!props.children.every((child) => child.key)) {
      throw Error(
        'All Screens that are used inside ScreenStack should have unique key'
      );
    }
  }, [props.children]);
  const screensKeys = React.useMemo(() => props.children.map(getKey), [
    props.children,
  ]);
  return <ScreenStackNativeComponent {...props} screensKeys={screensKeys} />;
};

export default ScreenStack;
