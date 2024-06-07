import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

function validationMiddleware<T>(
  type: any
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(type, req.body);

    validate(dtoInstance).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error) => Object.values(error.constraints || {}).join(", "))
          .join(", ");
        res.status(400).send({ message });
      } else {
        req.body = dtoInstance;
        next();
      }
    });
  };
}

export default validationMiddleware;
