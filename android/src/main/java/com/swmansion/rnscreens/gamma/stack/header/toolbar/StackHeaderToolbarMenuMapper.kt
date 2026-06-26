package com.swmansion.rnscreens.gamma.stack.header.toolbar

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.swmansion.rnscreens.gamma.helpers.parseColor
import com.swmansion.rnscreens.gamma.helpers.readBoolean
import com.swmansion.rnscreens.gamma.helpers.readColor
import com.swmansion.rnscreens.gamma.helpers.readImageUri
import com.swmansion.rnscreens.gamma.helpers.readOptionalString
import com.swmansion.rnscreens.gamma.helpers.readString
import com.swmansion.rnscreens.gamma.helpers.requireNotNullString

internal object StackHeaderToolbarMenuMapper {
    // region Menu prop parsing

    fun parseMenu(value: Dynamic): StackHeaderToolbarMenuConfig {
        if (value.isNull) return StackHeaderToolbarMenuConfig(emptyList(), emptyList())
        val map =
            value.asMapOrNull()
                ?: throw JSApplicationIllegalArgumentException(
                    "[RNScreens] toolbarMenu must be an object.",
                )
        return StackHeaderToolbarMenuConfig(parseGroups(map), parseChildren(map))
    }

    fun collectIconSources(value: Dynamic): Map<String, StackHeaderToolbarMenuItemIconSource> {
        val map = value.asMapOrNull() ?: return emptyMap()
        val result = mutableMapOf<String, StackHeaderToolbarMenuItemIconSource>()
        collectIconSourcesFromChildren(map, result)
        return result
    }

    // endregion

    // region Menu item command parsing

    fun parseMenuItemOptions(map: ReadableMap): StackHeaderToolbarMenuItemOptions =
        StackHeaderToolbarMenuItemOptions(
            title = map.readNullableStringUpdate("title", StackHeaderToolbarMenuItemDefaults.TITLE),
            hidden = map.readNullableBooleanUpdate("hidden", StackHeaderToolbarMenuItemDefaults.HIDDEN),
            showAsAction =
                map.readNullableShowAsActionEnumUpdate(
                    "showAsAction",
                    StackHeaderToolbarMenuItemDefaults.SHOW_AS_ACTION,
                ),
            icon = null,
            iconTintColorNormal = map.readNullableColorUpdate("iconTintColorNormal"),
            iconTintColorPressed = map.readNullableColorUpdate("iconTintColorPressed"),
            iconTintColorFocused = map.readNullableColorUpdate("iconTintColorFocused"),
            iconTintColorDisabled = map.readNullableColorUpdate("iconTintColorDisabled"),
            checked =
                map.readNullableBooleanUpdate(
                    "checked",
                    StackHeaderToolbarMenuItemDefaults.INITIAL_TOGGLE_STATE,
                ),
        )

    fun parseMenuItemIconSource(map: ReadableMap): StackHeaderToolbarMenuItemIconSource? {
        if (!map.hasKey("drawableIconResourceName") && !map.hasKey("imageIconResource")) {
            return null
        }
        return StackHeaderToolbarMenuItemIconSource(
            drawableIconResourceName = map.getString("drawableIconResourceName"),
            imageIconUri = map.readImageUri("imageIconResource", null),
        )
    }

    // endregion

    // region Menu tree parsing

    private fun parseGroups(map: ReadableMap): List<StackHeaderToolbarMenuGroupConfig> {
        val array = map.getArray("groups") ?: return emptyList()
        return (0 until array.size()).map { i ->
            val group =
                requireNotNull(array.getMap(i)) {
                    "[RNScreens] Menu groups array must contain objects."
                }
            StackHeaderToolbarMenuGroupConfig(
                groupId = group.requireNotNullString("groupId"),
                singleSelection =
                    group.readBoolean(
                        "singleSelection",
                        StackHeaderToolbarMenuItemDefaults.SINGLE_SELECTION,
                    ),
            )
        }
    }

    private fun parseChildren(map: ReadableMap): List<StackHeaderToolbarMenuElementConfig> {
        val array = map.getArray("children") ?: return emptyList()
        return (0 until array.size()).map { i ->
            val child =
                requireNotNull(array.getMap(i)) {
                    "[RNScreens] Menu children array must contain objects."
                }
            parseElement(child)
        }
    }

    private fun parseElement(map: ReadableMap): StackHeaderToolbarMenuElementConfig =
        when (val type = map.readOptionalString("type")) {
            "menuItem" -> StackHeaderToolbarMenuElementConfig.MenuItem(item = parseItemConfig(map))
            "menu" ->
                StackHeaderToolbarMenuElementConfig.Submenu(
                    item = parseItemConfig(map),
                    menu = StackHeaderToolbarMenuConfig(parseGroups(map), parseChildren(map)),
                )
            else ->
                throw JSApplicationIllegalArgumentException(
                    "[RNScreens] Unknown toolbar menu element type: $type.",
                )
        }

