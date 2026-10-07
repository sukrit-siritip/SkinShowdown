export const TYPE_GROUPS = {
  weapon: ["rifle", "shotgun", "pistol", "melee"],
  hunter: ["hunter"],
  charm: ["charm"],
  utility: ["tool", "consumable"],
};

export const ITEM_TYPES = [
  { value: "rifle", label: "Rifle", slot: "RIFLE", weapon: true },
  { value: "shotgun", label: "Shotgun", slot: "SHOTGUN", weapon: true },
  { value: "pistol", label: "Pistol", slot: "SIDEARM", weapon: true },
  { value: "melee", label: "Melee", slot: "MELEE", weapon: true },
  { value: "hunter", label: "Hunter", slot: "HUNTER", weapon: false, fixedBase: "Hunter" },
  { value: "charm", label: "Charm", slot: "CHARM", weapon: false, fixedBase: "Charm" },
  { value: "tool", label: "Tool", slot: "TOOL", weapon: false },
  { value: "consumable", label: "Consumable", slot: "CONSUMABLE", weapon: false },
];

export const ITEM_TYPE_BY_VALUE = Object.fromEntries(ITEM_TYPES.map((t) => [t.value, t]));

export const TYPE_OPTIONS = [
  { value: "weapon", label: "Weapon" },
  { value: "hunter", label: "Hunter" },
  { value: "charm", label: "Charm" },
  { value: "utility", label: "Tools & Consumables" },
];
