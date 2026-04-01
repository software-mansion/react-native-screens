/**
 * TS module resolution does not support this RN platform extension pattern out of the box.
 * Without a base .tsx file, TS will throw a "Cannot find module" error.
 *
 * This file satisfies the TS compiler by providing the correct type signatures,
 * whereas Metro will handle the proper runtime file resolution.
 */

import React from 'react';
import { StackHeaderSubviewProps } from './StackHeaderSubview.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function StackHeaderSubview(
  props: StackHeaderSubviewProps,
): React.JSX.Element;
