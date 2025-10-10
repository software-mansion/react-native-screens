package com.swmansion.rnscreens.gamma.tabs.image

import android.content.Context
import android.graphics.drawable.Drawable
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.core.graphics.drawable.toDrawable
import androidx.core.net.toUri
import com.facebook.common.executors.CallerThreadExecutor
import com.facebook.common.references.CloseableReference
import com.facebook.datasource.BaseDataSubscriber
import com.facebook.datasource.DataSource
import com.facebook.drawee.backends.pipeline.Fresco
import com.facebook.imagepipeline.image.CloseableImage
import com.facebook.imagepipeline.image.CloseableStaticBitmap
import com.facebook.imagepipeline.request.ImageRequestBuilder
import com.swmansion.rnscreens.gamma.tabs.TabScreen

internal fun loadTabImage(
    context: Context,
    uri: String,
    view: TabScreen,
) {
    // Since image loading might happen on a background thread
    // ref. https://frescolib.org/docs/intro-image-pipeline.html
    // We should schedule rendering the result on the UI thread
    loadTabImageInternal(context, uri) { drawable ->
        Handler(Looper.getMainLooper()).post {
            view.icon = drawable
        }
    }
}

private fun loadTabImageInternal(
    context: Context,
    uri: String,
    onLoaded: (Drawable) -> Unit,
) {
    val source = resolveTabImageSource(context, uri) ?: return
    val finalUri =
        when (source) {
            is RNSImageSource.DrawableRes -> {
                "res://${context.packageName}/${source.resId}".toUri()
            }
            is RNSImageSource.UriString -> {
                source.uri.toUri()
            }
        }

    val imageRequest =
        ImageRequestBuilder
            .newBuilderWithSource(finalUri)
            .build()

    val dataSource = Fresco.getImagePipeline().fetchDecodedImage(imageRequest, context)
    dataSource.subscribe(
        object : BaseDataSubscriber<CloseableReference<CloseableImage>>() {
            override fun onNewResultImpl(dataSource: DataSource<CloseableReference<CloseableImage>?>) {
                if (!dataSource.isFinished) return
                val imageReference = dataSource.result ?: return
                val closeableImage = imageReference.get()

                if (closeableImage is CloseableStaticBitmap) {
                    val bitmap = closeableImage.underlyingBitmap
                    val drawable = bitmap.toDrawable(context.resources)
                    onLoaded(drawable)
                }

                imageReference.close()
            }

            override fun onFailureImpl(dataSource: DataSource<CloseableReference<CloseableImage>?>) {
                Log.e("[RNScreens]", "Error loading image: $uri", dataSource.failureCause)
            }
        },
        CallerThreadExecutor.getInstance(),
    )
}

private fun resolveTabImageSource(
    context: Context,
    uri: String,
): RNSImageSource? {
    // In release builds, assets are coming with bundle and we need to work with resource id.
    // In debug, metro is responsible for handling assets via http.
    // At the moment, we're supporting images (drawable) and SVG icons (raw).
    // For any other type, we may consider adding a support in the future if needed.
    if (uri.startsWith("_")) {
        val drawableResId = context.resources.getIdentifier(uri, "drawable", context.packageName)
        if (drawableResId != 0) {
            return RNSImageSource.DrawableRes(drawableResId)
        }
        val rawResId = context.resources.getIdentifier(uri, "raw", context.packageName)
        if (rawResId != 0) {
            return RNSImageSource.DrawableRes(rawResId)
        }
        Log.e("[RNScreens]", "Resource not found in drawable or raw: $uri")
        return null
    }

    // If asset isn't included in android source directories and we're loading it from given path.
    return RNSImageSource.UriString(uri)
}

private sealed class RNSImageSource {
    data class DrawableRes(
        val resId: Int,
    ) : RNSImageSource()

    data class UriString(
        val uri: String,
    ) : RNSImageSource()
}
