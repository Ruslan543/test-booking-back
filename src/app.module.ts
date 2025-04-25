import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { path } from "app-root-path";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RoomService } from './room/room.service';
import { RoomController } from './room/room.controller';
import { RoomModule } from './room/room.module';
import { BookingController } from './booking/booking.controller';
import { BookingService } from './booking/booking.service';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(path, "..", "uploads"),
      serveRoot: "/",
    }),
    PrismaModule,
    AuthModule,
    RoomModule,
    BookingModule,
  ],
  controllers: [AppController, RoomController, BookingController],
  providers: [AppService, RoomService, BookingService],
})
export class AppModule {}
