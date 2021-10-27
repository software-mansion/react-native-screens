import React from 'react';
import { BackHandler, NativeEventSubscription } from 'react-native';

interface Args {
  onBackPress: () => boolean;
  isDisabled: boolean;
}

interface UseBackPressSubscription {
  handleAttached: () => void;
  handleDetached: () => void;
  createSubscription: () => void;
  clearSubscription: () => void;
}

export function useBackPressSubscription({
  onBackPress,
  isDisabled,
}: Args): UseBackPressSubscription {
  const [isActive, setIsActive] = React.useState(false);
  const subscription = React.useRef<NativeEventSubscription | undefined>();

  const clearSubscription = React.useCallback(
    (shouldSetActive = true) => {
      subscription.current?.remove();
      subscription.current = undefined;
      if (shouldSetActive) setIsActive(false);
    },
    [subscription.current]
  );

  const createSubscription = React.useCallback(() => {
    if (!isDisabled) {
      subscription.current?.remove();
      subscription.current = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      setIsActive(true);
    }
  }, [subscription.current, isDisabled]);

  const handleAttached = React.useCallback(() => {
    if (isActive) {
      createSubscription();
    }
  }, [createSubscription, isActive]);

  const handleDetached = React.useCallback(() => {
    clearSubscription(false);
  }, [createSubscription, isActive]);

  React.useEffect(() => {
    if (isDisabled) {
      clearSubscription();
    }
  }, [isDisabled]);

  return {
    handleAttached,
    handleDetached,
    createSubscription,
    clearSubscription,
  };
}
