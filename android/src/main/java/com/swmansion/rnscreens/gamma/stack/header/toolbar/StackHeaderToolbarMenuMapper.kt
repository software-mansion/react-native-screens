package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.content.Context
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.swmansion.rnscreens.gamma.helpers.parseColor
import com.swmansion.rnscreens.gamma.helpers.readBoolean
import com.swmansion.rnscreens.gamma.helpers.readColor
import com.swmansion.rnscreens.gamma.helpers.readImageUri
import com.swmansion.rnscreens.gamma.helpers.readOptionalString
import com.swmansion.rnscreens.gamma.helpers.requireNotNullString

internal object StackHeaderToolbarMenuMapper {
    // region Menu prop parsing

    fun parseMenu(
        context: Context,
        value: Dynamic,
    ): Pair<StackHeaderToolbarMenuConfig, Map<String, StackHeaderToolbarMenuItemIconSource>> {
        if (value.isNull) return Pair(StackHeaderToolbarMenuConfig(emptyList(), emptyList()), emptyMap())
        val map =
            value.asMapOrNull()
                ?: throw JSApplicationIllegalArgumentException(
                    "[RNScreens] toolbarMenu must be an object.",
                )
        val iconSources = mutableMapOf<String, StackHeaderToolbarMenuItemIconSource>()
        val config = StackHeaderToolbarMenuConfig(parseGroups(map), parseChildren(context, map, iconSources))
        return Pair(config, iconSources)
    }

    // endregion

    // region Menu element command parsing

    fun parseMenuElementOptions(
        context: Context,
        map: ReadableMap,
    ): StackHeaderToolbarMenuElementOptions =
        StackHeaderToolbarMenuElementOptions(
            title = map.readNullableStringUpdate("title"),
            titleCondensed = map.readNullableStringUpdate("titleCondensed"),
            tooltipText = map.readNullableStringUpdate("tooltipText"),
            hidden = map.readNullableBooleanUpdate("hidden", StackHeaderToolbarMenuItemDefaults.HIDDEN),
            disabled = map.readNullableBooleanUpdate("disabled", StackHeaderToolbarMenuItemDefaults.DISABLED),
            showAsAction =
                map.readNullableShowAsActionEnumUpdate(
                    "showAsAction",
                    StackHeaderToolbarMenuItemDefaults.SHOW_AS_ACTION,
                ),
            icon = null,
            iconTintColorNormal = map.readNullableColorUpdate(context, "iconTintColorNormal"),
            iconTintColorPressed = map.readNullableColorUpdate(context, "iconTintColorPressed"),
            iconTintColorFocused = map.readNullableColorUpdate(context, "iconTintColorFocused"),
            iconTintColorDisabled = map.readNullableColorUpdate(context, "iconTintColorDisabled"),
            checked =
                map.readNullableBooleanUpdate(
                    "checked",
                    StackHeaderToolbarMenuItemDefaults.INITIAL_TOGGLE_STATE,
                ),
            menuTitle = map.readNullableStringUpdate("menuTitle"),
        )

