import express, { Request, Response } from "express";
import JWTcheck from "../middleware/JWTcheck.middleware";
import user from "../routes/user/user.routes";
import auth from "../routes/auth/auth.routes";
import chat from "../routes/chat/chat.routes";
import { onlyFormData, upload } from "../middleware/multer.middleware";
const router = express.Router();

// --- Public Route ---
router.post(
  "/unsecured",
  onlyFormData(upload.none()),
  (req: Request, res: Response) => {
    console.log("Req.Body", req.body);
    res.send("Hello to the Unsecured World!");
  }
);

// --- Protected Route ---
router.post(
  "/secured",
  onlyFormData(upload.none()),
  JWTcheck,
  (req: Request, res: Response) => {
    console.log("Req.Body", req.body);
    res.send("You are verified!");
  }
);

// All Routes
router.use("/auth", auth);
router.use("/user", user);
router.use("/chat", chat);

export default router;
