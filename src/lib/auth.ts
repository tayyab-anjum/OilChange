import { cookies } from "next/headers";

const OPERATOR_SECRET = process.env.OPERATOR_SECRET || "fryercare-secret-key-change-in-production-2026";
const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL || "operator@fryercare.com";
const OPERATOR_PASSWORD = process.env.OPERATOR_PASSWORD || "FryerCareMaster2026!";

export const COOKIE_NAME = "fryercare_operator_session";

// Lightweight HMAC-SHA256 session token generator using Web Crypto API
export async function createSessionToken(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${email}:${Date.now()}`);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(OPERATOR_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const b64Data = Buffer.from(data).toString("base64url");
  const b64Sig = Buffer.from(signature).toString("base64url");
  return `${b64Data}.${b64Sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const [b64Data, b64Sig] = token.split(".");
    if (!b64Data || !b64Sig) return false;

    const encoder = new TextEncoder();
    const data = Buffer.from(b64Data, "base64url");
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(OPERATOR_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const signature = Buffer.from(b64Sig, "base64url");
    return await crypto.subtle.verify("HMAC", key, signature, data);
  } catch {
    return false;
  }
}

export function validateOperatorCredentials(email: string, pass: string): boolean {
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
