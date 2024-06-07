import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import config from "../config/config";
import prisma from "../client";

const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Not authorized, token not found"
        );
      }

      const jwtSecret = config.jwt.secret;

      const decode = jwt.verify(token, jwtSecret) as JwtPayload;

      if (!decode || !decode.userId) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Not authorized, token not found"
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          id: Number(decode.userId),
        },
      });

      if (!user) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Not authorized, token not found"
        );
      }
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Not authorized, token not found"
      );
    }
  }
);

export { authMiddleware };
