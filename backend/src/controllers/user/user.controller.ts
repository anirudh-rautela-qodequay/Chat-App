// CRUD
import { create, find, findOne } from "../../common/methods.common";
import { sendSuccess, sendError } from "../../common/response.common";
import bcrypt from "bcrypt";
import { ERROR_MSGS, INFO_MSGS, STATUS_CODE } from "../../common/status.common";
import { Request, Response } from "express";
import { MongoServerError } from "mongodb";
import { MODELS } from "../../models/models";
export const createUser = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
      await create(MODELS.USER_MASTER, req.body);
      return sendSuccess(res, INFO_MSGS.USER_CREATED, "", STATUS_CODE.CREATED);
    }
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      const message =
        Object.keys(error.keyPattern)[0] === "email"
          ? ERROR_MSGS.EMAIL_EXISTS
          : Object.keys(error.keyPattern)[0] === "mobile_no"
          ? ERROR_MSGS.MOBILE_EXISTS
          : "";
      return sendError(res, message, STATUS_CODE.ALREADY_EXISTS, error);
    }
    return sendError(
      res,
      ERROR_MSGS.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const currentUser = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const gotUsr = await findOne(MODELS.USER_MASTER, { _id: req.user._id });
    return sendSuccess(res, INFO_MSGS.FOUND, gotUsr);
  } catch (error) {
    return sendError(
      res,
      ERROR_MSGS.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const allUsers = async (_: Request, res: Response) => {
  try {
    const gotUsrs = await find(MODELS.USER_MASTER);
    return sendSuccess(res, INFO_MSGS.FOUND, gotUsrs);
  } catch (error) {
    return sendError(
      res,
      ERROR_MSGS.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
