'use client';

import * as React from 'react';
import { Animated } from 'react-native';

export default React.createContext<Animated.Value | undefined>(undefined);
