import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { CreateRoomUseCase } from '@application/use-cases/room/create-room.use-case';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly createRoomUseCase: CreateRoomUseCase) {}

  @Post()
  async create(@Body() body: { name: string }) {
    return await this.createRoomUseCase.execute({ name: body.name });
  }

  @Get()
  async findAll() {
    // TODO: Implement list rooms use case
    return [];
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: Implement get room use case
    return { id };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    // TODO: Implement update room use case
    return { id, ...body };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    // TODO: Implement delete room use case
    return { id };
  }
}
