import * as React from 'react';
import ReanimatedSheetTranslationContext from './ReanimatedSheetTranslationContext';

export default function useReanimatedSheetTranslation() {
  const translation = React.useContext(ReanimatedSheetTranslationContext);

  if (translation === undefined) {
    throw new Error(
      "Couldn't find values for reanimated sheet translation. Are you inside a screen in Native Stack?",
    );
  }

  return translation;
}
