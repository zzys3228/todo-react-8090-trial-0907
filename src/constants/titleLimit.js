export const MAX_TITLE_LENGTH = 100;

export const AT_LIMIT_ANNOUNCEMENT = "已达到 100 字符上限";

// JavaScript string length and slice operate in UTF-16 code units, matching
// the requirement's counting and retained-prefix contract.
export function limitTitle(value) {
  return value.slice(0, MAX_TITLE_LENGTH);
}
