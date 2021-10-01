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

const DISAPPEAR_AFTER = 2000; // ms

interface ToastProps {
  id: string;
  backgroundColor: string;
  message: string;
  style?: ViewStyle;
  remove: (_: string) => void;
}

const Toast = ({
  id,
  backgroundColor,
  message,
  style = {},
  remove,
}: ToastProps): JSX.Element => {
  useEffect(() => {
    const timer = setTimeout(() => {
      remove(id);
    }, DISAPPEAR_AFTER);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableOpacity
      style={{ ...styles.container, ...style }}
      onPress={() => remove(id)}>
      <View style={{ ...styles.alert, backgroundColor }}>
        <Text style={styles.text}>{message}</Text>
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

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState(initialState);

  const remove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const push = ({ backgroundColor, message }: Omit<IToast, 'id'>): void => {
    const id = nanoid();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, backgroundColor, message },
    ]);
  };

  return (
    <ToastContext.Provider value={{ push }}>
      <>
        {children}
        {toasts.map((toast, i) => (
          <Toast
            key={toast.id}
            style={{ marginBottom: i * 80 }}
            {...toast}
            remove={remove}
          />
        ))}
      </>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
  },
  alert: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    position: 'relative',
    width: Dimensions.get('screen').width - 40,
    borderRadius: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});
