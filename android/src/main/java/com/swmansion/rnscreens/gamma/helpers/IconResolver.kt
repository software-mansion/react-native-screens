package com.swmansion.rnscreens.gamma.helpers

import android.content.Context
import android.graphics.drawable.Drawable

internal class IconResolver {
    private var lastDrawableName: String? = null
    private var lastImageUri: String? = null
    private var lastEmittedDrawableName: String? = null
    private var lastEmittedImageUri: String? = null

    fun resolve(
        context: Context,
        drawableIconResourceName: String?,
        imageIconUri: String?,
        onResolved: (Drawable?) -> Unit,
    ) {
        lastDrawableName = drawableIconResourceName
        lastImageUri = imageIconUri
        if (drawableIconResourceName == lastEmittedDrawableName &&
            imageIconUri == lastEmittedImageUri
        ) {
            return
        }
        lastEmittedDrawableName = drawableIconResourceName
        lastEmittedImageUri = imageIconUri
        when {
            drawableIconResourceName != null ->
                onResolved(getSystemDrawableResource(context, drawableIconResourceName))
            imageIconUri != null ->
                loadImage(context, imageIconUri) { drawable ->
                    if (imageIconUri == lastImageUri && lastDrawableName == null) {
                        onResolved(drawable)
                    }
                }
            else -> onResolved(null)
        }
    }
}
