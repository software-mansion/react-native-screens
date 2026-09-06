package com.swmansion.rnscreens.stack.header.toolbar.model

/**
 * Immutable snapshot of a parsed toolbar menu: the config tree plus every
 * derived index the runtime needs. Built and validated in one step by [from],
 * so a successfully constructed model is always internally consistent.
 */
internal class StackHeaderToolbarMenuModel private constructor(
    val config: StackHeaderToolbarMenuConfig,
    val elementById: Map<String, StackHeaderToolbarMenuElementConfig>,
    // Element string id <-> int id expected by Android menus.
    val forwardIdMap: Map<String, Int>,
    val reverseIdMap: Map<Int, String>,
    val forwardGroupIdMap: Map<String, Int>,
    val groupMetadata: StackHeaderToolbarMenuGroupMetadata,
) {
    companion object {
        val EMPTY = from(StackHeaderToolbarMenuConfig(emptyList(), emptyList()))

        /** Derives all indices and validates [config]; throws on an invalid menu. */
        fun from(config: StackHeaderToolbarMenuConfig): StackHeaderToolbarMenuModel {
            val forwardIdMap = mutableMapOf<String, Int>()
            val reverseIdMap = mutableMapOf<Int, String>()
            var elementCounter = 1
            assignElementIds(config.children, forwardIdMap, reverseIdMap) { elementCounter++ }

            val forwardGroupIdMap = mutableMapOf<String, Int>()
            var groupCounter = 1
            assignGroupIds(config, forwardGroupIdMap) { groupCounter++ }

            val itemGroupMap = mutableMapOf<String, String>()
            val groupSingleSelection = mutableMapOf<String, Boolean>()
            val groupMemberItems = mutableMapOf<String, MutableList<String>>()
            collectGroupMetadata(config, itemGroupMap, groupSingleSelection, groupMemberItems)

            validateRadioInitialSelection(config)
            validateItemTypes(config)

            val elementById = mutableMapOf<String, StackHeaderToolbarMenuElementConfig>()
            collectElements(config, elementById)

            return StackHeaderToolbarMenuModel(
                config = config,
                elementById = elementById.toMap(),
                forwardIdMap = forwardIdMap.toMap(),
                reverseIdMap = reverseIdMap.toMap(),
                forwardGroupIdMap = forwardGroupIdMap.toMap(),
                groupMetadata =
                    StackHeaderToolbarMenuGroupMetadata(
                        itemGroupMap.toMap(),
                        groupSingleSelection.toMap(),
                        groupMemberItems.mapValues { it.value.toList() },
                    ),
            )
        }
    }
}

private fun assignElementIds(
    elements: List<StackHeaderToolbarMenuElementConfig>,
    forwardIdMap: MutableMap<String, Int>,
    reverseIdMap: MutableMap<Int, String>,
    nextId: () -> Int,
) {
    for (element in elements) {
        require(element.item.id !in forwardIdMap) {
            "[RNScreens] Duplicate toolbar menu item id: '${element.item.id}'. Item IDs must be unique across the entire menu."
        }
        val nativeId = nextId()
        forwardIdMap[element.item.id] = nativeId
        reverseIdMap[nativeId] = element.item.id
        if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
            assignElementIds(element.menu.children, forwardIdMap, reverseIdMap, nextId)
        }
    }
}

private fun assignGroupIds(
    menuConfig: StackHeaderToolbarMenuConfig,
    forwardMap: MutableMap<String, Int>,
    nextId: () -> Int,
) {
    for (group in menuConfig.groups) {
        require(group.groupId !in forwardMap) {
            "[RNScreens] Duplicate toolbar menu group id: '${group.groupId}'. Group IDs must be unique across the entire menu."
        }
        forwardMap[group.groupId] = nextId()
    }
    for (element in menuConfig.children) {
        if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
            assignGroupIds(element.menu, forwardMap, nextId)
        }
    }
}

private fun collectGroupMetadata(
    config: StackHeaderToolbarMenuConfig,
    itemGroupMap: MutableMap<String, String>,
    groupSingleSelection: MutableMap<String, Boolean>,
    groupMemberItems: MutableMap<String, MutableList<String>>,
) {
    val localGroupIds = config.groups.map { it.groupId }.toSet()
    for (group in config.groups) {
        groupSingleSelection[group.groupId] = group.singleSelection
        groupMemberItems.getOrPut(group.groupId) { mutableListOf() }
    }
    for (element in config.children) {
        element.item.groupId?.let { gid ->
            require(element is StackHeaderToolbarMenuElementConfig.MenuItem) {
                "[RNScreens] Submenu '${element.item.id}' cannot belong to a group. " +
                    "Only elements of type 'menuItem' can have a groupId."
            }
            require(gid in localGroupIds) {
                "[RNScreens] Menu item '${element.item.id}' references group '$gid' " +
                    "which is not defined at the same menu level. " +
                    "Groups cannot span submenus."
            }
            itemGroupMap[element.item.id] = gid
            groupMemberItems[gid]!!.add(element.item.id)
        }
        if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
            collectGroupMetadata(element.menu, itemGroupMap, groupSingleSelection, groupMemberItems)
        }
    }
}

private fun validateRadioInitialSelection(menuConfig: StackHeaderToolbarMenuConfig) {
    for (group in menuConfig.groups) {
        if (!group.singleSelection) continue
        var count = 0
        for (element in menuConfig.children) {
            if (element.item.groupId == group.groupId && element.item.initialToggleState) {
                count++
            }
        }
        require(count <= 1) {
            "[RNScreens] Radio group '${group.groupId}' has $count items with " +
                "initialToggleState=true. At most 1 is allowed for single-selection groups."
        }
    }
    for (element in menuConfig.children) {
        if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
            validateRadioInitialSelection(element.menu)
        }
    }
}

private fun validateItemTypes(menuConfig: StackHeaderToolbarMenuConfig) {
    for (element in menuConfig.children) {
        val item = element.item
        when (item.itemType) {
            StackHeaderToolbarMenuItemType.TOGGLE ->
                require(item.groupId != null) {
                    "[RNScreens] Menu item '${item.id}' has itemType=TOGGLE but no groupId. " +
                        "Toggle items must belong to a group."
                }
            StackHeaderToolbarMenuItemType.ACTION ->
                require(item.groupId == null) {
                    "[RNScreens] Menu item '${item.id}' has itemType=ACTION " +
                        "and belongs to a group. Action items cannot belong to groups."
                }
            StackHeaderToolbarMenuItemType.AUTOMATIC -> Unit
        }
        if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
            validateItemTypes(element.menu)
        }
    }
}

private fun collectElements(
    config: StackHeaderToolbarMenuConfig,
    elements: MutableMap<String, StackHeaderToolbarMenuElementConfig>,
) {
    for (element in config.children) {
        elements[element.item.id] = element
        if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
            collectElements(element.menu, elements)
        }
    }
}