    fun parseMenuElementIconSource(map: ReadableMap): StackHeaderToolbarMenuItemIconSource? {
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
                    "[RNScreens] Menu groups array must contain valid group specification objects."
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

    private fun parseChildren(
        context: Context,
        map: ReadableMap,
        iconSources: MutableMap<String, StackHeaderToolbarMenuItemIconSource>,
    ): List<StackHeaderToolbarMenuElementConfig> {
        val array = map.getArray("children") ?: return emptyList()
        return (0 until array.size()).map { i ->
            val child =
                requireNotNull(array.getMap(i)) {
                    "[RNScreens] Menu children array must contain valid menu element specification objects."
                }
            parseElement(context, child, iconSources)
        }
    }

    private fun parseElement(
        context: Context,
        map: ReadableMap,
        iconSources: MutableMap<String, StackHeaderToolbarMenuItemIconSource>,
    ): StackHeaderToolbarMenuElementConfig {
        val item = parseItemConfig(context, map)
        iconSources[item.id] = parseItemIconSource(map)
        return when (val type = map.readOptionalString("type")) {
            "menuItem" -> StackHeaderToolbarMenuElementConfig.MenuItem(item = item)
            "menu" ->
                StackHeaderToolbarMenuElementConfig.Submenu(
                    item = item,
                    menu = StackHeaderToolbarMenuConfig(parseGroups(map), parseChildren(context, map, iconSources)),
                    menuTitle = map.readOptionalString("menuTitle"),
                )

            else ->
                throw JSApplicationIllegalArgumentException(
                    "[RNScreens] Unknown toolbar menu element type: $type.",
                )
        }
    }

    private fun parseItemIconSource(map: ReadableMap): StackHeaderToolbarMenuItemIconSource =
        StackHeaderToolbarMenuItemIconSource(
            drawableIconResourceName =
                map.getString("drawableIconResourceName")
                    ?: StackHeaderToolbarMenuItemDefaults.DRAWABLE_ICON_RESOURCE_NAME,
            imageIconUri =
                map.readImageUri("imageIconResource", StackHeaderToolbarMenuItemDefaults.IMAGE_ICON_URI),
        )

    private fun parseItemConfig(
        context: Context,
        map: ReadableMap,
    ): StackHeaderToolbarMenuItemConfig =
        StackHeaderToolbarMenuItemConfig(
            id = map.requireNotNullString("id"),
            title = map.readOptionalString("title") ?: StackHeaderToolbarMenuItemDefaults.TITLE,
            titleCondensed =
                map.readOptionalString("titleCondensed") ?: StackHeaderToolbarMenuItemDefaults.TITLE_CONDENSED,
            tooltipText =
                map.readOptionalString("tooltipText") ?: StackHeaderToolbarMenuItemDefaults.TOOLTIP_TEXT,
            hidden = map.readBoolean("hidden", StackHeaderToolbarMenuItemDefaults.HIDDEN),
            disabled = map.readBoolean("disabled", StackHeaderToolbarMenuItemDefaults.DISABLED),
            showAsAction = map.readShowAsActionEnum("showAsAction", StackHeaderToolbarMenuItemDefaults.SHOW_AS_ACTION),
            icon = null,
            iconTintColorNormal =
                map.readColor(
                    context,
                    "iconTintColorNormal",
                    StackHeaderToolbarMenuItemDefaults.ICON_TINT_COLOR_NORMAL,
                ),
            iconTintColorPressed =
                map.readColor(
                    context,
                    "iconTintColorPressed",
                    StackHeaderToolbarMenuItemDefaults.ICON_TINT_COLOR_PRESSED,
                ),
            iconTintColorFocused =
                map.readColor(
                    context,
                    "iconTintColorFocused",
                    StackHeaderToolbarMenuItemDefaults.ICON_TINT_COLOR_FOCUSED,
                ),
            iconTintColorDisabled =
                map.readColor(
                    context,
                    "iconTintColorDisabled",
                    StackHeaderToolbarMenuItemDefaults.ICON_TINT_COLOR_DISABLED,
                ),
            groupId = map.readOptionalString("groupId"),
            itemType = map.readItemTypeEnum("itemType", StackHeaderToolbarMenuItemDefaults.ITEM_TYPE),
            initialToggleState =
                map.readBoolean(
                    "initialToggleState",
                    StackHeaderToolbarMenuItemDefaults.INITIAL_TOGGLE_STATE,
                ),
        )

    // endregion

    // region Enum helpers

    private fun ReadableMap.readShowAsActionEnum(
        key: String,
        default: StackHeaderToolbarMenuItemShowAsAction,
    ): StackHeaderToolbarMenuItemShowAsAction {
        val stringValue = readOptionalString(key) ?: return default
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
        val stringValue = readOptionalString(key) ?: return default
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
    // string fields and tint colors) must return `StackHeaderToolbarUpdate<T>?`
    // instead, to tell "no change" (null) apart from "reset" (Reset).
    private fun ReadableMap.readNullableStringUpdate(key: String): StackHeaderToolbarUpdate<String>? =
        when {
            !this.hasKey(key) -> null
            this.isNull(key) -> StackHeaderToolbarUpdate.Reset
            else -> StackHeaderToolbarUpdate.from(this.getString(key))
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

    private fun ReadableMap.readNullableColorUpdate(
        context: Context,
        key: String,
    ): StackHeaderToolbarUpdate<Int>? =
        when {
            !this.hasKey(key) -> null
            this.isNull(key) -> StackHeaderToolbarUpdate.Reset
            else -> StackHeaderToolbarUpdate.from(parseColor(context, key))
        }

    // endregion
}

private fun Dynamic.asMapOrNull(): ReadableMap? = if (!isNull && type == ReadableType.Map) asMap() else null
