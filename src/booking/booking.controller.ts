import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { IdValidationPipe } from "src/pipes/id.validation.pipe";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { User } from "src/user/decorators/user.decorator";
import { User as UserDocument } from "generated/prisma";

@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth()
  async getAll(@User() user: UserDocument) {
    return this.bookingService.getAll(user);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Auth()
  async getOne(@Param("id", IdValidationPipe) id: string) {
    return this.bookingService.getOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Auth()
  async create(@User("id") userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingService.create(userId, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth()
  async delete(
    @Param("id", IdValidationPipe) id: string,
    @User() user: UserDocument,
  ) {
    return this.bookingService.delete(id, user);
  }
}
