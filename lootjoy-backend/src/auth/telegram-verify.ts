import crypto from 'crypto';
import { VerifyAnswer } from '@src/auth/types';

export function verifyTelegramInitData(
  botToken: string,
  initData: string,
  maxAgeSec = 120,
): VerifyAnswer {
  if (!initData) return { ok: false, reason: 'missing_init_data' };

  const params = new URLSearchParams(initData);
  const hash = params.get('hash') ?? '';
  if (!hash) return { ok: false, reason: 'missing_hash' };

  const kv: [string, string][] = [];
  params.forEach((v, k) => {
    if (k !== 'hash') kv.push([k, v]);
  });
  kv.sort(([a], [b]) => a.localeCompare(b));
  const dataCheckString = kv.map(([k, v]) => `${k}=${v}`).join('\n');

  const secretKey = crypto
    .createHmac('sha256', crypto.createHash('sha256').update(botToken).digest())
    .update('WebAppData')
    .digest();

  const calc = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (calc !== hash) return { ok: false, reason: 'bad_hash' };

  const authDate = Number(params.get('auth_date') || 0);
  const now = Math.floor(Date.now() / 1000);
  if (!authDate || now - authDate > maxAgeSec) return { ok: false, reason: 'expired' };

  const payload: Record<string, string> = {};
  kv.forEach(([k, v]) => (payload[k] = v));
  return { ok: true, payload };
}
