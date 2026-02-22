import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { CreateRoomUseCase } from '@application/use-cases/room/create-room.use-case';
import { DeleteRoomUseCase } from '@application/use-cases/room/delete-room.use-case';
import { GetAllRoomsUseCase } from '@application/use-cases/room/get-all-rooms.use-case';
import { GetRoomByIdUseCase } from '@application/use-cases/room/get-room-by-id.use-case';
import { UpdateRoomUseCase } from '@application/use-cases/room/update-room.use-case';
import { CreateRoomDto, UpdateRoomDto } from '@presentation/dtos/room.dto';

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
  async create(@Body() dto: CreateRoomDto) {
    return await this.createRoomUseCase.execute({ name: dto.name });
  }

  @Get()
  async findAll() {
    return await this.getAllRoomsUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.getRoomByIdUseCase.execute({ roomId: id });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoomDto,
  ) {
    return await this.updateRoomUseCase.execute({ id, name: dto.name });
  }

  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deleteRoomUseCase.execute({ roomId: id });
  }
}
