import { element, by } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import {
  CLASS_NAME_UI_BUTTON_BAR_BUTTON,
  CLASS_NAME_UI_LABEL,
  CLASS_NAME_UI_MODERN_BAR_BUTTON,
} from './native-classes-ios';

// Stack v5 header items (`UIBarButtonItem`).

export type HeaderItemOptions = {
  /**
   * Match the inner control (`_UIModernBarButton`) instead of the item
   * container (`_UIButtonBarButton`). Both carry the title as their label.
   */
  control?: boolean;
};

/** A title-only header item, addressed by its visible title. */
export function headerItem(
  title: string,
  { control = false }: HeaderItemOptions = {},
) {
  return element(
    by
      .type(
        control
          ? CLASS_NAME_UI_MODERN_BAR_BUTTON
          : CLASS_NAME_UI_BUTTON_BAR_BUTTON,
      )
      .and(by.label(title)),
  );
}

/** The header title label. */
export function headerTitle(title: string): NativeMatcher {
  return by.type(CLASS_NAME_UI_LABEL).and(by.text(title));
}

/** A header item's icon, by icon id (SF Symbol name or asset path). */
export function barButtonIcon(iconId: string) {
  return element(
    by.id(iconId).withAncestor(by.type(CLASS_NAME_UI_MODERN_BAR_BUTTON)),
  );
}
