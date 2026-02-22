import { IsString, IsNotEmpty, IsIn, IsNumber } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdatePlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateScoreDto {
  @IsIn(['increment', 'decrement', 'set'])
  operation: 'increment' | 'decrement' | 'set';

  @IsNumber()
  value: number;
}
