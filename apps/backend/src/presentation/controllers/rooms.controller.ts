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
import {DeleteRoomUseCase} from "@application/use-cases/room/delete-room.use-case";
import {GetAllRoomsUseCase} from "@application/use-cases/room/get-all-rooms.use-case";
import {GetRoomByIdUseCase} from "@application/use-cases/room/get-room-by-id.use-case";
import {UpdateRoomUseCase} from "@application/use-cases/room/update-room.use-case";

@Controller('rooms')
export class RoomsController {
  constructor(
      private readonly createRoomUseCase: CreateRoomUseCase,
      private readonly deleteRoomUseCase: DeleteRoomUseCase,
      private readonly getAllRoomsUseCase: GetAllRoomsUseCase,
      private readonly getRoomByIdUseCase: GetRoomByIdUseCase,
      private readonly updateRoomUseCase: UpdateRoomUseCase,
  ) {}

  @Post()
  async create(@Body() body: { name: string }) {
    return await this.createRoomUseCase.execute({ name: body.name });
  }

  @Get()
  async findAll() {
    return await this.getAllRoomsUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getRoomByIdUseCase.execute({roomId: id});
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return await this.updateRoomUseCase.execute({id, ...body});
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.deleteRoomUseCase.execute({roomId: id});
  }
}
