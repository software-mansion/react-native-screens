package com.swmansion.rnscreens.utils

import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.drawable.CSSBackgroundDrawable
import com.facebook.react.views.view.ReactViewGroup

@OptIn(UnstableReactNativeAPI::class)
internal fun ReactViewGroup.resolveBackgroundColor(): Int? = (this.background as? CSSBackgroundDrawable)?.color

