// Mirror of the standalone app's CATEGORY_ICONS map. Visual icons let users
// scan categories without reading English category names — a meaningful
// accessibility improvement for BSL-first users.
//
// Keys must match the canonical category strings produced by the publisher's
// `normalizeCategory`. Add new keys here when a new category appears in the
// feed. Falls back to "🎟️" for unknown categories.

export const CATEGORY_ICONS: Record<string, string> = {
  All: "🎭",
  Concert: "🎤",
  Sports: "🏟️",
  Festival: "🎪",
  "Camping Festival": "⛺",
  "Non-Camping Festival": "🎵",
  Comedy: "😂",
  Family: "👨‍👩‍👧‍👦",
  Literature: "📚",
  Theatre: "🎭",
  Dance: "💃",
  "Talks & Discussions": "🗣️",
  Cultural: "🏛️",
  Other: "🎟️",
};

export function iconForCategory(category: string): string {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.Other;
}

// Display order for the category grid. Categories not in this list are
// appended alphabetically after the ordered ones.
export const CATEGORY_ORDER = [
  "Concert",
  "Sports",
  "Festival",
  "Comedy",
  "Family",
  "Theatre",
  "Dance",
  "Talks & Discussions",
  "Cultural",
  "Literature",
  "Other",
];
