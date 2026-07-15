import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
  Platform,
} from 'react-native';
import { nanoid } from 'nanoid/non-secure';
import { SafeAreaView } from 'react-native-screens/experimental';

interface ToastProps {
  index: number;
  id: string;
  backgroundColor: string;
  message: string;
  remove: (_: string) => void;
}

const DISAPPEAR_AFTER = 40 * 1000; // 40 x 1000 ms -> 40 s

const Toast = ({
  index,
  id,
  backgroundColor,
  message,
  remove,
}: ToastProps): React.JSX.Element => {
  useEffect(() => {
    const timer = setTimeout(() => {
      remove(id);
    }, DISAPPEAR_AFTER);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={() => remove(id)}>
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
    <ToastContext.Provider value={{ push }}>
      {children}
      {/*
        Toasts live in a full-screen `box-none` overlay (so touches pass through
        to `children`) that bottom-anchors them in a content-sized SafeAreaView
        (`flex: 0`), whose Android `bottom` inset lifts them above the system
        navigation bar.
        The overlay stays permanently mounted so the native SafeAreaView's
        asynchronously-resolved inset is ready before the first toast appears.
        Note: the native SafeAreaView ignores `pointerEvents`, so while a toast
        is visible it swallows taps on whatever is directly behind it (e.g. the
        tab bar) until the toast is tapped or auto-dismissed. When idle it only
        spans the navigation bar area, which has no interactive content.
      */}
      <View style={styles.overlay} pointerEvents="box-none">
        <SafeAreaView
          edges={{ bottom: Platform.OS === 'android' }}
          style={styles.toastArea}>
          {toasts.map((toast, i) => (
            <Toast index={i} key={toast.id} {...toast} remove={remove} />
          ))}
        </SafeAreaView>
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  toastArea: {
    flex: 0,
    alignItems: 'center',
  },
  container: {
    marginBottom: 5,
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
