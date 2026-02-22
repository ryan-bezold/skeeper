export interface Room {
  id: string;
  name: string;
  shareCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomDto {
  name: string;
}
