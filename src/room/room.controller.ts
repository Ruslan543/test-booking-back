import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ROLES } from "src/auth/types/role.type";
import { RoomService } from "./room.service";
import { IdValidationPipe } from "src/pipes/id.validation.pipe";
import { CreateRoomDto, UpdateRoomDto } from "./dto/create-room.dto";

@Controller("rooms")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth()
  async getAll() {
    return this.roomService.getAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Auth()
  async getOne(@Param("id", IdValidationPipe) id: string) {
    return this.roomService.getOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Auth(ROLES.ADMIN)
  async create(@Body() dto: CreateRoomDto) {
    return this.roomService.create(dto);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Auth(ROLES.ADMIN)
  async update(
    @Param("id", IdValidationPipe) id: string,
    @Body() dto: UpdateRoomDto,
  ) {
    return this.roomService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth(ROLES.ADMIN)
  async delete(@Param("id", IdValidationPipe) id: string) {
    return this.roomService.delete(id);
  }
}
