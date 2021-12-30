package com.swmansion.rnscreens

import android.graphics.drawable.Drawable
import android.view.View
import android.widget.EditText
import android.widget.ImageView
import androidx.appcompat.R
import androidx.appcompat.widget.SearchView

class SearchViewFormatter(var searchView: SearchView) {
    private var mDefaultTextColor: Int? = null
    private var mDefaultTintBackground: Drawable? = null

    private val searchEditText
        get() = searchView.findViewById<View>(R.id.search_src_text) as? EditText
    private val searchTextPlate
        get() = searchView.findViewById<View>(R.id.search_plate)
    private val searchIcon
        get() = searchView.findViewById<ImageView>(R.id.search_button)
    private val searchCloseIcon
        get() = searchView.findViewById<ImageView>(R.id.search_close_btn)
    private val searchHintIcon
        get() = searchView.findViewById<ImageView>(R.id.search_mag_icon)

    fun setTextColor(textColor: Int?) {
        val currentDefaultTextColor = mDefaultTextColor
        if (textColor != null) {
            if (mDefaultTextColor == null) {
                mDefaultTextColor = searchEditText?.textColors?.defaultColor
            }
            searchEditText?.setTextColor(textColor)
        } else if (currentDefaultTextColor != null) {
            searchEditText?.setTextColor(currentDefaultTextColor)
        }
    }

    fun setTintColor(tintColor: Int?) {
        val currentDefaultTintColor = mDefaultTintBackground
        if (tintColor != null) {
            if (mDefaultTintBackground == null) {
                mDefaultTintBackground = searchTextPlate.background
            }
            searchTextPlate.setBackgroundColor(tintColor)
        } else if (currentDefaultTintColor != null) {
            searchTextPlate.background = currentDefaultTintColor
        }
    }

    fun setHeaderIconColor(headerIconColor: Int?) {
        headerIconColor?.let {
            searchIcon.setColorFilter(headerIconColor)
            searchCloseIcon.setColorFilter(headerIconColor)
        }
    }

    fun setTextHintColor(textHintColor: Int?) {
        textHintColor?.let {
            searchEditText?.setHintTextColor(textHintColor)
        }
    }

    fun setHintSearchIcon(hintSearchIcon: Boolean?, placeholder: String?) {
        hintSearchIcon?.let {
            if (hintSearchIcon) {
                searchView.queryHint = placeholder
            } else {
                searchEditText?.hint = placeholder
            }
        }
    }
}
