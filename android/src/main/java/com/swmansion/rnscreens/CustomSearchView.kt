package com.swmansion.rnscreens

import android.content.Context
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.widget.SearchView
import androidx.fragment.app.Fragment

class CustomSearchView(context: Context?, private val fragment: Fragment) : SearchView(context) {
    private var mCustomOnCloseListener: OnCloseListener? = null
    private var mCustomOnSearchClickedListener: OnClickListener? = null
    private var mIsBackCallbackAdded: Boolean = false

    var overrideBackAction: Boolean = true

    private var mOnBackPressedCallback: OnBackPressedCallback =
        object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                handleBackPress()
            }
        }

    fun handleBackPress() {
        isIconified = true
    }

    override fun setOnCloseListener(listener: OnCloseListener?) {
        mCustomOnCloseListener = listener
    }

    override fun setOnSearchClickListener(listener: OnClickListener?) {
        mCustomOnSearchClickedListener = listener
    }

    private fun maybeAddBackCallback() {
        if (!mIsBackCallbackAdded && overrideBackAction) {
            fragment.activity?.onBackPressedDispatcher?.addCallback(
                fragment,
                mOnBackPressedCallback
            )
            mIsBackCallbackAdded = true
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        if (!isIconified) {
            maybeAddBackCallback()
        }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        removeBackCallbackIfAdded()
    }

    private fun removeBackCallbackIfAdded() {
        if (mIsBackCallbackAdded) {
            mOnBackPressedCallback.remove()
            mIsBackCallbackAdded = false
        }
    }

    init {
        super.setOnSearchClickListener { v ->
            mCustomOnSearchClickedListener?.onClick(v)
            maybeAddBackCallback()
        }

        super.setOnCloseListener {
            val result = mCustomOnCloseListener?.onClose() ?: false
            removeBackCallbackIfAdded()
            result
        }

        maxWidth = Integer.MAX_VALUE
    }
}
