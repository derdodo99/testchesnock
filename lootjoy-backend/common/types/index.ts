export type RpsSymbol = 'rock' | 'paper' | 'scissors';
export interface SpinResult {
  label: string;
  type: 'crystals' | 'item';
  value?: number;
  itemId?: string;
  chance: number;
}
export interface TgResponse<T> {
  ok: boolean;
  result: T;
  description?: string;
}
