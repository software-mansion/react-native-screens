package com.swmansion.rnscreens.gamma.tabs.image

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.core.graphics.drawable.toDrawable
import com.facebook.common.executors.CallerThreadExecutor
import com.facebook.common.references.CloseableReference
import com.facebook.datasource.BaseDataSubscriber
import com.facebook.datasource.DataSource
import com.facebook.drawee.backends.pipeline.Fresco
import com.facebook.imagepipeline.image.CloseableImage
import com.facebook.imagepipeline.image.CloseableStaticBitmap
import com.facebook.imagepipeline.request.ImageRequestBuilder
import com.swmansion.rnscreens.gamma.tabs.TabScreen
import java.util.Locale

internal fun loadTabImage(
    context: Context,
    uri: String,
    view: TabScreen,
) {
    // Since image loading might happen on a background thread
    // ref. https://frescolib.org/docs/intro-image-pipeline.html
    // We should schedule rendering the result on the UI thread
    val resolvedUri = ImageSource(context, uri).getUri(context) ?: return
    loadTabImageInternal(context, resolvedUri) { drawable ->
        Handler(Looper.getMainLooper()).post {
            view.icon = drawable
        }
    }
}

private fun loadTabImageInternal(
    context: Context,
    uri: Uri,
    onLoaded: (Drawable) -> Unit,
) {
    val imageRequest =
        ImageRequestBuilder
            .newBuilderWithSource(uri)
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

// Adapted from https://github.com/callstackincubator/react-native-bottom-tabs/blob/main/packages/react-native-bottom-tabs/android/src/main/java/com/rcttabview/ImageSource.kt
private class ImageSource(
    private val context: Context,
    private val uriString: String?,
) {
    private fun isLocalResourceUri(uri: Uri?): Boolean = uri?.scheme?.startsWith("res") ?: false

    fun getUri(context: Context): Uri? {
        val uri = computeUri(context)
        if (isLocalResourceUri(uri)) {
            return Uri.parse(
                uri!!.toString().replace("res:/", "android.resource://${context.packageName}/"),
            )
        }
        return uri
    }

    private fun computeUri(context: Context): Uri? {
        val stringUri = uriString ?: return null

        return try {
            val uri = Uri.parse(stringUri)
            // Verify scheme is set, so that relative uri (used by static resources) are not handled.
            if (uri.scheme == null) {
                computeLocalUri(stringUri, context)
            } else {
                uri
            }
        } catch (_: Exception) {
            computeLocalUri(stringUri, context)
        }
    }

    private fun computeLocalUri(
        name: String,
        context: Context,
    ): Uri? = ResourceIdHelper.getResourceUri(context, name)
}

// Adapted from https://github.com/expo/expo/blob/sdk-52/packages/expo-image/android/src/main/java/expo/modules/image/ResourceIdHelper.kt
private object ResourceIdHelper {
    private val idMap = mutableMapOf<String, Int>()

    @SuppressLint("DiscouragedApi")
    private fun getIdForResourceType(
        context: Context,
        name: String,
        type: String,
    ): Int {
        if (name.isEmpty()) return -1
        val normalizedName = name.lowercase(Locale.ROOT).replace("-", "_")
        val key = "$type/$normalizedName"
        synchronized(this) {
            idMap[key]?.let { return it }
            val id = context.resources.getIdentifier(normalizedName, type, context.packageName)
            idMap[key] = id
            return id
        }
    }

    fun getResourceUri(
        context: Context,
        name: String,
    ): Uri? {
        val normalizedName = name.lowercase(Locale.ROOT).replace("-", "_")

        val drawableResId = getIdForResourceType(context, name, "drawable")
        if (drawableResId != 0) {
            return Uri.parse("res:/$drawableResId")
        }

        val rawResId = getIdForResourceType(context, name, "raw")
        if (rawResId != 0) {
            return Uri.parse("res:/$rawResId")
        }

        return if (name.startsWith("asset:/")) {
            Uri.parse("file:///android_asset/" + name.removePrefix("asset:/"))
        } else {
            Uri.parse("file:///android_asset/$name")
        }
    }
}
