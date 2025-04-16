import Joi from "joi";

export const userQuerySchema = Joi.object({
  user_id: Joi.string().required(),
});

export const userCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `Name is a required field`,
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "any.required": `Email is a required field`,
    }),
  mobile_no: Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    .required()
    .messages({
      "number.base": `Mobile Number should be a type of 'number'`,
      "number.empty": `Mobile Number cannot be an empty field`,
      "number.min": `Mobile Number must be exactly 10 digits.`,
      "number.max": `Mobile Number must be exactly 10 digits.`,
      "any.required": `Mobile Number is a required field`,
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "string.empty": "Password cannot be an empty field.",
      "any.required": "Password is a required field.",
    }),
});
export const userLoginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    // .required()
    .optional()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": `Email cannot be an empty field`,
      "any.required": `Email is a required field`,
    }),
  mobile_no: Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    // .required()
    .optional()
    .messages({
      "number.base": `Mobile Number should be a type of 'number'`,
      "number.empty": `Mobile Number cannot be an empty field`,
      "number.min": `Mobile Number must be exactly 10 digits.`,
      "number.max": `Mobile Number must be exactly 10 digits.`,
      "any.required": `Mobile Number is a required field`,
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "string.empty": "Password cannot be an empty field.",
      "any.required": "Password is a required field.",
    }),
  fcm_token: Joi.string().required().messages({
    "string.empty": `FCM Token cannot be an empty field`,
    "any.required": `FCM Token is a required field`,
  }),
});

export const userUpdateSchema = Joi.object({
  user_id: Joi.string().optional(),
  name: Joi.string().optional(),
  mobile_no: Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    .optional()

    .messages({
      "number.base": `"mobile_no" should be a type of 'number'`,
      "number.empty": `"mobile_no" cannot be an empty field`,
      "number.min": `"mobile_no" must be exactly 10 digits.`,
      "number.max": `"mobile_no" must be exactly 10 digits.`,
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .messages({
      "string.email": "Please provide a valid email address.",
    }),
  is_active: Joi.boolean().optional(),
  profile_image: Joi.string().optional(),
});
