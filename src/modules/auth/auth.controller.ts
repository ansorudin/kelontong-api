import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: RegisterDto = req.body as RegisterDto;
      const user = await this.authService.register(body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: LoginDto = req.body as LoginDto;
      const user = await this.authService.login(body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };
}
