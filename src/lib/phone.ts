/**
 * Egyptian mobile phone helpers.
 *
 * Rules:
 *  - 11 digits total
 *  - Starts with "01"
 *  - Remaining 9 digits are any 0-9
 *    (010 / 011 / 012 / 015 / 016 / 019 all pass)
 */

export const EG_PHONE_DIGITS = 11;

export const EG_PHONE_REGEX = /^01[0-9]{9}$/;

/** Strip everything except digits, cap at 11. */
export function digitsOnly(input: string, max = EG_PHONE_DIGITS): string {
  return input.replace(/\D+/g, "").slice(0, max);
}

/** Is this a valid Egyptian mobile number? */
export function isValidEgPhone(digits: string): boolean {
  return EG_PHONE_REGEX.test(digits);
}

/**
 * Format 11 digits for display as `0101 234 5678`.
 * Partial input renders progressively:
 *   "010"      → "010"
 *   "0101234"  → "0101 234"
 *   "01012345678" → "0101 234 5678"
 */
export function formatEgPhone(digits: string): string {
  const d = digitsOnly(digits);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 11)}`;
}