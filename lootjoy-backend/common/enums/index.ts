export enum RpsGameStatus {
  WAITING = 'waiting', // нашли первого игрока, ждём второго или его commit
  PLAYING = 'playing', // оба зашли, ждём reveal'ы
  FINISHED = 'finished',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
}
export enum PrizeType {
  CRYSTALS = 'CRYSTALS',
  ITEM = 'ITEM',
}
