package com.swmansion.rnscreens.gamma.tabs

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
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RNSBottomTabsScreenManagerDelegate
import com.facebook.react.viewmanagers.RNSBottomTabsScreenManagerInterface
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenDidAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenDidDisappearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenWillAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenWillDisappearEvent
import com.swmansion.rnscreens.utils.RNSLog

@ReactModule(name = TabScreenViewManager.REACT_CLASS)
class TabScreenViewManager :
    ViewGroupManager<TabScreen>(),
    RNSBottomTabsScreenManagerInterface<TabScreen> {
    private val delegate: ViewManagerDelegate<TabScreen> = RNSBottomTabsScreenManagerDelegate<TabScreen, TabScreenViewManager>(this)

    override fun getName() = REACT_CLASS

    var context: ThemedReactContext? = null

    override fun createViewInstance(reactContext: ThemedReactContext): TabScreen {
        RNSLog.d(REACT_CLASS, "createViewInstance")
        return TabScreen(reactContext)
    }

    override fun getDelegate() = delegate

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        mutableMapOf(
            makeEventRegistrationInfo(TabScreenWillAppearEvent),
            makeEventRegistrationInfo(TabScreenDidAppearEvent),
            makeEventRegistrationInfo(TabScreenWillDisappearEvent),
            makeEventRegistrationInfo(TabScreenDidDisappearEvent),
        )

    override fun addEventEmitters(
        reactContext: ThemedReactContext,
        view: TabScreen,
    ) {
        super.addEventEmitters(reactContext, view)
        view.onViewManagerAddEventEmitters()
    }

    // These should be ignored or another component, dedicated for Android should be used
    override fun setStandardAppearance(
        view: TabScreen,
        value: Dynamic,
    ) = Unit

    override fun setScrollEdgeAppearance(
        view: TabScreen,
        value: Dynamic,
    ) = Unit

    @ReactProp(name = "tabBarItemBadgeBackgroundColor", customType = "Color")
    override fun setTabBarItemBadgeBackgroundColor(
        view: TabScreen,
        value: Int?,
    ) {
        view.tabBarItemBadgeBackgroundColor = value
    }

    override fun setIconType(
        view: TabScreen?,
        value: String?,
    ) = Unit

    override fun setIconImageSource(
        view: TabScreen?,
        value: ReadableMap?,
    ) = Unit

    override fun setIconSfSymbolName(
        view: TabScreen?,
        value: String?,
    ) = Unit

    override fun setSelectedIconImageSource(
        view: TabScreen?,
        value: ReadableMap?,
    ) = Unit

    override fun setSelectedIconSfSymbolName(
        view: TabScreen?,
        value: String?,
    ) = Unit

    // Annotation is Paper only
    @ReactProp(name = "isFocused")
    override fun setIsFocused(
        view: TabScreen,
        value: Boolean,
    ) {
        RNSLog.d(REACT_CLASS, "TabScreen [${view.id}] setIsFocused $value")
        view.isFocusedTab = value
    }

    @ReactProp(name = "tabKey")
    override fun setTabKey(
        view: TabScreen,
        value: String?,
    ) {
        view.tabKey = value
    }

    @ReactProp(name = "badgeValue")
    override fun setBadgeValue(
        view: TabScreen,
        value: String?,
    ) {
        view.badgeValue = value
    }

    @ReactProp(name = "title")
    override fun setTitle(
        view: TabScreen,
        value: String?,
    ) {
        view.tabTitle = value
    }

    override fun setSpecialEffects(
        view: TabScreen,
        value: ReadableMap?,
    ) = Unit

    override fun setOverrideScrollViewContentInsetAdjustmentBehavior(
        view: TabScreen,
        value: Boolean,
    ) = Unit

    // Android specific
    @ReactProp(name = "tabBarItemBadgeTextColor", customType = "Color")
    override fun setTabBarItemBadgeTextColor(
        view: TabScreen,
        value: Int?,
    ) {
        view.tabBarItemBadgeTextColor = value
    }

    @ReactProp(name = "iconResourceName")
    override fun setIconResourceName(
        view: TabScreen,
        value: String?,
    ) {
        view.iconResourceName = value
    }

    override fun setOrientation(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setSystemItem(
        view: TabScreen,
        value: String?,
    ) = Unit

    @ReactProp(name = "iconResource")
    override fun setIconResource(
        view: TabScreen,
        value: ReadableMap?,
    ) {
        val uri = value?.getString("uri")

        if (uri != null) {
            val context = view.context
            val source = resolveSource(context, uri)

            if (source != null) {
                loadUsingFresco(context, source) {
                    Handler(Looper.getMainLooper()).post {
                        view.icon = it
                    }
                }
            }
        }
    }

    private fun loadUsingFresco(
        context: Context,
        source: RNSImageSource,
        onLoad: (img: Drawable) -> Unit,
    ) {
        val uri =
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
                .newBuilderWithSource(uri)
                .build()

        val dataSource = Fresco.getImagePipeline().fetchDecodedImage(imageRequest, context)

        dataSource.subscribe(
            object : BaseDataSubscriber<CloseableReference<CloseableImage>>() {
                override fun onNewResultImpl(dataSource: DataSource<CloseableReference<CloseableImage>?>) {
                    if (!dataSource.isFinished) {
                        return
                    }

                    val imageReference = dataSource.result ?: return
                    val closeableImage = imageReference.get()

                    if (closeableImage is CloseableStaticBitmap) {
                        val bitmap = closeableImage.underlyingBitmap

                        val drawable = bitmap.toDrawable(context.resources)
                        onLoad(drawable)
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

    private fun resolveSource(
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

    companion object {
        const val REACT_CLASS = "RNSBottomTabsScreen"
    }
}
