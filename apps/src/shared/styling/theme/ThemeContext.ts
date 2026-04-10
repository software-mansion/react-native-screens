import * as React from 'react';

import { Theme } from '../Colors';

export const ThemeContext = React.createContext<Theme | undefined>(undefined);

ThemeContext.displayName = 'ThemeContext';
