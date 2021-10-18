import React from 'react';
import { BackHandler, NativeEventSubscription } from 'react-native';

interface Args {
  onBackPress: () => boolean;
}

interface UseBackPressSubscription {
  handleAttached: () => void;
  handleDetached: () => void;
  createSubscription: () => void;
  clearSubscription: () => void;
}

export function useBackPressSubscription(args: Args): UseBackPressSubscription {
  const [isActive, setIsActive] = React.useState(false);
  const subscription = React.useRef<NativeEventSubscription | undefined>();

  const clearSubscription = React.useCallback(
    (shouldSetActive = true) => {
      console.log('Clear subscription');
      subscription.current?.remove();
      subscription.current = undefined;
      if (shouldSetActive) setIsActive(false);
    },
    [subscription.current]
  );

  const createSubscription = React.useCallback(() => {
    console.log('Create subscription');
    subscription.current?.remove();
    subscription.current = BackHandler.addEventListener(
      'hardwareBackPress',
      args.onBackPress
    );
    setIsActive(true);
  }, [subscription.current]);

  const handleAttached = React.useCallback(() => {
    console.log('Attached');
    if (isActive) {
      createSubscription();
    }
  }, [createSubscription, isActive]);

  const handleDetached = React.useCallback(() => {
    console.log('Detached');
    clearSubscription(false);
  }, [createSubscription, isActive]);

  //   React.useEffect(() => clearSubscription, [clearSubscription]);

  return {
    handleAttached,
    handleDetached,
    createSubscription,
    clearSubscription,
  };
}
