package com.swmansion.rnscreens.gamma.tabs.container

import android.annotation.SuppressLint
import android.content.Context
import com.google.android.material.bottomnavigation.BottomNavigationView

@SuppressLint("ViewConstructor") // Should not be restored & should only be constructed by us.
class CustomBottomNavigationView(
    context: Context,
    val container: TabsContainer,
) : BottomNavigationView(context) {
    private var actionOrigin: TabsActionOrigin? = null

    internal fun setSelectedItemIdWithActionOrigin(
        itemId: Int,
        actionOrigin: TabsActionOrigin,
    ) {
        require(actionOrigin !== TabsActionOrigin.USER) {
            "[RNScreens] User-triggered actions should be processed via regular setSelectedItemId callback"
        }
        this.actionOrigin = actionOrigin
        selectedItemId = itemId
        this.actionOrigin = null
    }

    override fun setSelectedItemId(itemId: Int) {
        if (this.actionOrigin == null) {
            this.actionOrigin = TabsActionOrigin.USER
        }

        val actionOrigin = checkNotNull(this.actionOrigin)
        super.setSelectedItemId(itemId)
        container.onAfterSetSelectedItemId(itemId, actionOrigin)

        this.actionOrigin = null
    }
}
