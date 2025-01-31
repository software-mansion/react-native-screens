package com.swmansion.rnscreens.utils

import com.facebook.react.views.view.ReactViewBackgroundDrawable
import com.facebook.react.views.view.ReactViewGroup

internal fun ReactViewGroup.resolveBackgroundColor(): Int? = (this.background as? ReactViewBackgroundDrawable)?.color
