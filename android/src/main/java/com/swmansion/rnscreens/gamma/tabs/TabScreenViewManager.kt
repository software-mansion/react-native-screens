package com.swmansion.rnscreens.gamma.tabs

import android.content.Context
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Log
import androidx.core.net.toUri
import coil3.ImageLoader
import coil3.asDrawable
import coil3.request.ImageRequest
import coil3.svg.SvgDecoder
import com.bumptech.glide.Glide
import com.facebook.common.executors.CallerThreadExecutor
import com.facebook.common.references.CloseableReference
import com.facebook.datasource.BaseDataSubscriber
import com.facebook.datasource.DataSource
import com.facebook.datasource.DataSubscriber
import com.facebook.drawee.backends.pipeline.Fresco
import com.facebook.imagepipeline.image.CloseableBitmap
import com.facebook.imagepipeline.image.CloseableImage
import com.facebook.imagepipeline.request.ImageRequestBuilder
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
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@ReactModule(name = TabScreenViewManager.REACT_CLASS)
class TabScreenViewManager :
    ViewGroupManager<TabScreen>(),
    RNSBottomTabsScreenManagerInterface<TabScreen> {
    private val delegate: ViewManagerDelegate<TabScreen> = RNSBottomTabsScreenManagerDelegate<TabScreen, TabScreenViewManager>(this)

    override fun getName() = REACT_CLASS

    var imageLoader: ImageLoader? = null

    var context: ThemedReactContext? = null

    override fun createViewInstance(reactContext: ThemedReactContext): TabScreen {
        imageLoader =
            ImageLoader
                .Builder(reactContext)
                .components {
                    add(SvgDecoder.Factory())
                }.build()
        context = reactContext
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

    override fun setTabBarBackgroundColor(
        view: TabScreen,
        value: Int?,
    ) = Unit

    override fun setTabBarBlurEffect(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setTabBarItemTitleFontFamily(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setTabBarItemTitleFontSize(
        view: TabScreen,
        value: Float,
    ) = Unit

    override fun setTabBarItemTitleFontWeight(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setTabBarItemTitleFontStyle(
        view: TabScreen,
        value: String?,
    ) = Unit

    override fun setTabBarItemTitleFontColor(
        view: TabScreen,
        value: Int?,
    ) = Unit

    @ReactProp(name = "tabBarItemBadgeBackgroundColor", customType = "Color")
    override fun setTabBarItemBadgeBackgroundColor(
        view: TabScreen,
        value: Int?,
    ) {
        view.tabBarItemBadgeBackgroundColor = value
    }

    override fun setTabBarItemTitlePositionAdjustment(
        view: TabScreen?,
        value: ReadableMap?,
    ) = Unit

    override fun setTabBarItemIconColor(
        view: TabScreen?,
        value: Int?,
    ) = Unit

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

    @ReactProp("iconResource")
    override fun setIconResource(
        view: TabScreen,
        value: ReadableMap?,
    ) {
        val uri = value?.getString("uri")

        /*
            This works, but the first icon is loaded to early, and it don't respect icon color
            We should be able to handle the first problem using controller from fresco or something
            similar to listen for finish event. The seccond thing is probably about the difference
            BitmapDrawable vs RootDrawable, not sure how to resolve that. Tried converting to bitmap and
            back to BitmapDrawable without luck.
         */

//        if (uri != null) {
//            val draweeView = SimpleDraweeView(context)
//            draweeView.setImageURI(uri)
//            view.icon = draweeView.drawable
//        }

        // Works fine lib (coil3) around 160kb in final bundle
        if (uri != null) {
            loadUsingCoil(view.context, uri) {
                view.icon = it
            }
        }

        // Works fine lib (glide) around 270kb in final bundle
//        if (uri != null) {
//            runBlocking {
//                val drawable = loadGlideImage(view.context, uri)
//                view.icon = drawable
//            }
//        }

    /*
        When you debug you can see that the drawable is properly downloaded, but it's not visible
        My guess is that fresco may clear it automatically
        Additionaly active indicator seems to be broken I have no idea why
     */

//        if (uri != null) {
//            loadUsingFresco(uri) {
//                view.icon = it
//            }
//        }
    }

    suspend fun loadGlideImage(
        context: Context,
        uri: String,
    ): Drawable =
        withContext(Dispatchers.IO) {
            Glide
                .with(context)
                .asDrawable()
                .load(uri.toUri())
                .submit()
                .get()
        }

    fun loadUsingCoil(
        context: Context,
        uri: String,
        onLoad: (img: Drawable) -> Unit,
    ) {
        val request =
            ImageRequest
                .Builder(context)
                .data(uri)
                .target { drawable ->
                    val stateDrawable = drawable.asDrawable(context.resources)
                    onLoad(stateDrawable)
                }.listener(
                    onError = { _, result ->
                        Log.e("RCTTabView", "Error loading image: $uri", result.throwable)
                    },
                    onCancel = {
                        Log.w("Cancel", "WTF?")
                    },
                ).build()

        imageLoader?.enqueue(request)
    }

    fun loadUsingFresco(
        uri: String,
        onLoad: (img: Drawable) -> Unit,
    ) {
        val request =
            ImageRequestBuilder
                .newBuilderWithSource(uri.toUri())
                .build()
        val imagePipeline = Fresco.getImagePipeline()
        val dataSource =
            imagePipeline.fetchDecodedImage(request, null)
        val dataSubscriber: DataSubscriber<CloseableReference<CloseableImage>> =
            object : BaseDataSubscriber<CloseableReference<CloseableImage>>() {
                override fun onNewResultImpl(dataSource: DataSource<CloseableReference<CloseableImage>>) {
                    if (!dataSource.isFinished) {
                        return
                    }
                    val ref = dataSource.result!!.get()
                    if (ref is CloseableBitmap) {
                        val bitmap = ref.underlyingBitmap
                        val bitmapDrawable = BitmapDrawable(context!!.resources, bitmap)
                        onLoad(bitmapDrawable)
                    } else {
                        println("NOPE")
                    }
                }

                override fun onFailureImpl(dataSource: DataSource<CloseableReference<CloseableImage>>) {
                    TODO("Not yet implemented")
                }
            }

        dataSource.subscribe(dataSubscriber, CallerThreadExecutor.getInstance())
    }

    companion object {
        const val REACT_CLASS = "RNSBottomTabsScreen"
    }
}
