import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema<any>) : RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        const formattedErrors = parsed.error.format();
  
        res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: formattedErrors,
        });
        return
      }
      req.body = parsed.data;
  
      next();
    };
  };