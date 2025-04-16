import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { sendError } from "../common/response.common";
import { ERROR_MSGS, STATUS_CODE } from "../common/status.common";

// Set up multer (memory or disk)
export const upload = multer({ storage: multer.memoryStorage() });

/**
 * Wraps multer middleware with a check for multipart/form-data
 */
export const onlyFormData =
  (multerMiddleware: any) =>
    (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers["content-type"] || "";
      // console.log("req.headers", req.headers);
    if (!contentType.includes("multipart/form-data")) {
      return sendError(
        res,
        ERROR_MSGS.ONLY_MULTIPART_OR_FORM_DATA,
        STATUS_CODE.UNSUPPORTED_MEDIA_TYPE
      );
    }

    // Pass request to multer middleware
    return multerMiddleware(req, res, next);
  };
