import { Router } from "express";
import { getUserLogin } from "../controllers/controllers.js";

const router = Router();

router.get("/login", getUserLogin);

export default router;
