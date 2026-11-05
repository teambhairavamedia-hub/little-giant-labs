// Admin dashboard search: one text box matching company or brand name, email or contact name.

export const ADMIN_SEARCH_MAX_LENGTH = 100;

/** The columns the search looks in: company or brand name, email and contact name. */
export const ADMIN_SEARCH_COLUMNS = ["legal_name", "decision_maker_email", "contact_name"] as const;

/**
 * The trimmed search text, "" when there is none, or null when it is too long. Control characters are dropped and
 * runs of spaces collapsed, so pasted text matches what an admin sees.
 */
export function normalizeAdminSearch(raw: string | null | undefined): string | null {
  const text = (raw ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return text.length > ADMIN_SEARCH_MAX_LENGTH ? null : text;
}

/**
 * A Supabase `.or()` filter matching the text anywhere in any search column, ignoring case. The text is matched
 * literally: LIKE wildcards (`%`, `_`) and backslashes are escaped, and each value is quoted so commas, brackets and
 * dots in the text can't change the filter.
 */
export function adminSearchFilter(text: string): string {
  const literal = text.replace(/[\\%_]/g, (character) => `\\${character}`);
  const quoted = `"%${literal.replace(/["\\]/g, (character) => `\\${character}`)}%"`;
  return ADMIN_SEARCH_COLUMNS.map((column) => `${column}.ilike.${quoted}`).join(",");
}
