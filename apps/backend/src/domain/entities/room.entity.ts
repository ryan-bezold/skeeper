export class Room {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly shareCode: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  rename(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
}
