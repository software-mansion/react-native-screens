package com.swmansion.rnscreens.utils

import com.facebook.react.uimanager.BackgroundStyleApplicator
import com.facebook.react.views.view.ReactViewGroup

internal fun ReactViewGroup.resolveBackgroundColor(): Int? = BackgroundStyleApplicator.getBackgroundColor(this)
