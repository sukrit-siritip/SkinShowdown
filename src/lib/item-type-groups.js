export const TYPE_GROUPS = {
  weapon: [
    "compact_ammo",
    "medium_ammo",
    "long_ammo",
    "special_long_ammo",
    "special_ammo",
    "shells",
    "melee",
  ],
  hunter: ["hunter"],
  charm: ["charm"],
  utility: [
    "tool_distraction",
    "tool_fire_light",
    "tool_healing",
    "tool_melee",
    "tool_pocket_pistol",
    "tool_throwable_melee",
    "tool_trap",
    "tool_other",
    "consumable_distraction",
    "consumable_effect_over_time",
    "consumable_explosion",
    "consumable_fire_light",
    "consumable_healing",
    "consumable_poison",
    "consumable_resupply",
    "consumable_other",
  ],
};

export const ITEM_TYPES = [
  {
    value: "compact_ammo",
    label: "Compact Ammo",
    slot: "COMPACT AMMO",
    weapon: true,
  },
  {
    value: "medium_ammo",
    label: "Medium Ammo",
    slot: "MEDIUM AMMO",
    weapon: true,
  },
  { value: "long_ammo", label: "Long Ammo", slot: "LONG AMMO", weapon: true },
  {
    value: "special_long_ammo",
    label: "Special Long Ammo",
    slot: "SPECIAL LONG AMMO",
    weapon: true,
  },
  {
    value: "special_ammo",
    label: "Special Ammo",
    slot: "SPECIAL AMMO",
    weapon: true,
  },
  { value: "shells", label: "Shells", slot: "SHELLS", weapon: true },
  { value: "melee", label: "Melee", slot: "MELEE", weapon: true },

  {
    value: "hunter",
    label: "Hunter",
    slot: "HUNTER",
    weapon: false,
    fixedBase: "Hunter",
  },
  {
    value: "charm",
    label: "Charm",
    slot: "CHARM",
    weapon: false,
    fixedBase: "Charm",
  },

  {
    value: "tool_distraction",
    label: "Distraction (Tool)",
    slot: "TOOL",
    weapon: false,
  },
  {
    value: "tool_fire_light",
    label: "Fire & Light (Tool)",
    slot: "TOOL",
    weapon: false,
  },
  {
    value: "tool_healing",
    label: "Healing (Tool)",
    slot: "TOOL",
    weapon: false,
  },
  { value: "tool_melee", label: "Melee (Tool)", slot: "TOOL", weapon: false },
  {
    value: "tool_pocket_pistol",
    label: "Pocket Pistol (Tool)",
    slot: "TOOL",
    weapon: false,
  },
  {
    value: "tool_throwable_melee",
    label: "Throwable Melee (Tool)",
    slot: "TOOL",
    weapon: false,
  },
  { value: "tool_trap", label: "Trap (Tool)", slot: "TOOL", weapon: false },
  { value: "tool_other", label: "Other (Tool)", slot: "TOOL", weapon: false },

  {
    value: "consumable_distraction",
    label: "Distraction (Consumable)",
    slot: "CONSUMABLE",
    weapon: false,
  },
  {
    value: "consumable_effect_over_time",
    label: "Effect Over Time (Consumable)",
    slot: "CONSUMABLE",
    weapon: false,
  },
  {
    value: "consumable_explosion",
    label: "Explosion (Consumable)",
    slot: "CONSUMABLE",
    weapon: false,
  },
  {
    value: "consumable_fire_light",
    label: "Fire & Light (Consumable)",
    slot: "CONSUMABLE",
    weapon: false,
  },
  {
    value: "consumable_healing",
    label: "Healing (Consumable)",
    slot: "CONSUMABLE",
    weapon: false,
  },
  {
    value: "consumable_poison",
    label: "Poison (Consumable)",
    slot: "CONSUMABLE",
    weapon: false,
  },
  {
    value: "consumable_resupply",
    label: "Resupply (Consumable)",
    slot: "CONSUMABLE",
    weapon: false,
  },
  {
    value: "consumable_other",
    label: "Other (Consumable)",
    slot: "CONSUMABLE",
    weapon: false,
  },
];

export const ITEM_TYPE_BY_VALUE = Object.fromEntries(
  ITEM_TYPES.map((t) => [t.value, t]),
);

export const TYPE_OPTIONS = [
  { value: "weapon", label: "Weapon" },
  { value: "hunter", label: "Hunter" },
  { value: "charm", label: "Charm" },
  { value: "utility", label: "Tools & Consumables" },
];
