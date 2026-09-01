package com.swmansion.rnscreens.modals.formsheet.native.core

import android.content.Context
import android.view.ContextThemeWrapper
import android.view.View
import com.swmansion.rnscreens.modals.formsheet.native.interfaces.FormSheetContentSizeChangeDelegate
import com.swmansion.rnscreens.modals.formsheet.native.interfaces.FormSheetDialogEventEmitter
import com.swmansion.rnscreens.modals.formsheet.native.model.FormSheetConfig
import com.swmansion.rnscreens.modals.formsheet.native.presentation.FormSheetDimmingManager
import com.swmansion.rnscreens.modals.formsheet.native.presentation.FormSheetPresentation
import com.swmansion.rnscreens.modals.formsheet.native.presentation.FormSheetPresentationManager
import kotlin.properties.Delegates

class FormSheetDialogManager(
    context: Context,
    private val contentView: View,
) {
    private var formSheetConfig = FormSheetConfig()

    private val themedContext =
        ContextThemeWrapper(
            context,
            com.google.android.material.R.style.Theme_Material3_DayNight_NoActionBar,
        )

    // Eagerly create the container so it's always ready for the provided content view
    private val container = FormSheetContainer(themedContext, contentView)

    // The React content only reports height changes, so a new presentation is seeded with the
    // last known value.
    private var lastContentHeight = 0

    private val presentationCallbacks =
        object : FormSheetPresentation.Callbacks {
            override fun onDetentChanged(index: Int) {
                eventEmitter?.emitOnDetentChanged(index)
            }

            override fun onNativeDismissAllowed() {
                presentationManager.handleNativeDismiss()
            }

            override fun onNativeDismissPrevented() {
                eventEmitter?.emitOnNativeDismissPreventedEvent()
            }
        }

    private val dimmingManager = FormSheetDimmingManager(context)

    private val presentationManager =
        FormSheetPresentationManager(
            presentationFactory = ::createPresentation,
            dimmingManager = dimmingManager,
            onNativeDismiss = { eventEmitter?.emitOnNativeDismissEvent() },
            onDismiss = { eventEmitter?.emitOnDismissEvent() },
        )

    internal var eventEmitter: FormSheetDialogEventEmitter? by Delegates.observable(null) { _, _, newValue ->
        presentationManager.appearanceEventEmitter = newValue
    }

    internal val contentSizeChangeDelegate: FormSheetContentSizeChangeDelegate =
        object : FormSheetContentSizeChangeDelegate {
            override fun onContentHeightChanged(newHeight: Int) {
                lastContentHeight = newHeight
                presentationManager.currentPresentation?.onContentHeightChanged(newHeight)
            }
        }

    private fun createPresentation(): FormSheetPresentation =
        FormSheetPresentation(themedContext, container, presentationCallbacks).also {
            it.applyInitialConfig(formSheetConfig, lastContentHeight)
        }

    internal fun applyConfig(newConfig: FormSheetConfig) {
        val oldConfig = formSheetConfig
        formSheetConfig = newConfig

        presentationManager.currentPresentation?.applyConfigUpdate(oldConfig, newConfig)

        if (oldConfig.isOpen != newConfig.isOpen) {
            presentationManager.requestProgrammaticStateUpdate(newConfig.isOpen)
        }
    }

    internal fun destroy() {
        presentationManager.destroy()
    }
}
