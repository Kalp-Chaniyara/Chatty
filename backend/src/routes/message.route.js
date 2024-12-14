import e from "express";
import { getUsersForSideBar, getMessages, sendMessage } from "../controllers/message.controller.js";
import { validateUser } from "../middlewares/auth.middleware.js";

const router = e.Router();

router.get("/users",validateUser,getUsersForSideBar);
router.get("/:id",validateUser,getMessages);
router.post("/send/:id",validateUser,sendMessage);

export default router;