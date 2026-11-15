// Serialises structured data for a <script type="application/ld+json"> block.
// JSON.stringify alone is not safe there: a string containing "</script>"
// ends the block early and anything after it runs as HTML. Event text comes
// from the events sheet, which is filled from third-party pages, so escape the
// characters HTML cares about. The escapes are valid JSON, so the data search
// engines read is unchanged. Keep this file ASCII: a literal U+2028 inside the
// regex below would end the line and break the build.
const UNSAFE: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (c) => UNSAFE[c]);
}
