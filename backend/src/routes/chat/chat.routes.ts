import express from "express";
import JWTcheck from "../../middleware/JWTcheck.middleware";
import { onlyFormData, upload } from "../../middleware/multer.middleware";
import {
  firebaseNotificaton,
  meAndYouChat,
  sendMessage,
} from "../../controllers/chat/chat.controller";
const router = express.Router();

router.post(
  "/send-message",
  JWTcheck,
  onlyFormData(upload.none()),
  sendMessage
);
router.post(
  "/my-message-with-person",
  JWTcheck,
  // onlyFormData(upload.none()),
  upload.none(),
  meAndYouChat
);

// Testing firebase
router.post(
  "/send-firebase-notification",
  onlyFormData(upload.none()),
  firebaseNotificaton
);

// router.get("/my-messages", JWTcheck);
// router.get("/all-messages", JWTcheck);

export default router;
