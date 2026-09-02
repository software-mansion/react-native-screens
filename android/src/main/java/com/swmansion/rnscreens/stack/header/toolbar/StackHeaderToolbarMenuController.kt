package com.swmansion.rnscreens.stack.header.toolbar

import android.graphics.drawable.Drawable
import android.util.Log
import android.view.MenuItem
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.helpers.IconResolution
import com.swmansion.rnscreens.helpers.PropIconResolver
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuConfig
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuElementConfig
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuItemIconSource
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuModel
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarFieldUpdate
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuElementOptions
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuElementRawUpdate
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuElementUpdate
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuIconResolver
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuUpdateQueue
import com.swmansion.rnscreens.stack.header.toolbar.update.toOptions
import java.lang.ref.WeakReference

/**
 * Owns the toolbar menu: the parsed model and the runtime state accumulated on
 * top of it (imperative element updates, group selections, resolved prop
 * icons). The state is the source of truth and lives as long as this
 * controller; an attached toolbar is merely a projection of it, rebuilt from
 * scratch at every [attach]. Checked-state semantics run on the state, so
 * updates behave identically whether a toolbar is attached or not.
 */
internal class StackHeaderToolbarMenuController(
    private val iconResolver: StackHeaderToolbarMenuIconResolver,
) {
    internal var delegate: WeakReference<StackHeaderToolbarMenuDelegate>? = null

    // region Model

    private var model = StackHeaderToolbarMenuModel.EMPTY
    private var groupDividerEnabled = false

    // Set by a menu change and cleared by [attach]: until then a live toolbar
    // still shows the previous menu (with previous int ids), so in-place
    // application is suspended and updates are recorded only.
    private var modelDirty = false

    /**
     * Replaces the menu configuration. Returns `true` when it actually
     * changed; icon sources are part of the config, so an icon-source-only
     * prop change counts. A real change validates the new menu, resets all
     * runtime state, re-initializes group selections from
     * `initialToggleState` and drops pending command batches. Application to
     * the toolbar is the caller's responsibility (via [attach]).
     */
    internal fun setMenu(menu: StackHeaderToolbarMenuConfig): Boolean {
        if (menu == model.config) {
            return false
        }

        // Throws on an invalid menu before any mutation, so the previous,
        // valid model stays intact.
        model = StackHeaderToolbarMenuModel.from(menu)

        commandOverrides.clear()
        propIcons.keys.retainAll(model.elementById.keys)
        propIconResolvers.keys.retainAll(model.elementById.keys)
        groupSelections =
            model.groupMetadata.groupMemberItems
                .mapValues { (_, members) ->
                    members.filterTo(mutableSetOf()) {
                        model.elementById
                            .getValue(it)
                            .item.initialToggleState
                    }
                }.toMutableMap()

        // Commands sent against the previous menu must not touch the new one,
        // even those still waiting for an icon.
        updateQueue.clearPending()

        modelDirty = true
        resolvePropIcons()
        return true
    }

    /** Returns `true` when the value changed and the menu needs a rebuild. */
    internal fun setGroupDividerEnabled(enabled: Boolean): Boolean {
        if (groupDividerEnabled == enabled) {
            return false
        }
        groupDividerEnabled = enabled
        return true
    }

    // endregion

    // region State

    // Resolved icons of prop-declared items, and the stateful per-item
    // resolvers behind them; both pruned in [setMenu].
    private val propIcons = mutableMapOf<String, Drawable>()
    private val propIconResolvers = mutableMapOf<String, PropIconResolver>()

    // Accumulated imperative element updates, merged field-wise (newer
    // non-null wins). `checked` never reaches here — it travels on the update
    // envelope and group selections are its single home.
    private val commandOverrides = mutableMapOf<String, StackHeaderToolbarMenuElementOptions>()

    // Fully materialized selection per group. Initialized from
    // `initialToggleState` at [setMenu], mutated by taps and command `checked`.
    private var groupSelections = mutableMapOf<String, MutableSet<String>>()

    // endregion

    // region Imperative updates

    // Serial, batch-atomic command ingestion; owned here so a menu change can
    // drop stale batches locally (see setMenu).
    private val updateQueue =
        StackHeaderToolbarMenuUpdateQueue(iconResolver) { applyElementUpdates(it) }

    /**
     * Enqueues an `updateToolbarMenuElements` batch. Batches apply serially
     * and atomically, once every icon in the batch has resolved — see
     * [StackHeaderToolbarMenuUpdateQueue].
     */
    internal fun enqueueElementUpdates(batch: List<StackHeaderToolbarMenuElementRawUpdate>) {
        updateQueue.enqueue(batch)
    }

    /**
     * Applies a fully resolved `updateToolbarMenuElements` batch: records it,
     * runs checked-state transitions on the state, projects onto the live
     * toolbar when one is attached, and emits one coalesced selection event per
     * changed group — identically whether attached or not.
     */
    private fun applyElementUpdates(updates: List<StackHeaderToolbarMenuElementUpdate>) {
        val changedGroups = LinkedHashSet<String>()
        val toolbar = liveToolbar()

        for (update in updates) {
            val id = update.id
            if (id !in model.elementById) {
                Log.w(TAG, "[RNScreens] Ignoring toolbar menu update for unknown item id '$id'.")
                continue
            }

            if (!update.options.isEmpty) {
                commandOverrides[id] = commandOverrides[id]?.mergedWith(update.options) ?: update.options
            }

            update.checked?.let { checked ->
                applyCheckedInState(id, checked)?.let(changedGroups::add)
            }

            if (toolbar != null && !update.options.isEmpty) {
                StackHeaderToolbarMenuApplicator.updateToolbarMenuElement(
                    toolbar,
                    model.forwardIdMap,
                    id,
                    widenWithCoupledFields(id, update.options),
                )
            }
        }

        if (toolbar != null) {
            changedGroups.forEach { applySelectionToToolbar(toolbar, it) }
        }
        changedGroups.forEach(::emitGroupSelection)
    }

    // endregion

    // region Prop icons

    /**
     * Re-resolves every prop-declared icon source; called on a menu change —
     * the only time sources can change. Results flow through [setItemIcon]:
     * while the menu is dirty (until the next [attach]) they land in state
     * only, later async ones also apply to the live toolbar in place.
     */
    private fun resolvePropIcons() {
        model.elementById.forEach { (id, element) ->
            val source = element.item.iconSource
            // An escaping exception would leave the menu dirty forever, with
            // in-place application suspended until the next [attach].
            try {
                propIconResolvers
                    .getOrPut(id) {
                        PropIconResolver { name, uri, onComplete ->
                            iconResolver.resolve(
                                StackHeaderToolbarMenuItemIconSource(name, uri),
                                onComplete,
                            )
                        }
                    }.resolve(source.drawableIconResourceName, source.imageIconUri) { result ->
                        when (result) {
                            IconResolution.Unchanged -> Unit
                            is IconResolution.Resolved -> setItemIcon(id, result.drawable)
                        }
                    }
            } catch (e: Exception) {
                Log.e(TAG, "[RNScreens] Failed to resolve the icon of toolbar menu item '$id'.", e)
            }
        }
    }

    /**
     * Sets or clears the resolved icon of a prop-declared item, in place —
     * never rebuilds the menu and never touches command state. An icon set via
     * a view command takes precedence until the next real menu change.
     */
    private fun setItemIcon(
        id: String,
        icon: Drawable?,
    ) {
        if (id !in model.elementById) {
            return
        }
        val previous = if (icon != null) propIcons.put(id, icon) else propIcons.remove(id)
        if (previous === icon || commandOverrides[id]?.icon != null) {
            return
        }
        val toolbar = liveToolbar() ?: return
        val effective = effectiveOptions(id)
        StackHeaderToolbarMenuApplicator.updateToolbarMenuElement(
            toolbar,
            model.forwardIdMap,
            id,
            StackHeaderToolbarMenuElementOptions(
                // Action-item classification runs when showAsAction is set and
                // setting an icon alone does not re-run it, so it must
                // accompany the icon.
                showAsAction = effective.showAsAction,
                icon = effective.icon,
                iconTintColorNormal = effective.iconTintColorNormal,
                iconTintColorPressed = effective.iconTintColorPressed,
                iconTintColorFocused = effective.iconTintColorFocused,
                iconTintColorDisabled = effective.iconTintColorDisabled,
            ),
        )
    }

    // endregion

    // region Attachment & projection

    private var attachedToolbar: WeakReference<MaterialToolbar>? = null

    /**
     * Projects the menu (model ⊕ prop icons ⊕ command overrides ⊕ selections)
     * onto [toolbar] and starts applying subsequent updates to it in place.
     * Emits no events — the projection is semantically a no-change.
     */
    internal fun attach(toolbar: MaterialToolbar) {
        attachedToolbar = WeakReference(toolbar)
        modelDirty = false
        StackHeaderToolbarMenuApplicator.rebuildToolbarMenu(
            toolbar,
            model,
            groupDividerEnabled,
            optionsForItem = ::effectiveOptions,
            onItemClicked = ::handleItemClick,
        )
        model.groupMetadata.groupMemberItems.keys
            .forEach { applySelectionToToolbar(toolbar, it) }
    }

    internal fun detach() {
        attachedToolbar = null
    }

    internal fun tearDown() {
        updateQueue.tearDown()
        detach()
    }

    private fun liveToolbar(): MaterialToolbar? = if (modelDirty) null else attachedToolbar?.get()

    private fun applySelectionToToolbar(
        toolbar: MaterialToolbar,
        groupId: String,
    ) {
        val selected = groupSelections[groupId].orEmpty()

        // setChecked(false) on an item of an exclusive group checks it instead
        // of clearing it, so only the selected member is written and the native
        // sibling-uncheck does the rest. Such a group is never cleared.
        if (model.groupMetadata.groupSingleSelection[groupId] == true) {
            val selectedId = selected.singleOrNull() ?: return
            menuItemFor(toolbar, selectedId)?.isChecked = true
            return
        }

        for (memberId in model.groupMetadata.groupMemberItems[groupId].orEmpty()) {
            val item = menuItemFor(toolbar, memberId) ?: continue
            val shouldBeChecked = memberId in selected
            if (item.isChecked != shouldBeChecked) {
                item.isChecked = shouldBeChecked
            }
        }
    }

    private fun menuItemFor(
        toolbar: MaterialToolbar,
        id: String,
    ): MenuItem? = model.forwardIdMap[id]?.let { toolbar.menu.findItem(it) }

    // endregion

    // region Checked-state semantics

    /**
     * Mutates the selection of [itemId]'s group and returns the group id when
     * it actually changed. [explicitCheckedValue] `null` means a user toggle.
     */
    private fun applyCheckedInState(
        itemId: String,
        explicitCheckedValue: Boolean?,
    ): String? {
        val groupId = model.groupMetadata.itemGroupMap[itemId] ?: return null
        val singleSelection = model.groupMetadata.groupSingleSelection[groupId] ?: return null
        val selection = groupSelections.getOrPut(groupId) { mutableSetOf() }

        if (singleSelection) {
            if (explicitCheckedValue == false) {
                Log.w(
                    TAG,
                    "[RNScreens] Cannot uncheck item '$itemId' in single-selection group '$groupId'. " +
                        "Check a different item instead.",
                )
                return null
            }
            if (selection.singleOrNull() == itemId) {
                return null
            }
            selection.clear()
            selection.add(itemId)
            return groupId
        }

        val newChecked = explicitCheckedValue ?: (itemId !in selection)
        val changed = if (newChecked) selection.add(itemId) else selection.remove(itemId)
        return groupId.takeIf { changed }
    }

    private fun handleItemClick(id: String) {
        if (!isCheckable(id)) {
            delegate?.get()?.onMenuItemClicked(id)
            return
        }
        val changedGroup = applyCheckedInState(id, explicitCheckedValue = null) ?: return
        liveToolbar()?.let { applySelectionToToolbar(it, changedGroup) }
        emitGroupSelection(changedGroup)
    }

    private fun emitGroupSelection(groupId: String) {
        val selection = groupSelections[groupId].orEmpty()
        val selectedIds =
            model.groupMetadata.groupMemberItems[groupId]
                .orEmpty()
                .filter { it in selection }
        delegate?.get()?.onGroupSelectionChanged(groupId, selectedIds)
    }

    // Validation guarantees only plain menu items carry a groupId, so
    // checkability reduces to group membership.
    private fun isCheckable(id: String): Boolean = model.elementById[id]?.item?.groupId != null

    // endregion

    // region Effective values

    private fun effectiveOptions(id: String): StackHeaderToolbarMenuElementOptions {
        val base =
            model.elementById
                .getValue(id)
                .item
                .toOptions()
        val withPropIcon =
            propIcons[id]?.let { base.copy(icon = StackHeaderToolbarFieldUpdate.Set(it)) } ?: base
        return commandOverrides[id]?.let(withPropIcon::mergedWith) ?: withPropIcon
    }

    /**
     * The live item already reflects effective state, so applying the delta
     * keeps it there. Three fields need widening: tint colors resolve as one
     * complete ColorStateList, so touching any tint slot (or the icon, whose
     * application re-tints) requires all four; `showAsAction` must accompany a
     * new icon, because action-item classification runs when it is set and
     * setting an icon alone does not re-run it; and a submenu header set to
     * follow the title (`menuTitle: Reset`) must be re-resolved when the title
     * changes.
     */
    private fun widenWithCoupledFields(
        id: String,
        delta: StackHeaderToolbarMenuElementOptions,
    ): StackHeaderToolbarMenuElementOptions {
        var resolved = delta
        if (delta.icon != null || delta.requiresIconTintColorUpdate) {
            val effective = effectiveOptions(id)
            resolved =
                resolved.copy(
                    iconTintColorNormal = effective.iconTintColorNormal,
                    iconTintColorPressed = effective.iconTintColorPressed,
                    iconTintColorFocused = effective.iconTintColorFocused,
                    iconTintColorDisabled = effective.iconTintColorDisabled,
                )
            if (delta.icon != null) {
                resolved = resolved.copy(showAsAction = effective.showAsAction)
            }
        }
        if (delta.title != null &&
            delta.menuTitle == null &&
            model.elementById[id] is StackHeaderToolbarMenuElementConfig.Submenu &&
            commandOverrides[id]?.menuTitle == StackHeaderToolbarFieldUpdate.Reset
        ) {
            resolved = resolved.copy(menuTitle = StackHeaderToolbarFieldUpdate.Reset)
        }
        return resolved
    }

    // endregion

    companion object {
        private const val TAG = "StackHeaderToolbarMenuController"
    }
}
