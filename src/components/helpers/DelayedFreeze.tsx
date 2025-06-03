import React from 'react';
import { Freeze } from 'react-freeze';

interface FreezeWrapperProps {
  freeze: boolean;
  tag: number;
  children: React.ReactNode;
}

// This component allows one more render before freezing the screen.
// Allows activityState to reach the native side and useIsFocused to work correctly.
function DelayedFreeze({ freeze, children, tag }: FreezeWrapperProps) {
  // flag used for determining whether freeze should be enabled
  const [freezeState, setFreezeState] = React.useState(false);

  React.useEffect(() => {
    const id = setImmediate(() => {
      setFreezeState(freeze);
    });
    return () => {
      clearImmediate(id);
    };
  }, [freeze]);

  console.log(`internal freeze: [${tag}] ${freeze}`);

  return <Freeze freeze={freeze ? freezeState : false}>{children}</Freeze>;
}

export default DelayedFreeze;
