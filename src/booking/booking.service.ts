import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { RoomService } from "src/room/room.service";
import { Prisma, User } from "generated/prisma";
import { ROLES } from "src/auth/types/role.type";

@Injectable()
export class BookingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomService: RoomService,
  ) {}

  async getAll(user: User) {
    const filter: Prisma.BookingFindManyArgs = {
      orderBy: { createdAt: "desc" },
      include: { room: true },
    };

    if (user.roles.includes(ROLES.ADMIN)) {
      return await this.prismaService.booking.findMany(filter);
    }

    return await this.prismaService.booking.findMany({
      where: { userId: user.id },
      ...filter,
    });
  }

  async getOne(id: string) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!booking) {
      throw new NotFoundException("Бронирование не найдено");
    }

    return booking;
  }

  async create(userId: string, dto: CreateBookingDto) {
    const { roomId, startTime, endTime } = dto;
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      throw new BadRequestException(
        "Время окончания должно быть позже времени начала",
      );
    }

    const room = await this.roomService.getOne(roomId);
    if (room.bookings.length >= room.capacity) {
      throw new BadRequestException(`У комнаты закончились свободные места`);
    }

    const conflictingBooking = await this.prismaService.booking.findFirst({
      where: {
        roomId,
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new BadRequestException(
        "Комната уже забронирована на этот временной интервал",
      );
    }

    const newBooking = await this.prismaService.booking.create({
      data: {
        userId,
        roomId,
        startTime: start,
        endTime: end,
      },
    });
    return newBooking;
  }

  async delete(id: string, user: User) {
    const booking = await this.getOne(id);

    if (booking.userId !== user.id && !user.roles.includes(ROLES.ADMIN)) {
      throw new ForbiddenException(
        "Вы можете отменить только свои бронирования",
      );
    }

    await this.prismaService.booking.delete({ where: { id } });
    return null;
  }
}
