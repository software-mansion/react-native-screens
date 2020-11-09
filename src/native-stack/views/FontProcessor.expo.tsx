// @ts-ignore this file extension is parsed only in managed workflow, so `expo-font` should be always available there
// eslint-disable-next-line import/no-unresolved
import { processFontFamily } from 'expo-font';

export function processFonts(
  fontFamilies: (string | undefined)[]
): (string | undefined)[] {
  return fontFamilies.map((fontFamily) => processFontFamily(fontFamily));
}
