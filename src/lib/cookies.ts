import Cookies from "js-cookie";

const IS_PRODUCTION = import.meta.env.PROD;

/** Base cookie options applied to all writes */
const BASE_OPTIONS: Cookies.CookieAttributes = {
  sameSite: "Lax",
  secure: IS_PRODUCTION,
};

/**
 * Retrieves a cookie value by key.
 * Returns null if the cookie does not exist.
 */
export function getCookie(key: string): string | null {
  return Cookies.get(key) ?? null;
}

/**
 * Sets a cookie with a given value and expiry in days.
 * Defaults to 365-day expiry for persistent anonymous state.
 */
export function setCookie(
  key: string,
  value: string,
  expiresInDays = 365,
): void {
  Cookies.set(key, value, { ...BASE_OPTIONS, expires: expiresInDays });
}

/**
 * Removes a cookie by key.
 */
export function removeCookie(key: string): void {
  Cookies.remove(key, BASE_OPTIONS);
}

/**
 * Retrieves and JSON-parses a cookie value.
 * Returns null if missing or unparseable.
 */
export function getCookieJSON<T>(key: string): T | null {
  const raw = getCookie(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * JSON-serializes a value and stores it as a cookie.
 */
export function setCookieJSON<T>(
  key: string,
  value: T,
  expiresInDays = 365,
): void {
  setCookie(key, JSON.stringify(value), expiresInDays);
}

/**
 * Returns a persistent anonymous user ID, creating one if it doesn't exist.
 * Stored for 365 days so the identity survives browser restarts.
 */
export function getAnonymousUserId(): string {
  const COOKIE_KEY = "pw_user_id";
  let userId = getCookie(COOKIE_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    setCookie(COOKIE_KEY, userId, 365);
  }
  return userId;
}
