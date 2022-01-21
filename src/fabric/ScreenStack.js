import * as React from 'react';
import ScreenStackNativeComponent, {
  Commands,
} from './ScreenStackNativeComponent';
import ScreenStateContext from './ScreenStateContext';

const ScreenStack = function (props) {
  const ref = React.useRef(null);
  const handleWillScreenUnmount = () => {
    if (ref.current) {
      Commands.callScreenWillGoOut(ref.current);
    }
  };
  return (
    <ScreenStateContext.Provider
      value={{ onWillScreenUnmount: handleWillScreenUnmount }}>
      <ScreenStackNativeComponent {...props} ref={ref} />
    </ScreenStateContext.Provider>
  );
};

export default ScreenStack;
