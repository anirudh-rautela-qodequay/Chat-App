import express from "express";
import { createUser } from "../../controllers/user/user.controller";
import {
  userCreateSchema,
  userLoginSchema,
} from "../../validations/user/user.validations";
import { onlyFormData, upload } from "../../middleware/multer.middleware";
import { login } from "../../controllers/auth/auth.controller";
import { validateBody } from "../../middleware/validation.middleware";
const router = express.Router();
router.post(
  "/register",
  onlyFormData(upload.none()),
  validateBody(userCreateSchema),
  createUser
);
router.post(
  "/login",
  onlyFormData(upload.none()),
  validateBody(userLoginSchema),
  login
);
export default router;
