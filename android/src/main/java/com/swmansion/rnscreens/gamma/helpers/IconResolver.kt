package com.swmansion.rnscreens.gamma.helpers

import android.content.Context
import android.graphics.drawable.Drawable

/**
 * Outcome of [IconResolver.resolve].
 *
 * [Unchanged] is reported when the requested source matches the one the resolver
 * last emitted, so the caller should keep whatever icon it already has (no reload
 * happens). [Resolved] carries a freshly resolved drawable, or `null` when the
 * source resolves to no icon (i.e. the icon should be cleared).
 */
internal sealed interface IconResolution {
    object Unchanged : IconResolution

    data class Resolved(
        val drawable: Drawable?,
    ) : IconResolution
}

internal class IconResolver {
    private var lastDrawableName: String? = null
    private var lastImageUri: String? = null
    private var lastEmittedDrawableName: String? = null
    private var lastEmittedImageUri: String? = null

    /**
     * Resolves an icon from a drawable resource name or an image uri.
     *
     * The result is delivered to [onResult] synchronously for drawable resources and empty sources,
     * and asynchronously for image uris. For image uris, the callback is only invoked if the
     * resolved uri is still the latest requested source (stale requests are dropped).
     */
    fun resolve(
        context: Context,
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
        when {
            drawableIconResourceName != null ->
                onResult(IconResolution.Resolved(getSystemDrawableResource(context, drawableIconResourceName)))
            imageIconUri != null ->
                loadImage(context, imageIconUri) { drawable ->
                    if (imageIconUri == lastImageUri && lastDrawableName == null) {
                        onResult(IconResolution.Resolved(drawable))
                    }
                }
            else -> onResult(IconResolution.Resolved(null))
        }
    }
}
