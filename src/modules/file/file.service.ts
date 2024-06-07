import path from "path";
import fs from "fs";
import { HttpError } from "../../utils/HttpError";
import httpStatus from "http-status";

export class FileService {
  constructor() {}

  getFilePath(fileName: string): string {
    return path.join(__dirname, "../../../public", fileName);
  }

  getFileUrl(fileName: string): string {
    return `/file/${fileName}`;
  }

  deleteFile(fileName: string): void {
    const filePath = this.getFilePath(fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      throw new HttpError(
        `File with name ${fileName} does not exist`,
        httpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  getFileNameFromUrl(url: string): string {
    const parts = url.split("/");
    return parts[parts.length - 1];
  }
}
