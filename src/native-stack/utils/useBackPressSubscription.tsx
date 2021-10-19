import React from 'react';
import { BackHandler, NativeEventSubscription } from 'react-native';

interface Args {
  onBackPress: () => boolean;
  disabled: boolean;
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
    if (isActive && !args.disabled) {
      console.log('Attached');
      createSubscription();
    }
  }, [createSubscription, isActive, args.disabled]);

  const handleDetached = React.useCallback(() => {
    if (!args.disabled) {
      console.log('Detached');
      clearSubscription(false);
    }
  }, [createSubscription, isActive, args.disabled]);

  React.useEffect(() => {
    if (args.disabled && isActive) {
      clearSubscription();
    }
  }, [args.disabled]);

  return {
    handleAttached,
    handleDetached,
    createSubscription,
    clearSubscription,
  };
}
