import * as React from 'react';

import SheetTranslationContext from './SheetTranslationContext';

export default function useSheetTranslation() {
  const translation = React.useContext(SheetTranslationContext);

  if (translation === undefined) {
    throw new Error(
      "Couldn't find values for sheet translation. Are you inside a screen in Native Stack?",
    );
  }

  return translation;
}
