import crypto from 'crypto';

// AES-256-GCM ile şifreleme/çözme yardımcıları
const RAW_KEY = process.env.APP_ENCRYPTION_KEY || 'default-dev-key-please-change-32bytes!';
// 32 byte'e normalize et
const KEY = crypto.createHash('sha256').update(RAW_KEY).digest();

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decrypt(payloadBase64: string): string {
  try {
    const payload = Buffer.from(payloadBase64, 'base64');
    const iv = payload.subarray(0, 12);
    const tag = payload.subarray(12, 28);
    const enc = payload.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
    return dec.toString('utf8');
  } catch (e) {
    return '';
  }
}


