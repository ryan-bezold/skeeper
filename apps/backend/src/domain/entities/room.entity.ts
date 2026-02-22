export class Room {
  public playerCount?: number;

  constructor(
    public readonly id: string,
    public name: string,
    public readonly shareCode: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    playerCount?: number,
  ) {
    this.playerCount = playerCount;
  }

  rename(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
}
