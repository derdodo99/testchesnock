export class QueueDto {
  bet!: number;
} // POST /rps/queue
export class CreatePrivateDto {
  bet!: number;
  opponentId!: string;
} // POST /rps/duel
export class CommitDto {
  gameId!: string;
  commitHash!: string;
} // POST /rps/commit
export class RevealDto {
  gameId!: string;
  symbol!: 'rock' | 'paper' | 'scissors';
  nonce!: string;
} // POST /rps/reveal
export class StateParams {
  gameId!: string;
}
