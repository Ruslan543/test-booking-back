import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomModule } from "src/room/room.module";

@Module({
  imports: [RoomModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
