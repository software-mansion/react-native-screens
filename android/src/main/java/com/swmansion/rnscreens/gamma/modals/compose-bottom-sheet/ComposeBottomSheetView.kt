package com.swmansion.rnscreens.gamma.modals.composebottomsheet

import android.annotation.SuppressLint
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.viewinterop.AndroidView
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

@SuppressLint("ViewConstructor")
@OptIn(ExperimentalMaterial3Api::class)
class ComposeBottomSheetView(context: ThemedReactContext) : ViewGroup(context) {

    private val composeView = ComposeView(context)

    private val childrenContainer = object : ViewGroup(context) {
        override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {}

        override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
            setMeasuredDimension(
                MeasureSpec.getSize(widthMeasureSpec),
                MeasureSpec.getSize(heightMeasureSpec)
            )
        }
    }

    private val _reactSubviews = mutableListOf<View>()

    private var isOpenState = mutableStateOf(false)

    init {
        addView(composeView)

        composeView.setContent {
            val isOpen by isOpenState
            val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = false)

            if (isOpen) {
                ModalBottomSheet(
                    onDismissRequest = {
                        dispatchOnDismissEvent()
                    },
                    sheetState = sheetState
                ) {
                    AndroidView(
                        factory = { childrenContainer },
                        update = { }
                    )
                }
            }
        }
    }

    fun setIsOpen(isOpen: Boolean) {
        isOpenState.value = isOpen
    }

    private fun dispatchOnDismissEvent() {
        val reactContext = context as ThemedReactContext
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)

        dispatcher?.dispatchEvent(ComposeBottomSheetDismissEvent(surfaceId, id))
    }

    fun addReactSubview(child: View, index: Int) {
        _reactSubviews.add(index, child)
        childrenContainer.addView(child, index)
    }

    fun removeReactSubviewAt(index: Int) {
        val child = _reactSubviews.removeAt(index)
        childrenContainer.removeView(child)
    }

    fun removeAllReactSubviews() {
        _reactSubviews.clear()
        childrenContainer.removeAllViews()
    }

    fun getReactSubviewAt(index: Int): View? = _reactSubviews.getOrNull(index)

    val reactSubviewsCount: Int
        get() = _reactSubviews.size

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        composeView.layout(0, 0, r - l, b - t)
    }
}

class ComposeBottomSheetDismissEvent(
    surfaceId: Int,
    viewTag: Int
) : Event<ComposeBottomSheetDismissEvent>(surfaceId, viewTag) {

    override fun getEventName(): String = "topDismiss"

    override fun getEventData() = Arguments.createMap()
}
