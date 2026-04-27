import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
  ViewStyle,
} from 'react-native';
import { nanoid } from 'nanoid/non-secure';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface ToastProps {
  index: number;
  id: string;
  backgroundColor: string;
  message: string;
  style?: ViewStyle;
  remove: (_: string) => void;
}

const DISAPPEAR_AFTER = 40 * 1000; // 40 x 1000 ms -> 40 s

const Toast = ({
  index,
  id,
  backgroundColor,
  message,
  style = {},
  remove,
}: ToastProps): React.JSX.Element => {
  useEffect(() => {
    const timer = setTimeout(() => {
      remove(id);
    }, DISAPPEAR_AFTER);
    return () => clearTimeout(timer);
  }, [id, remove]); // Added dependencies

  return (
    <TouchableOpacity
      style={{ ...styles.container, ...style }}
      onPress={() => remove(id)}>
      <View style={{ ...styles.alert, backgroundColor }}>
        <Text style={styles.text}>
          {`${index + 1}. `}
          {message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface IToast {
  id: string;
  backgroundColor: string;
  message: string;
}

const initialState: IToast[] = [];

const ToastContext = createContext({
  push: (_: Omit<IToast, 'id'>) => {
    // noop
  },
});

const ToastContainer = ({
  toasts,
  remove,
}: {
  toasts: IToast[];
  remove: (id: string) => void;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      {toasts.map((toast, i) => (
        <Toast
          index={i}
          key={toast.id}
          style={{ bottom: insets.bottom + 5 + i * 25 }}
          {...toast}
          remove={remove}
        />
      ))}
    </>
  );
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState(initialState);

  const remove = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const push = ({ backgroundColor, message }: Omit<IToast, 'id'>): void => {
    const id = nanoid();
    setToasts(prevToasts => [...prevToasts, { id, backgroundColor, message }]);
  };

  return (
    <SafeAreaProvider>
      <ToastContext.Provider value={{ push }}>
        <>
          {children}
          {/* Render the internal container */}
          <ToastContainer toasts={toasts} remove={remove} />
        </>
      </ToastContext.Provider>
    </SafeAreaProvider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
  },
  alert: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
    position: 'relative',
    width: Dimensions.get('screen').width - 40,
    borderRadius: 5,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 12,
    color: 'white',
  },
});
