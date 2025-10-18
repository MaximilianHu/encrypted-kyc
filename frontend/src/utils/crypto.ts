// Lightweight AES-GCM utilities using Web Crypto

async function importKeyFromAddress(address: string): Promise<CryptoKey> {
  // Derive a key from the address string using PBKDF2
  const enc = new TextEncoder();
  const salt = enc.encode("encrypted-identity:v1");
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(address.toLowerCase()),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptNameWithAddress(name: string, address: string): Promise<string> {
  const key = await importKeyFromAddress(address);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(name);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext));
  const payload = new Uint8Array(iv.length + ciphertext.length);
  payload.set(iv, 0);
  payload.set(ciphertext, iv.length);
  return btoa(String.fromCharCode(...payload));
}

export async function decryptNameWithAddress(encB64: string, address: string): Promise<string> {
  const key = await importKeyFromAddress(address);
  const bytes = Uint8Array.from(atob(encB64), c => c.charCodeAt(0));
  const iv = bytes.slice(0, 12);
  const data = bytes.slice(12);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(plaintext);
}

