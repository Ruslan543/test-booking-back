import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateBookingDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;
}
