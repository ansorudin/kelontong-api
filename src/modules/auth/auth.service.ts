import httpStatus from "http-status";
import ApiError from "../../utils/ApiError";
import { encryptPassword, isPasswordMatch } from "../../utils/encryption";
import { LoginDto } from "./dto/login.dto";
import { User } from "@prisma/client";
import { RegisterDto } from "./dto/register.dto";
import PrismaService from "../prisma/prisma.service";
import { TokenService } from "./token.service";

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
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "incorrect email or password"
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
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "email already used");
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
