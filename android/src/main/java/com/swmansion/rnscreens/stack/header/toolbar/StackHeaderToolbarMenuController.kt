package com.swmansion.rnscreens.stack.header.toolbar

import android.graphics.drawable.Drawable
import android.util.Log
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuConfig
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuElementConfig
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuGroupMetadata
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuItemIconSource
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarFieldUpdate
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuElementOptions
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuElementUpdate
import com.swmansion.rnscreens.stack.header.toolbar.update.toOptions
import java.lang.ref.WeakReference

/**
 * Owns the toolbar menu: the parsed configuration and the runtime state
 * accumulated on top of it (imperative element updates, group selections,
 * resolved prop icons). The state is the source of truth and lives as long as
 * this controller; an attached toolbar is merely a projection of it, rebuilt
 * from scratch at every [attach]. Checked-state semantics run on the state, so
 * updates behave identically whether a toolbar is attached or not.
 */
internal class StackHeaderToolbarMenuController {
    internal var delegate: WeakReference<StackHeaderToolbarMenuDelegate>? = null

    // region Model

    private var menuConfig = StackHeaderToolbarMenuConfig(emptyList(), emptyList())
    private var iconSources: Map<String, StackHeaderToolbarMenuItemIconSource> = emptyMap()
    private var groupDividerEnabled = false

    private var forwardIdMap: Map<String, Int> = emptyMap()
    private var reverseIdMap: Map<Int, String> = emptyMap()
    private var forwardGroupIdMap: Map<String, Int> = emptyMap()
    private var groupMetadata = StackHeaderToolbarMenuGroupMetadata.EMPTY
    private var elementById: Map<String, StackHeaderToolbarMenuElementConfig> = emptyMap()

    // Set by a menu change and cleared by [attach]: until then a live toolbar
    // still shows the previous menu (with previous int ids), so in-place
    // application is suspended and updates are recorded only.
    private var modelDirty = false

