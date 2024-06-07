import httpStatus from "http-status";
import { encryptPassword, isPasswordMatch } from "../../utils/encryption";
import { LoginDto } from "./dto/login.dto";
import { User } from "@prisma/client";
import { RegisterDto } from "./dto/register.dto";
import PrismaService from "../prisma/prisma.service";
import { TokenService } from "./token.service";
import { HttpError } from "../../utils/HttpError";

export class AuthService {
  private prisma;
  private tokenService: TokenService;

  constructor() {
    this.prisma = PrismaService.getInstance();
    this.tokenService = new TokenService();
  }
  async login(loginDto: LoginDto): Promise<User & { token: string }> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });

    if (!user || !(await isPasswordMatch(password, user.password as string))) {
      throw new HttpError(
        "incorrect email or password",
        httpStatus.UNAUTHORIZED
      );
    }

    const token = this.tokenService.generateToken({
      userId: String(user.id),
      email: user.email,
    });

    return {
      ...user,
      token,
    };
  }

  async register(registerDto: RegisterDto): Promise<User & { token: string }> {
    const { email, password } = registerDto;

    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new HttpError(
        "email already used",
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const passwordEncrypt = await encryptPassword(password);

    const newUser = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: passwordEncrypt,
      },
    });

    const token = this.tokenService.generateToken({
      userId: String(newUser.id),
      email: newUser.email,
    });

    return {
      ...newUser,
      token,
    };
  }
}
