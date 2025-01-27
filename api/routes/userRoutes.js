import { Router } from "express";
import { getChatList, getChatMessages, getUserLogin } from "../controllers/controllers.js";

const router = Router();

router.get("/login", getUserLogin);
router.get("/getChatList", getChatList);
router.get("/getChatMessages", getChatMessages);

export default router;
