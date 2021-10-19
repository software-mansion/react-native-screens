package com.swmansion.rnscreens

import android.content.Context
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.widget.SearchView
import androidx.fragment.app.Fragment

class CustomSearchView(context: Context?, fragment: Fragment) : SearchView(context) {
    private var mCustomOnCloseListener: OnCloseListener? = null
    private var mCustomOnSearchClickedListener: OnClickListener? = null

    private var mOnBackPressedCallback: OnBackPressedCallback =
        object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                isIconified = true
            }
        }
    private val backPressOverrider = FragmentBackPressOverrider(fragment, mOnBackPressedCallback)
    var overrideBackAction: Boolean
        set(value) {
            backPressOverrider.overrideBackAction = value
        }
        get() = backPressOverrider.overrideBackAction

    fun focus() {
        isIconified = false
        requestFocusFromTouch()
    }

    override fun setOnCloseListener(listener: OnCloseListener?) {
        mCustomOnCloseListener = listener
    }

    override fun setOnSearchClickListener(listener: OnClickListener?) {
        mCustomOnSearchClickedListener = listener
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        if (!isIconified) {
            backPressOverrider.maybeAddBackCallback()
        }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        backPressOverrider.removeBackCallbackIfAdded()
    }

    init {
        super.setOnSearchClickListener { v ->
            mCustomOnSearchClickedListener?.onClick(v)
            backPressOverrider.maybeAddBackCallback()
        }

        super.setOnCloseListener {
            val result = mCustomOnCloseListener?.onClose() ?: false
            backPressOverrider.removeBackCallbackIfAdded()
            result
        }

        maxWidth = Integer.MAX_VALUE
    }
}
