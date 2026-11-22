const SALT = 'portfolio_salt_2026';

/**
 * Hash plain-text password using SHA-256 with static cryptographic salt
 * Compatible with modern browsers (Web Crypto API) and Node.js runtime
 */
export async function hashPassword(plainPassword) {
  if (!plainPassword) return '';
  const text = plainPassword + ':' + SALT;

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for Node / SSR / Test environments
  try {
    if (typeof window === 'undefined') {
      const nodeCrypto = await import(/* @vite-ignore */ 'crypto');
      return nodeCrypto.createHash('sha256').update(text).digest('hex');
    }
    return plainPassword;
  } catch {
    return plainPassword;
  }
}

/**
 * Verify whether plainPassword matches stored hash or legacy plain text
 */
export async function verifyPassword(plainPassword, storedPasswordOrHash) {
  if (!plainPassword || !storedPasswordOrHash) return false;

  // If stored value is a 64-character hex string, it is a SHA-256 hash
  if (/^[a-f0-9]{64}$/i.test(storedPasswordOrHash.trim())) {
    const computedHash = await hashPassword(plainPassword);
    return computedHash.toLowerCase() === storedPasswordOrHash.trim().toLowerCase();
  }

  // Backwards compatibility fallback if legacy plain-text password exists
  return plainPassword === storedPasswordOrHash;
}
