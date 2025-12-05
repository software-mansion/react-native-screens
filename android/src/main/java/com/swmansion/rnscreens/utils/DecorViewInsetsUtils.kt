package com.swmansion.rnscreens.utils

import android.view.View
import android.view.ViewParent
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.swmansion.rnscreens.Screen

/**
 * Retrieves the top system inset (status bar, display cutout) relative to the specific [subjectView].
 *
 * This function ensures that system insets are applied **only once** per view hierarchy path.
 * It traverses the view hierarchy upwards to find the top-level Screen which has a visible header.
 *
 * - If subjectView is that root-most screen, the function returns the actual pixel value of the inset.
 * - If subjectView is nested inside another screen that handles the header, or if it's not the
 * highest one, it returns 0 to prevent double-padding.
 * - If subjectView is null, it returns the raw top inset from the decor view, for handling insets for
 * other components, like Toolbars.
 *
 * @param decorView The top-level window decor view used to retrieve root insets.
 * @param subjectView The Screen component checking if it should apply the inset.
 * @return The top inset in pixels, or 0 if the view shouldn't apply it.
 */
internal fun getDecorViewTopInsetRelativelyToTopScreenOrZero(
    decorView: View,
    subjectView: Screen?,
): Int {
    val insetsCompat = ViewCompat.getRootWindowInsets(decorView) ?: return 0
    val topInset = getTopInset(insetsCompat)

    if (subjectView == null) {
        return topInset
    }

    val highestScreenWithVisibleHeader = findHighestScreenWithVisibleHeader(subjectView)

    return if (subjectView == highestScreenWithVisibleHeader) topInset else 0
}

/**
 * Traverses the view hierarchy upwards from view to find the highest positioned in the hierarchy
 * Screen that has a visible header.
 */
private fun findHighestScreenWithVisibleHeader(view: View): Screen? {
    var highestScreen: Screen? = null
    var currentParent: ViewParent? = view as ViewParent?

    while (currentParent != null) {
        if (currentParent is Screen && currentParent.headerConfig?.isHeaderHidden == false) {
            highestScreen = currentParent
        }
        currentParent = currentParent.parent
    }
    return highestScreen
}

private fun getTopInset(insetsCompat: WindowInsetsCompat): Int =
    insetsCompat
        .getInsets(
            WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout(),
        ).top