    /**
     * Replaces the menu configuration. Returns `true` when it actually changed;
     * equality covers the icon sources too, so an icon-only prop change counts.
     * A real change validates the new menu, resets all runtime state and
     * re-initializes group selections from `initialToggleState`. Application to
     * the toolbar is the caller's responsibility (via [attach]).
     */
    internal fun setMenu(
        menu: StackHeaderToolbarMenuConfig,
        iconSources: Map<String, StackHeaderToolbarMenuItemIconSource>,
    ): Boolean {
        if (menu == menuConfig && iconSources == this.iconSources) {
            return false
        }

        // Maps and validation both throw on an invalid menu; run them before
        // any mutation so the previous, valid model stays intact.
        val (forwardMap, reverseMap) = StackHeaderToolbarMenuApplicator.generateToolbarMenuItemMappings(menu)
        val groupMap = StackHeaderToolbarMenuApplicator.generateToolbarMenuGroupMappings(menu)
        val metadata = StackHeaderToolbarMenuApplicator.computeGroupMetadata(menu)
        StackHeaderToolbarMenuApplicator.validate(menu)

        menuConfig = menu
        this.iconSources = iconSources
        forwardIdMap = forwardMap
        reverseIdMap = reverseMap
        forwardGroupIdMap = groupMap
        groupMetadata = metadata
        elementById = collectElementsById(menu)

        commandOverlay.clear()
        propIcons.keys.retainAll(forwardMap.keys)
        groupSelections =
            groupMetadata.groupMemberItems
                .mapValues { (_, members) ->
                    members.filterTo(mutableSetOf()) { isCheckable(it) && elementById.getValue(it).item.initialToggleState }
                }.toMutableMap()

        modelDirty = true
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

    // Resolved icons of prop-declared items, fed asynchronously by the owner.
    private val propIcons = mutableMapOf<String, Drawable>()

    // Accumulated imperative element updates, merged field-wise (newer non-null
    // wins). `checked` is never stored here — group selections are its single
    // home.
    private val commandOverlay = mutableMapOf<String, StackHeaderToolbarMenuElementOptions>()

    // Fully materialized selection per group. Initialized from
    // `initialToggleState` at [setMenu], mutated by taps and command `checked`.
    private var groupSelections = mutableMapOf<String, MutableSet<String>>()

    // endregion

    // region Imperative updates

    /**
     * Applies a fully resolved `updateToolbarMenuElements` batch: records it,
     * runs checked-state transitions on the state, projects onto the live
     * toolbar when one is attached, and emits one coalesced selection event per
     * changed group — identically whether attached or not.
     */
    internal fun applyElementUpdates(updates: List<StackHeaderToolbarMenuElementUpdate>) {
        val changedGroups = LinkedHashSet<String>()
        val toolbar = liveToolbar()

        for ((id, options) in updates) {
            if (id !in forwardIdMap) {
                Log.w(TAG, "[RNScreens] Ignoring toolbar menu update for unknown item id '$id'.")
                continue
            }

            val recorded = options.copy(checked = null)
            if (!recorded.isEmpty) {
                commandOverlay.merge(id, recorded) { older, newer -> older.mergedWith(newer) }
            }

            options.checked?.let { checked ->
                applyCheckedInState(id, checked)?.let(changedGroups::add)
            }

            if (toolbar != null && !recorded.isEmpty) {
                StackHeaderToolbarMenuApplicator.updateToolbarMenuElement(
                    toolbar,
                    forwardIdMap,
                    id,
                    resolveForLiveApplication(id, recorded),
                )
            }
        }

        if (toolbar != null) {
            changedGroups.forEach { applySelectionToToolbar(toolbar, it) }
        }
        changedGroups.forEach(::emitGroupSelection)
    }

    /**
     * Sets or clears the resolved icon of a prop-declared item, in place —
     * never rebuilds the menu and never touches command state. An icon set via
     * a view command takes precedence until the next real menu change.
     */
    internal fun setItemIcon(
        id: String,
        icon: Drawable?,
    ) {
        if (id !in forwardIdMap) {
            return
        }
        val previous = if (icon != null) propIcons.put(id, icon) else propIcons.remove(id)
        if (previous === icon || commandOverlay[id]?.icon != null) {
            return
        }
        val toolbar = liveToolbar() ?: return
        val effective = effectiveOptions(id)
        StackHeaderToolbarMenuApplicator.updateToolbarMenuElement(
            toolbar,
            forwardIdMap,
            id,
            StackHeaderToolbarMenuElementOptions(
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
     * Projects the menu (config ⊕ prop icons ⊕ command overlay ⊕ selections)
     * onto [toolbar] and starts applying subsequent updates to it in place.
     * Emits no events — the projection is semantically a no-change.
     */
    internal fun attach(toolbar: MaterialToolbar) {
        attachedToolbar = WeakReference(toolbar)
        modelDirty = false
        StackHeaderToolbarMenuApplicator.rebuildToolbarMenu(
            toolbar,
            menuConfig,
            forwardIdMap,
            reverseIdMap,
            forwardGroupIdMap,
            groupDividerEnabled,
            optionsForItem = ::effectiveOptions,
            onItemClicked = ::handleItemClick,
        )
        groupMetadata.groupMemberItems.keys.forEach { applySelectionToToolbar(toolbar, it) }
    }

    internal fun detach() {
        attachedToolbar = null
    }

    private fun liveToolbar(): MaterialToolbar? = if (modelDirty) null else attachedToolbar?.get()

    private fun applySelectionToToolbar(
        toolbar: MaterialToolbar,
        groupId: String,
    ) {
        val selected = groupSelections[groupId].orEmpty()
        for (memberId in groupMetadata.groupMemberItems[groupId].orEmpty()) {
            val item = forwardIdMap[memberId]?.let { toolbar.menu.findItem(it) } ?: continue
            val shouldBeChecked = memberId in selected
            if (item.isChecked != shouldBeChecked) {
                // For a single-selection group setChecked(true) also fires the
                // native sibling-uncheck; later iterations then find the target
                // state already applied and no-op.
                item.isChecked = shouldBeChecked
            }
        }
    }

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
        val groupId = groupMetadata.itemGroupMap[itemId] ?: return null
        val singleSelection = groupMetadata.groupSingleSelection[groupId] ?: return null
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
        val selectedIds = groupMetadata.groupMemberItems[groupId].orEmpty().filter { it in selection }
        delegate?.get()?.onGroupSelectionChanged(groupId, selectedIds)
    }

    // A grouped submenu item is a group member but is never rendered checkable
    // (matching the menu build), so taps on it emit a press instead of toggling.
    private fun isCheckable(id: String): Boolean {
        val element = elementById[id] ?: return false
        return element is StackHeaderToolbarMenuElementConfig.MenuItem && element.item.groupId != null
    }

    // endregion

    // region Effective values

    private fun effectiveOptions(id: String): StackHeaderToolbarMenuElementOptions {
        val base = elementById.getValue(id).item.toOptions()
        val withPropIcon =
            propIcons[id]?.let { base.copy(icon = StackHeaderToolbarFieldUpdate.Set(it)) } ?: base
        return commandOverlay[id]?.let(withPropIcon::mergedWith) ?: withPropIcon
    }

    /**
     * The live item already reflects effective state, so applying the delta
     * keeps it there. Two fields need widening: tint colors resolve as one
     * complete ColorStateList, so touching any tint slot (or the icon, whose
     * application re-tints) requires all four; and a submenu header set to
     * follow the title (`menuTitle: Reset`) must be re-resolved when the title
     * changes.
     */
    private fun resolveForLiveApplication(
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
        }
        if (delta.title != null &&
            delta.menuTitle == null &&
            elementById[id] is StackHeaderToolbarMenuElementConfig.Submenu &&
            commandOverlay[id]?.menuTitle == StackHeaderToolbarFieldUpdate.Reset
        ) {
            resolved = resolved.copy(menuTitle = StackHeaderToolbarFieldUpdate.Reset)
        }
        return resolved
    }

    // endregion

    private fun collectElementsById(menu: StackHeaderToolbarMenuConfig): Map<String, StackHeaderToolbarMenuElementConfig> {
        val elements = mutableMapOf<String, StackHeaderToolbarMenuElementConfig>()

        fun visit(config: StackHeaderToolbarMenuConfig) {
            for (element in config.children) {
                elements[element.item.id] = element
                if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
                    visit(element.menu)
                }
            }
        }
        visit(menu)
        return elements
    }

    companion object {
        private const val TAG = "StackHeaderToolbarMenuController"
    }
}
