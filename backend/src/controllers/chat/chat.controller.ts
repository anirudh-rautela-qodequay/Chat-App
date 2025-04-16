import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../common/response.common";
import { ERROR_MSGS, INFO_MSGS, STATUS_CODE } from "../../common/status.common";
import {
  create,
  find,
  findOne,
  generateCustomId,
} from "../../common/methods.common";
import { MODELS } from "../../models/models";
import NotificationService from "../../services/NotificationService";
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { email, mobile_no, message } = req.body;
    const gotSender = await findOne(MODELS.USER_MASTER, { _id: req.user._id });
    const condition: any = {};
    if (email) {
      condition.email = email;
    } else {
      condition.mobile_no = mobile_no;
    }
    const gotReceiver = await findOne(MODELS.USER_MASTER, condition);
    if (!gotReceiver) {
      return sendError(res, ERROR_MSGS.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const existingChat = await findOne(MODELS.CHAT, {
      "chat_room.people": { $all: [gotSender._id, gotReceiver._id] },
      "chat_room.people.2": { $exists: false }, // ensures exactly 2 elements
    });

    const room_id = existingChat?.chat_room?.room_id ?? generateCustomId();
    const people = [];
    people.push(gotSender._id);
    people.push(gotReceiver._id);
    const chat_room = {
      room_id,
      people,
    };

    const messageObj = {
      sender: {
        user_id: gotSender._id,
        email: gotSender.email,
        mobile_no: gotSender.mobile_no,
      },
      receiver: {
        user_id: gotReceiver._id,
        email: gotReceiver.email,
        mobile_no: gotReceiver.mobile_no,
      },
      chat_room,
      message,
    };
    await create(MODELS.CHAT, messageObj);

    await NotificationService.sendNotification(
      gotReceiver.fcm_token,
      "ChatApp",
      message
    );

    return sendSuccess(res, INFO_MSGS.MSSG_SUCCESS);
  } catch (error) {
    return sendError(
      res,
      ERROR_MSGS.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const meAndYouChat = async (req: Request, res: Response) => {
  const { email, mobile_no } = req.body;
  try {
    const condition: any = {};
    if (email) {
      condition.email = email;
    } else {
      condition.mobile_no = mobile_no;
    }
    const gotReceiver = await findOne(MODELS.USER_MASTER, condition);
    if (!gotReceiver) {
      return sendError(res, ERROR_MSGS.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    // find the people with array of [req.user._id , gotReceiver._id ]
    const chatsFindCondition: any = {
      "chat_room.people": { $all: [req.user._id, gotReceiver._id] },
      "chat_room.people.2": { $exists: false },
    };

    // const messages = await find(MODELS.CHAT, chatsFindCondition);
    const messages = await find(MODELS.CHAT, chatsFindCondition, {
      created_at: -1,
    });

    return sendSuccess(res, INFO_MSGS.MSSG_FOUND, messages);
  } catch (error) {
    return sendError(
      res,
      ERROR_MSGS.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const firebaseNotificaton = async (req: Request, res: Response) => {
  try {
    const { fcm_token, title, body } = req.body;
    await NotificationService.sendNotification(fcm_token, title, body);
    return sendSuccess(res, "Notification sent successfully");
  } catch (error) {
    return sendError(
      res,
      "Error Sending Notification",
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
