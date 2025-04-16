// import { Response } from "express";
import { Request, Response, NextFunction } from "express";

import { ObjectSchema } from "joi";
import { sendError } from "../common/response.common";
import { ERROR_MSGS, STATUS_CODE } from "../common/status.common";

// Common validation function
const validation = (schema: ObjectSchema, data: any, res: Response) => {
  const { error } = schema.validate(data, { abortEarly: true });
  // console.log("Validation Error", error);
  // console.log("Validation value", value);
  // console.log("Validation warning", warning);
  if (error) {
    const firstError = error.message || ERROR_MSGS.VALIDATION_ERROR;
    sendError(
      res,
      firstError,
      STATUS_CODE.BAD_REQUEST,
      ERROR_MSGS.VALIDATION_FAILED
    );
    return false; // Return false if validation fails
  }

  return true; // Return true if validation succeeds
};



// Generic validation middleware
export const validateBody = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!validation(schema, req.body, res)) {
      return; // Stop the middleware chain if validation fails
    }
    next();
  };
};
export const validateQuery = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!validation(schema, req.query, res)) {
      return; // Stop the middleware chain if validation fails
    }
    next();
  };
};

export const validateFile = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return sendError(
        res,
        "File is required.",
        STATUS_CODE.BAD_REQUEST,
        "File validation failed"
      );
    }

    if (!validation(schema, req.file, res)) {
      return; // Stop the middleware chain if validation fails
    }
    next();
  };
};

export const validateBodyIsDraft = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.is_draft == true) {
      if (!validation(schema, req.body, res)) {
        return; // Stop the middleware chain if validation fails
      }
    }
    next();
  };
};

export const validateBodyFinal = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.is_draft == false || req.body.is_draft == "false") {
      if (!validation(schema, req.body, res)) {
        return; // Stop the middleware chain if validation fails
      }
    }
    next();
  };
};

 
