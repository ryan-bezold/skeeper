export type ScoreChangeType = 'increment' | 'decrement' | 'set';

export class ScoreHistory {
  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly previousScore: number,
    public readonly newScore: number,
    public readonly changeAmount: number,
    public readonly changeType: ScoreChangeType,
    public readonly createdAt: Date,
  ) {}

  static create(
    id: string,
    playerId: string,
    previousScore: number,
    newScore: number,
    changeType: ScoreChangeType,
  ): ScoreHistory {
    const changeAmount = newScore - previousScore;
    return new ScoreHistory(
      id,
      playerId,
      previousScore,
      newScore,
      changeAmount,
      changeType,
      new Date(),
    );
  }
}
