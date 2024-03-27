package com.swmansion.rnscreens

import android.content.Context
import com.google.android.material.appbar.MaterialToolbar

// This class is used to store config closer to search bar
open class CustomToolbar(context: Context, val config: ScreenStackHeaderConfig) : MaterialToolbar(context)
