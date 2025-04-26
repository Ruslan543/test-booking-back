import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { compare, genSalt, hash } from "bcryptjs";
import { AuthDto } from "./dto/auth.dto";
import { RegisterDto } from "./dto/register.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const oldUser = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (oldUser) {
      throw new BadRequestException(
        "Пользователь с адресом электронной почты уже есть в системе!",
      );
    }

    const password = await this.hashingPassword(dto.password);
    const newUser = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password,
      },
    });

    const tokens = await this.issueTokenPair(newUser.id);

    return {
      user: { ...newUser, password: undefined },
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokenPair(user.id);

    return {
      user: { ...user, password: undefined },
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto) {
    const { email, password } = dto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    const isValidUser = user && (await compare(password, user.password));

    if (!isValidUser) {
      throw new UnauthorizedException("Неверный логин или пароль!");
    }

    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { id: userId };
    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: this.configService.get("JWT_EXPIRES") || "1d",
    });

    return { accessToken };
  }

  private async hashingPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
}
