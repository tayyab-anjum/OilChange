import { cookies } from "next/headers";

const OPERATOR_SECRET = process.env.OPERATOR_SECRET || "fryercare-production-secret-key-2026";
const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL || "operator@fryercare.com";
const OPERATOR_PASSWORD = process.env.OPERATOR_PASSWORD || "FryerCareMaster2026!";

export const COOKIE_NAME = "fryercare_operator_session";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Helper for edge-safe base64url
function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUint8Array(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Lightweight HMAC-SHA256 session token generator using Web Crypto API
export async function createSessionToken(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const timestamp = Date.now();
  const payloadStr = JSON.stringify({ email: email.trim().toLowerCase(), iat: timestamp });
  const data = encoder.encode(payloadStr);

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(OPERATOR_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, data);
  const b64Data = uint8ArrayToBase64Url(data);
  const b64Sig = uint8ArrayToBase64Url(new Uint8Array(signature));

  return `${b64Data}.${b64Sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    if (!token || typeof token !== "string") return false;
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [b64Data, b64Sig] = parts;
    if (!b64Data || !b64Sig) return false;

    const data = base64UrlToUint8Array(b64Data);
    const signature = base64UrlToUint8Array(b64Sig);
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(OPERATOR_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const isValidSig = await crypto.subtle.verify(
      "HMAC",
      key,
      signature as BufferSource,
      data as BufferSource
    );
    if (!isValidSig) return false;

    // Check expiration
    const decoder = new TextDecoder();
    const payload = JSON.parse(decoder.decode(data)) as { email?: string; iat?: number };
    if (!payload.iat || typeof payload.iat !== "number") return false;

    const age = Date.now() - payload.iat;
    if (age < 0 || age > SESSION_MAX_AGE_MS) {
      return false; // Expired session
    }

    return true;
  } catch {
    return false;
  }
}

export function validateOperatorCredentials(email: string, pass: string): boolean {
  if (!email || !pass) return false;
  return (
    email.trim().toLowerCase() === OPERATOR_EMAIL.trim().toLowerCase() &&
    pass === OPERATOR_PASSWORD
  );
}

export async function getOperatorSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return await verifySessionToken(token);
}
