import { Schema, model, Document } from "mongoose";
import { COLLECTIONS } from "../database/collections";

export interface IChat extends Document {
  sender: { user_id: Schema.Types.ObjectId; email: string; mobile_no: Number };
  receiver: {
    user_id: Schema.Types.ObjectId;
    email: string;
    mobile_no: Number;
  };
  message: string;
  message_type: "text" | "image" | "video" | "file"; // you can add more types
  is_delivered: boolean;
  is_read: boolean;
  delivered_at: Date;
  sent_at: Date;
  read_at?: Date;
  deleted_at?: Date;
  chat_room: { room_id: string; people: Schema.Types.ObjectId[] };
}

const ChatSchema = new Schema<IChat>(
  {
    sender: {
      user_id: {
        type: Schema.Types.ObjectId,
        ref: COLLECTIONS.USER_MASTER,
        required: true,
      },
      email: { type: String, default: null },
      mobile_no: { type: Number, default: null },
    },
    receiver: {
      user_id: {
        type: Schema.Types.ObjectId,
        ref: COLLECTIONS.USER_MASTER,
        required: true,
      },
      email: { type: String, default: null },
      mobile_no: { type: Number, default: null },
    },
    message: { type: String, required: true },
    message_type: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },
    is_delivered: { type: Boolean, default: false },
    is_read: { type: Boolean, default: false },
    sent_at: { type: Date, default: Date.now },
    read_at: { type: Date, default: null },
    delivered_at: { type: Date, default: null },
    deleted_at: { type: Date, default: null },
    chat_room: {
      room_id: { type: String, default: null },
      people: [
        {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
      ],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const chat = model<IChat>(COLLECTIONS.CHATS, ChatSchema);
