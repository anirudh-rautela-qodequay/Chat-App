import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { STATUS_CODE, ERROR_MSGS } from "../common/status.common";
import { sendError } from "../common/response.common";
import { findOne } from "../common/methods.common";
import { MODELS } from "../models/models";

const JWTcheck = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  // console.log("🚀 ~ auth ~ token:", token);
  if (!token) {
    return sendError(res, ERROR_MSGS.TOKEN_MISSING, STATUS_CODE.UNAUTHORIZED);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!);
    const foundUser = await findOne(MODELS.USER_MASTER, { _id: req.user._id });
    if (!foundUser) {
      return sendError(res, ERROR_MSGS.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
      console.log("JWT Error:", {
        name: err.name,
        message: err.message,
      });
    } else {
      console.log("Auth Error:", err);
    }
    return sendError(
      res,
      ERROR_MSGS.UNAUTHORIZED,
      STATUS_CODE.UNAUTHORIZED,
      err
    );
  }
};
export default JWTcheck;
