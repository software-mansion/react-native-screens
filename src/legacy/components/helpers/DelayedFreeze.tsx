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

  // Clear a stale freezeState synchronously. If the screen is focused and
  // blurred again before the scheduled reset fires, keeping the stale `true`
  // would freeze the subtree in the same commit as its deactivation, so the
  // grace render never happens and neither activityState nor the blur reach
  // the frozen children (see #4518).
  if (!freeze && freezeState) {
    setFreezeState(false);
  }

  React.useEffect(() => {
    const id = setTimeout(() => {
      setFreezeState(freeze);
    }, 0);
    return () => {
      clearTimeout(id);
    };
  }, [freeze]);

  return <Freeze freeze={freeze ? freezeState : false}>{children}</Freeze>;
}

export default DelayedFreeze;
