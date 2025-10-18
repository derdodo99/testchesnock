export const RPS_REASON = {
  HOLD: 'RPS_HOLD',
  REFUND: 'RPS_REFUND',
  WIN: 'RPS_WIN',
} as const;

export function corr(gameId: string, tag: string, userId: string) {
  return `rps:${gameId}:${tag}:u${userId}`;
}
export const BOT_ID = '0';
