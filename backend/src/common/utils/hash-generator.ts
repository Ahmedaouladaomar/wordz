import bcrypt from 'bcrypt';

/**
 * Generate hash from password
 * @param {string} password
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  const salt = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  return bcrypt.hashSync(password, salt);
}

/**
 * Validates text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined | null,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}
