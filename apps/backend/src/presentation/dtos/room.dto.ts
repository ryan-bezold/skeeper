import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
