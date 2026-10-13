package com.swmansion.rnscreens.ext

import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction

internal fun FragmentManager.createTransactionWithReordering(): FragmentTransaction = this.beginTransaction().setReorderingAllowed(true)
