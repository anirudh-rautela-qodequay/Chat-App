import { Schema, model, Document, Model } from "mongoose";
import { COLLECTIONS } from "../database/collections";
import { generateCustomeId } from "../common/methods.common";
export interface IUser extends Document {
  name: String | null;
  email: String | null;
  password: String | null;
  role_type: String | null;
  fcm_token: String | null;
  generated_user_id: String | null;
  profile_image: String | null;
  is_active: boolean;
  is_deleted: boolean;
  mobile_no: Number | null;
  otp: Number | null;
  otp_expire_time: Date | null;
  country_code: Number;
  device_id: String | null;
  is_email_verified: boolean;
  is_mobile_verified: boolean;
  reset_password_token: String | null;
  reset_password_token_expire_time: Date | null;
  added_by: Schema.Types.ObjectId | null;
  modified_by: Schema.Types.ObjectId | null;
  deleted_by: Schema.Types.ObjectId | null;
  deleted_date: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: false },
    email: { type: String, required: false, default: null, unique: true },
    password: { type: String, required: false, default: null },
    role_type: { type: String, default: null },
    fcm_token: { type: String, default: null },
    generated_user_id: { type: String, default: null },
    profile_image: { type: String, default: null },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    mobile_no: { type: Number, default: null, unique: true },
    otp: { type: Number, default: null },
    otp_expire_time: { type: Date, default: null },
    country_code: { type: Number, default: 91 },
    device_id: { type: String, default: null },
    is_email_verified: { type: Boolean, default: false },
    is_mobile_verified: { type: Boolean, default: false },
    reset_password_token: { type: String, default: null },
    reset_password_token_expire_time: { type: Date, default: null },
    added_by: { type: Schema.Types.ObjectId, default: null },
    modified_by: { type: Schema.Types.ObjectId, default: null },
    deleted_by: { type: Schema.Types.ObjectId, default: null },
    deleted_date: { type: Date, default: null },
  },
  {
    timestamps: {
      createdAt: "creation_date",
      updatedAt: "modified_date",
    },
  }
);

// Pre-save hook to generate 'generated_lead_id'
UserSchema.pre<IUser>("save", async function (next) {
  const user = this;

  // Only generate a new ID if it doesn't already exist
  if (!user.generated_user_id) {
    try {
      // Cast this.constructor to the correct model type
      const UserModel = this.constructor as Model<IUser>;
      user.generated_user_id = await generateCustomeId(
        UserModel,
        "generated_user_id",
        "#"
      );

      next();
    } catch (error: any) {
      next(error);
    }
  } else {
    next();
  }
});

export const user = model<IUser>(COLLECTIONS.USER_MASTER, UserSchema);
