import { Router } from "express";
import * as ctrl from "../controllers/auth";

const router = Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", ctrl.me);
router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);

export default router;