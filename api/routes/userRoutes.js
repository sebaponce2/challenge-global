import { Router } from "express";
import {
  createNewMessage,
  getChatList,
  getChatMessages,
  getUserLogin,
  updateUserData,
} from "../controllers/controllers.js";

const router = Router();

router.get("/login", getUserLogin);
router.get("/getChatList", getChatList);
router.get("/getChatMessages", getChatMessages);
router.post("/createNewMessage", createNewMessage);
router.put("/updateUserData", updateUserData);

export default router;
