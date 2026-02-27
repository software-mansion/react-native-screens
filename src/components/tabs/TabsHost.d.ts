/**
 * TS module resolution does not support this RN platform extension pattern out of the box.
 * Without a base .tsx file, TS will throw a "Cannot find module" error.
 *
 * This file satisfies the TS compiler by providing the correct type signatures,
 * whereas Metro will handle the proper runtime file resolution.
 */

import React from 'react';
import { TabsHostProps } from './TabsHost.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function TabsHost(props: TabsHostProps): React.JSX.Element;
