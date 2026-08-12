import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

// AES-256-GCM at-rest encryption for the GitHub access token stored on
// GithubConnection.accessTokenEncrypted. Output packs iv + authTag +
// ciphertext (all base64) into one '.'-delimited string so no extra columns
// are needed to decrypt later.
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 12;

function toKeyBuffer(hexKey: string): Buffer {
  const key = Buffer.from(hexKey, 'hex');
  if (key.length !== 32) {
    throw new Error(
      'GITHUB_TOKEN_ENCRYPTION_KEY must be a 32-byte key encoded as 64 hex characters.',
    );
  }
  return key;
}

export function encryptToken(plainText: string, hexKey: string): string {
  const key = toKeyBuffer(hexKey);
  const iv = randomBytes(IV_LENGTH_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [iv, authTag, encrypted]
    .map((buffer) => buffer.toString('base64'))
    .join('.');
}

export function decryptToken(encoded: string, hexKey: string): string {
  const [ivB64, authTagB64, dataB64] = encoded.split('.');
  if (!ivB64 || !authTagB64 || !dataB64) {
    throw new Error('Malformed encrypted GitHub token.');
  }

  const key = toKeyBuffer(hexKey);
  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivB64, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(authTagB64, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
