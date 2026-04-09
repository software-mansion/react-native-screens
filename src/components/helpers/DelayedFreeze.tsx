import React from 'react';
import { Freeze } from 'react-freeze';

interface FreezeWrapperProps {
  freeze: boolean;
  children: React.ReactNode;
}

// This component allows one more render before freezing the screen.
// Allows activityState to reach the native side and useIsFocused to work correctly.
function DelayedFreeze({ freeze, children }: FreezeWrapperProps) {
  // flag used for determining whether freeze should be enabled
  const [freezeState, setFreezeState] = React.useState(false);
  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);


  React.useEffect(() => {
    if (mountedRef.current) {
      setFreezeState(freeze);
    }
  }, [freeze]);

  return <Freeze freeze={freeze ? freezeState : false}>{children}</Freeze>;
}

export default DelayedFreeze;
