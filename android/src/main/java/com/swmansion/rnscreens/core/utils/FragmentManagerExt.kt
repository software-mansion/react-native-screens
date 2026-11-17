package com.swmansion.rnscreens.core.utils

import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction

internal fun FragmentManager.createTransactionWithReordering(): FragmentTransaction = this.beginTransaction().setReorderingAllowed(true)
