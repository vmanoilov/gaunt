import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

export function encryptApiKey(apiKey: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(SECRET_KEY, 'utf8'), iv);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return JSON.stringify({
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    ciphertext: encrypted
  });
}

export function decryptApiKey(encrypted: string): string {
  const { iv, tag, ciphertext } = JSON.parse(encrypted);
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(SECRET_KEY, 'utf8'), Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function hasApiKeyStored(encrypted: string): boolean {
  return !!encrypted;
}
