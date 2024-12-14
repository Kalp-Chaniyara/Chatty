import e from "express";
import { signup,login,logout,updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { validateUser } from "../middlewares/auth.middleware.js";

const router = e.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", validateUser, updateProfile);

router.get("/check",validateUser,checkAuth)

export default router;