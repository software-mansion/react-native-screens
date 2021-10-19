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
    subscription.current?.remove();
    subscription.current = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    setIsActive(true);
  }, [subscription.current]);

  const handleAttached = React.useCallback(() => {
    if (isActive && !isDisabled) {
      createSubscription();
    }
  }, [createSubscription, isActive, isDisabled]);

  const handleDetached = React.useCallback(() => {
    if (!isDisabled) {
      clearSubscription(false);
    }
  }, [createSubscription, isActive, isDisabled]);

  React.useEffect(() => {
    if (isDisabled && isActive) {
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
