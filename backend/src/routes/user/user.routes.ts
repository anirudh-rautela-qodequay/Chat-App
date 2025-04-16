import express  from "express";
import JWTcheck from "../../middleware/JWTcheck.middleware";
import { allUsers, currentUser } from "../../controllers/user/user.controller";
const router = express.Router();
router.get("/me", JWTcheck, currentUser);
router.get("/all-users", JWTcheck, allUsers);
export default router;
