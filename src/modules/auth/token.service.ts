import jwt from "jsonwebtoken";
import config from "../../config/config";
import { TokenPayload } from "./types";

export class TokenService {
  public generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: "24h" });
  }
}
