import { Router } from "express";
import { getChatList, getUserLogin } from "../controllers/controllers.js";

const router = Router();

router.get("/login", getUserLogin);
router.get("/getChatList", getChatList);

export default router;
