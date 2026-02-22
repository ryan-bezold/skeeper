export class Player {
  constructor(
    public readonly id: string,
    public name: string,
    public score: number,
    public readonly roomId: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  incrementScore(amount: number): void {
    this.score += amount;
    this.updatedAt = new Date();
  }

  decrementScore(amount: number): void {
    this.score -= amount;
    this.updatedAt = new Date();
  }

  setScore(value: number): void {
    this.score = value;
    this.updatedAt = new Date();
  }

  rename(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
}
