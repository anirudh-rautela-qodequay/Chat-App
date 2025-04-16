import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../common/response.common";
import { ERROR_MSGS, INFO_MSGS, STATUS_CODE } from "../../common/status.common";
import { findOne, update } from "../../common/methods.common";
import bcrypt from "bcrypt";
import { create_token } from "../../utils/token.utils";
import { MODELS } from "../../models/models";

export const login = async (req: Request, res: Response) => {
  //   const { email, password, fcm_token } = req.body;
  try {
    const { email, mobile_no, password, fcm_token } = req.body;
    const condition: any = {};
    if (email) {
      condition.email = email;
    } else if (mobile_no) {
      condition.mobile_no = mobile_no;
    } else {
      return sendError(
        res,
        ERROR_MSGS.EITHER_EMAIL_OF_MOBILE,
        STATUS_CODE.NOT_FOUND
      );
    }
    const gotUsr = await findOne(MODELS.USER_MASTER, condition);

    // console.log("User", gotUsr);
    if (!gotUsr) {
      return sendError(
        res,
        ERROR_MSGS.INVALID_CREDENTIALS,
        STATUS_CODE.UNAUTHORIZED
      );
    }
    const isPasswordValid = await bcrypt.compare(password, gotUsr.password);
    if (!isPasswordValid) {
      return sendError(
        res,
        ERROR_MSGS.INVALID_PASSWORD,
        STATUS_CODE.UNAUTHORIZED
      );
    }
    const user = await update(MODELS.USER_MASTER, condition, { fcm_token: fcm_token });
    const token = await create_token(user._id);
    return sendSuccess(res, INFO_MSGS.LOGIN_SUCCESS, {
      ...user.toObject(),
      token,
    });
  } catch (error) {
    return sendError(
      res,
      ERROR_MSGS.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
