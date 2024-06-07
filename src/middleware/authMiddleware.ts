import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import httpStatus from "http-status";
import config from "../config/config";
import prisma from "../client";
import { HttpError } from "../utils/HttpError";

const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        throw new HttpError(
          "Not authorized, token not found",
          httpStatus.UNAUTHORIZED
        );
      }

      const jwtSecret = config.jwt.secret;

      const decode = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decode || !decode.userId) {
        throw new HttpError(
          "Not authorized, token not found",
          httpStatus.UNAUTHORIZED
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          id: Number(decode.userId),
        },
      });

      if (!user) {
        throw new HttpError(
          "Not authorized, token not found",
          httpStatus.UNAUTHORIZED
        );
      }
      req.user = user;
      next();
    } catch (error) {
      throw new HttpError(
        "Not authorized, token not found",
        httpStatus.UNAUTHORIZED
      );
    }
  }
);

export { authMiddleware };
