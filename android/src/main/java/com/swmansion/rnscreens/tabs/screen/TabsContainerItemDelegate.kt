package com.swmansion.rnscreens.tabs.screen

import androidx.fragment.app.Fragment

interface TabsContainerItemDelegate {
    /**
     * This returns fragment **if one is associated with given item**.
     */
    fun getFragmentForItem(item: TabsContainerItem): Fragment?
}
