/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  ScrollView,
  Button,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
  ViewStyle,
} from 'react-native';
import { nanoid } from 'nanoid/non-secure';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { SettingsPicker } from '../../shared';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

type NavigatorProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
  stackAnimation: StackAnimation;
  setStackAnimation: (value: StackAnimation) => void;
};

type StackAnimation = Exclude<
  NativeStackNavigationOptions['animation'],
  undefined
>;

const Stack = createNativeStackNavigator();
const NestedStack = createNativeStackNavigator();

function Deeper({ navigation, stackAnimation }: NavigatorProps) {
  const toast = useToast();

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: stackAnimation,
    });
  }, [navigation, stackAnimation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Deeper | transitionStart | ${
            data.closing ? 'closing' : 'opening'
          }`,
          backgroundColor: 'orange',
        });
      },
    );

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      toast.push({
        message: `Deeper | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Deeper transitionStart ' +
            (data.closing ? 'closing' : 'opening'),
        );
      },
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Deeper transitionEnd ' +
          (data.closing ? 'closing' : 'opening'),
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <NestedStack.Navigator
      screenOptions={{
        headerShown: true,
        animation: stackAnimation,
      }}>
      <NestedStack.Screen name="Privacy" component={Privacy} />
      <NestedStack.Screen name="Another" component={Another} />
    </NestedStack.Navigator>
  );
}

export default function NativeNavigation() {
  const [stackAnimation, setStackAnimation] =
    useState<StackAnimation>('default');

  return (
    <NavigationContainer>
      <ToastProvider>
        <Stack.Navigator
          screenOptions={{
            animation: stackAnimation,
          }}>
          <Stack.Screen name="Status">
            {({ navigation }) => (
              <Status
                navigation={navigation}
                stackAnimation={stackAnimation}
                setStackAnimation={setStackAnimation}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Deeper">
            {({ navigation }) => (
              <Deeper
                navigation={navigation}
                stackAnimation={stackAnimation}
                setStackAnimation={setStackAnimation}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </ToastProvider>
    </NavigationContainer>
  );
}

function Status({
  navigation,
  stackAnimation,
  setStackAnimation,
}: NavigatorProps) {
  const toast = useToast();

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: stackAnimation,
    });
  }, [navigation, stackAnimation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Status | transitionStart | ${
            data.closing ? 'closing' : 'opening'
          }`,
          backgroundColor: 'orange',
        });
      },
    );

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      toast.push({
        message: `Status | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Status transitionStart ' +
            (data.closing ? 'closing' : 'opening'),
        );
      },
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Status transitionEnd ' +
          (data.closing ? 'closing' : 'opening'),
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView>
      <SettingsPicker<StackAnimation>
        testID="Test593-stack-animation-picker"
        label="Stack animation"
        value={stackAnimation}
        onValueChange={setStackAnimation}
        items={['default', 'none']}
      />
      <Button
        title="Click"
        onPress={() => navigation.navigate('Deeper')}
        testID="status-button-go-to-deeper"
      />
    </ScrollView>
  );
}

function Privacy({ navigation }: Props) {
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Privacy | transitionStart | ${
            data.closing ? 'closing' : 'opening'
          }`,
          backgroundColor: 'orange',
        });
      },
    );

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      toast.push({
        message: `Privacy | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Privacy transitionStart ' +
            (data.closing ? 'closing' : 'opening'),
        );
      },
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Privacy transitionEnd ' +
          (data.closing ? 'closing' : 'opening'),
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,0,0,0.2)' }}>
      <Button
        title="Click"
        onPress={() => navigation.navigate('Another')}
        testID="privacy-button-go-to-another"
      />
    </View>
  );
}

function Another({ navigation }: Props) {
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        toast.push({
          message: `Another | transitionStart | ${
            data.closing ? 'closing' : 'opening'
          }`,
          backgroundColor: 'orange',
        });
      },
    );

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      toast.push({
        message: `Another | transitionEnd | ${
          data.closing ? 'closing' : 'opening'
        }`,
        backgroundColor: 'dodgerblue',
      });
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'transitionStart',
      ({ data }) => {
        console.warn(
          Platform.OS +
            ' Another transitionStart ' +
            (data.closing ? 'closing' : 'opening'),
        );
      },
    );

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', ({ data }) => {
      console.warn(
        Platform.OS +
          ' Another transitionEnd ' +
          (data.closing ? 'closing' : 'opening'),
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <Button title="Click" onPress={() => navigation.navigate('Another')} />
    </View>
  );
}

interface ToastProps {
  index: number;
  id: string;
  backgroundColor: string;
  message: string;
  style?: ViewStyle;
  remove: (_: string) => void;
}

const DISAPPEAR_AFTER = 10 * 1000; // 10 x 1000 ms -> 10 s

const Toast = ({
  index,
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
      <>
        {children}
        {toasts.map((toast, i) => (
          <Toast
            index={i}
            key={toast.id}
            style={{ marginBottom: i * 45 }}
            {...toast}
            remove={remove}
          />
        ))}
      </>
    </ToastContext.Provider>
  );
};

const useToast = () => useContext(ToastContext);

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
    height: 40,
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
