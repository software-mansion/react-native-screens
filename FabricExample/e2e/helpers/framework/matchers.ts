import { element, by } from 'detox';
import type {
  AndroidElementAttributes,
  IosElementAttributes,
  NativeMatcher,
} from 'detox/detox';

export type ElementAttributes = IosElementAttributes | AndroidElementAttributes;

export type Frame = ElementAttributes['frame'];

export type MatchOptions = {
  /**
   * Resolve to no matches instead of throwing. Pass only where absence is an
   * expected state — it also swallows a crashed app and a dropped connection.
   */
  orEmpty?: boolean;
};

/**
 * All matches as one array (topmost stacked screen last). Throws on no match
 * unless `orEmpty`, so a crashed app is not read as "found 0".
 */
export async function getMatches(
  matcher: NativeMatcher,
  { orEmpty = false }: MatchOptions = {},
): Promise<ElementAttributes[]> {
  try {
    const attrs = await element(matcher).getAttributes();
    return 'elements' in attrs ? attrs.elements : [attrs];
  } catch (error) {
    if (orEmpty) {
      return [];
    }
    throw error;
  }
}

/** How many elements `matcher` resolves to; `0` with `orEmpty` and no match. */
export async function countMatches(
  matcher: NativeMatcher,
  options?: MatchOptions,
): Promise<number> {
  return (await getMatches(matcher, options)).length;
}

/**
 * Attributes of `matcher`'s only match; throws when it resolves to several.
 * `description` names the target in that error — a matcher does not stringify.
 */
export async function getSingleMatch(
  matcher: NativeMatcher,
  description = 'matcher',
): Promise<ElementAttributes> {
  const matches = await getMatches(matcher);
  if (matches.length > 1) {
    throw new Error(
      `${description} resolved to ${matches.length} elements, expected exactly one. ` +
        'Narrow the matcher, or the view hierarchy changed.',
    );
  }
  return matches[0];
}

export async function getFrame(matcher: NativeMatcher, description?: string) {
  return (await getSingleMatch(matcher, description)).frame;
}

/** Attributes of `matcher`'s last match — the topmost stacked screen's copy. */
async function getTopmostMatch(
  matcher: NativeMatcher,
): Promise<ElementAttributes> {
  const matches = await getMatches(matcher);
  return matches[matches.length - 1];
}

/**
 * The value of an RN `Text`, which Detox reports as `text` on Android and as
 * `label` on iOS (`''` when unset).
 */
function textOf(attributes: ElementAttributes): string {
  return (attributes.text ?? attributes.label ?? '').trim();
}

/** Text of `testID`'s only match; throws when it resolves to several. */
export async function readSingleText(testID: string): Promise<string> {
  return textOf(await getSingleMatch(by.id(testID), `id "${testID}"`));
}

/** Text of the topmost screen's copy of `testID`. */
export async function readTopmostText(testID: string): Promise<string> {
  return textOf(await getTopmostMatch(by.id(testID)));
}
