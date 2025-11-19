import CryptoJS from 'crypto-js';

export function encryptSecret(value: string, passphrase: string): string {
  return CryptoJS.AES.encrypt(value, passphrase).toString();
}

export function decryptSecret(encrypted: string, passphrase: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, passphrase);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error('Decryption failed');
    }
    return decrypted;
  } catch (error) {
    throw new Error('Invalid passphrase or corrupted data');
  }
}

export function validatePassphrase(passphrase: string): boolean {
  return passphrase.length >= 8;
}
