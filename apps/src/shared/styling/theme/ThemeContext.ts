import * as React from 'react';

import { Theme } from './themes';

export const ThemeContext = React.createContext<Theme | undefined>(undefined);

ThemeContext.displayName = 'ThemeContext';
