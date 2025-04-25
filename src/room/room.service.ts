import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoomDto, UpdateRoomDto } from "./dto/create-room.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const rooms = await this.prismaService.room.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        bookings: {
          where: {
            endTime: {
              gt: new Date(),
            },
          },
        },
      },
    });
    return rooms;
  }

  async getOne(id: string) {
    const room = await this.prismaService.room.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            endTime: {
              gt: new Date(),
            },
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException("Комната не найдена");
    }

    return room;
  }

  async create(dto: CreateRoomDto) {
    const newRoom = await this.prismaService.room.create({
      data: dto,
    });
    return newRoom;
  }

  async update(id: string, dto: UpdateRoomDto) {
    await this.getOne(id);

    const room = await this.prismaService.room.update({
      where: { id },
      data: dto,
    });
    return room;
  }

  async delete(id: string) {
    await this.getOne(id);

    await this.prismaService.room.delete({
      where: { id },
    });
    return null;
  }
}
