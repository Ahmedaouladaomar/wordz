import bcrypt from 'bcrypt';

/**
 * Generate hash from string
 * @param {string} str
 * @returns {string}
 */
export function generateHash(str: string): string {
  const salt = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  return bcrypt.hashSync(str, salt);
}

/**
 * Validates text with hash
 * @param {string} str
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  str: string | undefined,
  hash: string | undefined | null,
): Promise<boolean> {
  if (!str || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(str, hash);
}
