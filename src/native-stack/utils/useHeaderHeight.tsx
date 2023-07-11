import * as React from 'react';

import HeaderHeightContext from './HeaderHeightContext';

type HeaderHeightProps = {
  dynamic: boolean;
};

export default function useHeaderHeight(
  { dynamic }: HeaderHeightProps = { dynamic: true }
) {
  const values = React.useContext(HeaderHeightContext);

  if (values === undefined) {
    throw new Error(
      "Couldn't find the header height. Are you inside a screen in a navigator with a header?"
    );
  }

  if (!dynamic) {
    return values.staticHeight;
  }

  return values.height;
}
