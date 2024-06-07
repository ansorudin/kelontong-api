import { PrismaClient } from "@prisma/client";
import config from "../../config/config";

class PrismaService {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient();

      if (config.env === "development") {
        // Add a hook to disconnect Prisma when the Node.js process ends
        process.on("SIGINT", async () => {
          await PrismaService.instance.$disconnect();
          process.exit(0);
        });
      }
    }

    return PrismaService.instance;
  }
}

export default PrismaService;
