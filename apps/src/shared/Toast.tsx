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
import { SafeAreaView } from 'react-native-screens/experimental';

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
  style ={},
  remove,
}: ToastProps): React.JSX.Element => {
  useEffect(() => {
    const timer = setTimeout(() => {
      remove(id);
    }, DISAPPEAR_AFTER);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
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

interface ToastProviderProps {
  children: React.ReactNode;
  anchorSide?: 'top' | 'bottom';
}

function ToastContainer({ toasts, remove, anchorSide }: { toasts: IToast[]; remove: (id: string) => void; anchorSide?: 'top' | 'bottom' }) {
  return (
    <View style={[styles.overlay, anchorSide === 'top' ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' }]} pointerEvents="box-none">
      <SafeAreaView
        pointerEvents='box-none'
        collapsable={false}
        edges={{ top: true, bottom: true, }}
        style={[styles.toastArea]}
      >
        {toasts.map((toast, i) => (
          <Toast index={i} key={toast.id} {...toast} remove={remove} />
        ))}
      </SafeAreaView>
    </View>
  );
}

export function ToastProvider({ children, anchorSide }: ToastProviderProps) {
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
      <ToastContainer toasts={toasts} remove={remove} anchorSide={anchorSide ?? 'bottom'} />
    </ToastContext.Provider>
  );

}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
