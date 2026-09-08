package com.swmansion.rnscreens.helpers

import android.graphics.drawable.Drawable

/**
 * Outcome of [PropIconResolver.resolve].
 *
 * [Unchanged] is reported when the requested source matches the one the resolver
 * last emitted, so the caller should keep whatever icon it already has (no reload
 * happens). [Resolved] carries a freshly resolved drawable, or `null` when the
 * source resolves to no icon or fails to load (i.e. the icon should be cleared).
 */
internal sealed interface IconResolution {
    object Unchanged : IconResolution

    data class Resolved(
        val drawable: Drawable?,
    ) : IconResolution
}

/**
 * Stateful, latest-wins icon resolver for a single declaratively-driven icon slot — a `toolbarMenu`
 * prop menu item, or the back button — that is re-evaluated on every source change. It deduplicates
 * unchanged sources ([IconResolution.Unchanged]) to avoid needless reloads/flicker, and drops stale
 * async results so a slow load cannot clobber a newer source.
 *
 * [load] must invoke its completion callback exactly once — synchronously or asynchronously,
 * always on the main thread — with the loaded drawable, or `null` when the source resolves to
 * no icon or fails to load (see e.g. [resolveImage]).
 */
internal class PropIconResolver(
    private val load: (drawableIconResourceName: String?, imageIconUri: String?, onComplete: (Drawable?) -> Unit) -> Unit,
) {
    private var lastDrawableName: String? = null
    private var lastImageUri: String? = null
    private var lastEmittedDrawableName: String? = null
    private var lastEmittedImageUri: String? = null

    /**
     * Resolves an icon from a drawable resource name or an image uri. The result is delivered
     * to [onResult] only if the requested source is still the latest one (stale async results
     * are dropped).
     */
    fun resolve(
        drawableIconResourceName: String?,
        imageIconUri: String?,
        onResult: (IconResolution) -> Unit,
    ) {
        lastDrawableName = drawableIconResourceName
        lastImageUri = imageIconUri
        if (drawableIconResourceName == lastEmittedDrawableName &&
            imageIconUri == lastEmittedImageUri
        ) {
            onResult(IconResolution.Unchanged)
            return
        }
        lastEmittedDrawableName = drawableIconResourceName
        lastEmittedImageUri = imageIconUri
        load(drawableIconResourceName, imageIconUri) { drawable ->
            if (drawableIconResourceName == lastDrawableName && imageIconUri == lastImageUri) {
                onResult(IconResolution.Resolved(drawable))
            }
        }
    }
}
