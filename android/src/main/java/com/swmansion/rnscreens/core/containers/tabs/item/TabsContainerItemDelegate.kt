package com.swmansion.rnscreens.core.containers.tabs.item

import androidx.fragment.app.Fragment

interface TabsContainerItemDelegate {
    /**
     * This returns fragment **if one is associated with given item**.
     */
    fun getFragmentForItem(item: TabsContainerItem): Fragment?
}
