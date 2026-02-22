export interface Room {
  id: string;
  name: string;
  shareCode: string;
  playerCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomDto {
  name: string;
}