    private fun parseItemConfig(map: ReadableMap): StackHeaderToolbarMenuItemConfig =
        StackHeaderToolbarMenuItemConfig(
            id = map.requireNotNullString("id"),
            title = map.readString("title", StackHeaderToolbarMenuItemDefaults.TITLE),
            hidden = map.readBoolean("hidden", StackHeaderToolbarMenuItemDefaults.HIDDEN),
            showAsAction = map.readShowAsActionEnum("showAsAction", StackHeaderToolbarMenuItemDefaults.SHOW_AS_ACTION),
            icon = null,
            iconTintColorNormal = map.readColor("iconTintColorNormal", StackHeaderToolbarMenuItemDefaults.ICON_TINT_COLOR_NORMAL),
            iconTintColorPressed = map.readColor("iconTintColorPressed", StackHeaderToolbarMenuItemDefaults.ICON_TINT_COLOR_PRESSED),
            iconTintColorFocused = map.readColor("iconTintColorFocused", StackHeaderToolbarMenuItemDefaults.ICON_TINT_COLOR_FOCUSED),
            iconTintColorDisabled = map.readColor("iconTintColorDisabled", StackHeaderToolbarMenuItemDefaults.ICON_TINT_COLOR_DISABLED),
            groupId = map.readOptionalString("groupId"),
            itemType = map.readItemTypeEnum("itemType", StackHeaderToolbarMenuItemDefaults.ITEM_TYPE),
            initialToggleState = map.readBoolean("initialToggleState", StackHeaderToolbarMenuItemDefaults.INITIAL_TOGGLE_STATE),
        )

    // endregion

    // region Icon source collection

    private fun collectIconSourcesFromChildren(
        map: ReadableMap,
        result: MutableMap<String, StackHeaderToolbarMenuItemIconSource>,
    ) {
        val array = map.getArray("children") ?: return
        for (i in 0 until array.size()) {
            val child = array.getMap(i) ?: continue
            val type = child.readOptionalString("type") ?: continue
            val id = child.getString("id") ?: continue

            result[id] =
                StackHeaderToolbarMenuItemIconSource(
                    drawableIconResourceName =
                        child.getString("drawableIconResourceName")
                            ?: StackHeaderToolbarMenuItemDefaults.DRAWABLE_ICON_RESOURCE_NAME,
                    imageIconUri =
                        child.readImageUri("imageIconResource", StackHeaderToolbarMenuItemDefaults.IMAGE_ICON_URI),
                )

            if (type == "menu") {
                collectIconSourcesFromChildren(child, result)
            }
        }
    }

    // endregion

    // region Enum helpers

    private fun ReadableMap.readShowAsActionEnum(
        key: String,
        default: StackHeaderToolbarMenuItemShowAsAction,
    ): StackHeaderToolbarMenuItemShowAsAction {
        val stringValue = this.getString(key) ?: return default
        return toShowAsActionEnum(stringValue)
    }

    private fun toShowAsActionEnum(value: String): StackHeaderToolbarMenuItemShowAsAction =
        when (value) {
            "always" -> StackHeaderToolbarMenuItemShowAsAction.ALWAYS
            "alwaysWithText" -> StackHeaderToolbarMenuItemShowAsAction.ALWAYS_WITH_TEXT
            "ifRoom" -> StackHeaderToolbarMenuItemShowAsAction.IF_ROOM
            "ifRoomWithText" -> StackHeaderToolbarMenuItemShowAsAction.IF_ROOM_WITH_TEXT
            "never" -> StackHeaderToolbarMenuItemShowAsAction.NEVER
            else ->
                throw JSApplicationIllegalArgumentException(
                    "[RNScreens] Invalid value for StackHeaderToolbarMenuItemShowAsAction: $value.",
                )
        }

    private fun ReadableMap.readItemTypeEnum(
        key: String,
        default: StackHeaderToolbarMenuItemType,
    ): StackHeaderToolbarMenuItemType {
        val stringValue = this.getString(key) ?: return default
        return toItemTypeEnum(stringValue)
    }

    private fun toItemTypeEnum(value: String): StackHeaderToolbarMenuItemType =
        when (value) {
            "action" -> StackHeaderToolbarMenuItemType.ACTION
            "toggle" -> StackHeaderToolbarMenuItemType.TOGGLE
            "automatic" -> StackHeaderToolbarMenuItemType.AUTOMATIC
            else ->
                throw JSApplicationIllegalArgumentException(
                    "[RNScreens] Invalid value for StackHeaderToolbarMenuItemType: $value.",
                )
        }

    // endregion

    // region Update helpers (3-state semantics for view commands)

    // Each key has three states:
    // - not defined -> null         (no change)
    // - null        -> default      (reset to default)
    // - value       -> value
    //
    // A plain `T?` return can encode this only when the field's default is non-null,
    // so `null` unambiguously means "no change". Fields whose default is null (the
    // tint colors) must return `StackHeaderToolbarUpdate<T>?` instead, to tell "no
    // change" (null) apart from "reset" (Reset).
    private fun ReadableMap.readNullableStringUpdate(
        key: String,
        default: String,
    ): String? =
        when {
            !this.hasKey(key) -> null
            this.isNull(key) -> default
            else -> this.getString(key) ?: default
        }

    private fun ReadableMap.readNullableBooleanUpdate(
        key: String,
        default: Boolean,
    ): Boolean? =
        when {
            !this.hasKey(key) -> null
            this.isNull(key) -> default
            else -> this.getBoolean(key)
        }

    private fun ReadableMap.readNullableShowAsActionEnumUpdate(
        key: String,
        default: StackHeaderToolbarMenuItemShowAsAction,
    ): StackHeaderToolbarMenuItemShowAsAction? =
        when {
            !this.hasKey(key) -> null
            this.isNull(key) -> default
            else ->
                this.getString(key)?.let {
                    toShowAsActionEnum(it)
                } ?: default
        }

    private fun ReadableMap.readNullableColorUpdate(key: String): StackHeaderToolbarUpdate<Int>? =
        when {
            !this.hasKey(key) -> null
            this.isNull(key) -> StackHeaderToolbarUpdate.Reset
            else -> StackHeaderToolbarUpdate.from(parseColor(key))
        }

    // endregion
}

private fun Dynamic.asMapOrNull(): ReadableMap? = if (!isNull && type == ReadableType.Map) asMap() else null
